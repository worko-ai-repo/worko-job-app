import { JobDashboardEnum, JobStatusEnum } from "../enums/Job.enum";
import { jobServiceObj } from "../services/Job.service";
import { JobListingFilterOptions } from "../dtos/Job.dto";
import { GcpFirestoreRecordListingResponseDTO } from "../dtos/Common.gcp-firestore.dto";
import { JobsWithOrWithoutEntityDetails } from "../types/Job.type";
import { GcpFirestoreSortOrderTypeEnum } from "../enums/Common.gcp-firestore.enum";
import APP_CONSTANTS from "../configs/constants.config";
import { awsS3ClientLibrary } from "../configs/aws-sdk.config";
import { DbGcpFirestoreJobDto } from "../db/gcp-firestore-models/GcpFirestoreJob.model";

interface SitemapUrl {
  loc: string;

  /**
   * @description
   * @example
   */
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

class SitemapService {
  // S3 bucket name from environment variable
  private readonly sitemapBucketName: string;
  // s3://<APP_AWS_S3_BUCKET_WORKO_UI_COMP_LOGO>/sitemaps/sitemap.xml
  private readonly sitemapKey: string;
  // Frontend base URL from environment variable
  private readonly baseUrl: string;

  constructor() {
    const frontendBaseUrl: string | undefined = process.env.APP_WORKO_FRONTEND_BASE_URL;
    const s3BucketName: string | undefined = process.env.APP_AWS_S3_BUCKET_WORKO_UI_COMP_LOGO;
    const sitemapKey: string | undefined = APP_CONSTANTS.AWS_S3_DIR_PATHS.SITEMAP_S3_DIR_PATH;

    if (!frontendBaseUrl || !s3BucketName || !sitemapKey) {
      global.logger.error("Required environment variables are not defined", {
        APP_WORKO_FRONTEND_BASE_URL: frontendBaseUrl,
        APP_AWS_S3_BUCKET_WORKO_UI_COMP_LOGO: s3BucketName,
        SITEMAP_S3_DIR_PATH: sitemapKey,
      });
      throw new Error("Required environment variables are missing");
    }

    this.baseUrl = frontendBaseUrl;
    this.sitemapBucketName = s3BucketName;
    this.sitemapKey = sitemapKey;
  }

  /**
   * Generates the complete sitemap XML.
   * Ensures total runtime stays under ~25 seconds
   */
  async generateSitemapXml(): Promise<string> {
    const pageSize: number = 500;
    const maxDurationMs: number = 25_000; // 25 seconds
    const startedAt: number = Date.now();

    const allJobs: JobsWithOrWithoutEntityDetails = [];
    let lastKey: string | undefined = undefined;

    // Paginate through all published jobs
    do {
      if (Date.now() - startedAt > maxDurationMs) {
        // Time guard – break to avoid exceeding 30s
        break;
      }

      const filterOptions: JobListingFilterOptions = {
        status: JobStatusEnum.PUBLISHED,
        dashboard: JobDashboardEnum.USER,
        pageSize,
        sortOrder: GcpFirestoreSortOrderTypeEnum.DESCENDING,
        includeCompanyDetails: false,
        ...(lastKey ? { lastKey: { gcpFirestoreDocumentId: lastKey } } : {}),
      };

      const page: GcpFirestoreRecordListingResponseDTO<JobsWithOrWithoutEntityDetails> =
        await jobServiceObj.getAllJobsByDashboardFilterOptions(filterOptions);

      // Accumulate jobs
      if (Array.isArray(page.data) && page.data.length > 0) {
        allJobs.push(...page.data);
      }

      lastKey = page.pagination?.lastKey;
    } while (lastKey);

    const staticUrls: SitemapUrl[] = this.generateStaticPageUrls(this.baseUrl);
    const jobUrls: SitemapUrl[] = this.generateJobSitemapUrls(allJobs, this.baseUrl);
    const allUrls: SitemapUrl[] = [...staticUrls, ...jobUrls];

    return this.generateSitemapXML(allUrls);
  }

  /**
   * Returns sitemap.xml from S3 if present; otherwise generates it,
   * uploads to S3, and returns the generated XML.
   */
  async getOrGenerateSitemapFromS3(): Promise<string> {
    // If S3 is not configured, fall back to on-the-fly generation
    if (!this.sitemapBucketName) {
      return this.generateSitemapXml();
    }

    const existing = await this.getSitemapFromS3();
    if (existing) {
      return existing;
    }

    const xml = await this.generateSitemapXml();
    await this.saveSitemapToS3(xml);
    return xml;
  }

  /**
   * Adds or updates a single job entry in sitemap.xml stored on S3.
   * - If the job is not PUBLISHED or isDeleted, its entry is removed.
   * - If the job is PUBLISHED, its entry is (re)inserted with latest URL.
   */
  async addOrUpdateJobInSitemap(job: DbGcpFirestoreJobDto): Promise<void> {
    if (!this.sitemapBucketName) return;

    // Only keep published, non-deleted jobs in sitemap
    if (job.status !== JobStatusEnum.PUBLISHED || job.isDeleted) {
      await this.removeJobFromSitemap(job.id);
      return;
    }

    let xml: string = await this.getOrGenerateSitemapFromS3();

    // Remove any existing entries for this jobId (old slug, etc.)
    xml = this.removeJobFromXml(xml, job.id);

    const urlEntry: string = this.buildJobUrlEntry(job);

    const closingTag: string = "</urlset>";
    const closingTagIndex: number = xml.lastIndexOf(closingTag);

    if (closingTagIndex === -1) {
      // Fallback: regenerate entirely if sitemap is malformed
      const regenerated: string = await this.generateSitemapXml();
      await this.saveSitemapToS3(regenerated);
      return;
    }

    const updatedXml: string =
      xml.slice(0, closingTagIndex) + urlEntry + xml.slice(closingTagIndex);

    await this.saveSitemapToS3(updatedXml);
  }

  /**
   * Syncs sitemap.xml based on before/after job state.
   * Intended to be called from update handlers.
   */
  async syncJobInSitemap(
    jobBeforeUpdate: DbGcpFirestoreJobDto | undefined,
    jobAfterUpdate: DbGcpFirestoreJobDto | undefined
  ): Promise<void> {
    if (!jobAfterUpdate) return;

    const jobId: string = jobAfterUpdate.id;
    const wasPublished: boolean =
      jobBeforeUpdate?.status === JobStatusEnum.PUBLISHED && !jobBeforeUpdate.isDeleted;
    const isPublished: boolean =
      jobAfterUpdate.status === JobStatusEnum.PUBLISHED && !jobAfterUpdate.isDeleted;

    // If was published and now not, remove from sitemap
    if (wasPublished && !isPublished) {
      await this.removeJobFromSitemap(jobId);
      return;
    }

    // If newly published, or still published but slug-related fields changed, upsert entry
    if (isPublished) {
      if (!wasPublished) {
        await this.addOrUpdateJobInSitemap(jobAfterUpdate);
        return;
      }

      // Both published: check if URL changed
      if (jobBeforeUpdate) {
        const oldPath: string = this.buildJobUrlPath(jobBeforeUpdate);
        const newPath: string = this.buildJobUrlPath(jobAfterUpdate);
        if (oldPath === newPath) {
          // Nothing to do
          return;
        }
      }

      await this.addOrUpdateJobInSitemap(jobAfterUpdate);
    }
  }

  /**
   * Bulk sync sitemap: remove given job IDs and add/update given jobs in a single read/write.
   * - jobIdsToRemove: remove these from sitemap (e.g. status changed to ARCHIVED/DRAFT).
   * - jobsToAddOrUpdate: must be PUBLISHED and not deleted; entries are added or updated.
   */
  async syncBulkJobsInSitemap(
    jobIdsToRemove: string[],
    jobsToAddOrUpdate: DbGcpFirestoreJobDto[]
  ): Promise<void> {
    if (!this.sitemapBucketName) return;
    if (jobIdsToRemove.length === 0 && jobsToAddOrUpdate.length === 0) return;

    let xml: string = await this.getOrGenerateSitemapFromS3();

    for (const jobId of jobIdsToRemove) {
      xml = this.removeJobFromXml(xml, jobId);
    }

    const urlEntries: string[] = [];
    for (const job of jobsToAddOrUpdate) {
      if (job.status !== JobStatusEnum.PUBLISHED || job.isDeleted) continue;
      xml = this.removeJobFromXml(xml, job.id);
      urlEntries.push(this.buildJobUrlEntry(job));
    }

    if (urlEntries.length > 0) {
      const closingTag: string = "</urlset>";
      const closingTagIndex: number = xml.lastIndexOf(closingTag);
      if (closingTagIndex === -1) {
        const regenerated: string = await this.generateSitemapXml();
        await this.saveSitemapToS3(regenerated);
        return;
      }
      xml =
        xml.slice(0, closingTagIndex) +
        urlEntries.join("") +
        xml.slice(closingTagIndex);
    }

    await this.saveSitemapToS3(xml);
  }

  /**
   * Removes all entries for a given jobId from sitemap.xml stored on S3.
   */
  async removeJobFromSitemap(jobId: string): Promise<void> {
    if (!this.sitemapBucketName) return;

    const xml: string | null = await this.getSitemapFromS3();
    if (!xml) return;

    const updated: string = this.removeJobFromXml(xml, jobId);
    await this.saveSitemapToS3(updated);
  }

  // --- Internal helpers for interacting with S3 ---

  private async getSitemapFromS3(): Promise<string | null> {
    try {
      const exists = await awsS3ClientLibrary.doesObjectExists(
        this.sitemapBucketName,
        this.sitemapKey
      );

      if (!exists) {
        return null;
      }

      const xml = await awsS3ClientLibrary.getObjectAsString(
        this.sitemapBucketName,
        this.sitemapKey
      );

      return xml;
    } catch (error) {
      // If the object doesn't exist or there's an access error, return null
      // This will trigger sitemap generation in getOrGenerateSitemapFromS3
      global.logger.warn("Failed to retrieve sitemap from S3, will generate new one", {
        error: error instanceof Error ? error.message : String(error),
        bucket: this.sitemapBucketName,
        key: this.sitemapKey,
      });
      return null;
    }
  }

  private async saveSitemapToS3(xml: string): Promise<void> {
    await awsS3ClientLibrary.uploadObject(
      this.sitemapBucketName,
      this.sitemapKey,
      Buffer.from(xml, "utf-8"),
      {
        ContentType: "application/xml; charset=utf-8",
      }
    );
  }

  /**
   * Removes all <url> entries whose <loc> ends with /{jobId}</loc>
   */
  private removeJobFromXml(xml: string, jobId: string): string {
    const marker: string = `/${jobId}</loc>`;
    let index: number = xml.indexOf(marker);

    while (index !== -1) {
      const locStart: number = xml.lastIndexOf("<loc>", index);
      const urlStart: number = xml.lastIndexOf("<url>", locStart);
      const urlEnd: number = xml.indexOf("</url>", index);

      if (urlStart === -1 || urlEnd === -1) {
        break;
      }

      const endIndex: number = urlEnd + "</url>".length;
      xml = xml.slice(0, urlStart) + xml.slice(endIndex);

      index = xml.indexOf(marker);
    }

    return xml;
  }

  // --- XML + URL helpers (mirrors frontend util but backend-safe) ---

  private generateSitemapXML(urls: SitemapUrl[]): string {
    const urlEntries = urls
      .map((url: SitemapUrl) => {
        const lastmod = url.lastmod ? `\n      <lastmod>${url.lastmod}</lastmod>` : "";
        const changefreq = url.changefreq
          ? `\n      <changefreq>${url.changefreq}</changefreq>`
          : "";
        const priority =
          url.priority !== undefined ? `\n      <priority>${url.priority}</priority>` : "";

        return `    <url>
      <loc>${this.escapeXml(url.loc)}</loc>${lastmod}${changefreq}${priority}
    </url>`;
      })
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="${APP_CONSTANTS.SITEMAP_XML_NAMESPACE}"
  xmlns:xsi="${APP_CONSTANTS.SITEMAP_XMLNS_XSI_NAMESPACE}"
  xsi:schemaLocation="${APP_CONSTANTS.SITEMAP_XML_NAMESPACE} ${APP_CONSTANTS.SITEMAP_XML_SCHEMA}">
${urlEntries}
</urlset>`;
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  private formatDateForSitemap(date: string | Date): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().split("T")[0];
  }

  private generateStaticPageUrls(baseUrl: string): SitemapUrl[] {
    const now: string = new Date().toISOString();
    const d: string = this.formatDateForSitemap(now);

    return [
      {
        loc: `${baseUrl}/`,
        lastmod: d,
        changefreq: APP_CONSTANTS.SITEMAP_CHANGEFREQ.DAILY,
        priority: APP_CONSTANTS.SITEMAP_PRIORITY.HIGH,
      },
      {
        loc: `${baseUrl}/jobs`,
        lastmod: d,
        changefreq: APP_CONSTANTS.SITEMAP_CHANGEFREQ.HOURLY,
        priority: APP_CONSTANTS.SITEMAP_PRIORITY.HIGH,
      },
      {
        loc: `${baseUrl}/referrals`,
        lastmod: d,
        changefreq: APP_CONSTANTS.SITEMAP_CHANGEFREQ.DAILY,
        priority: APP_CONSTANTS.SITEMAP_PRIORITY.MEDIUM_HIGH,
      },
      {
        loc: `${baseUrl}/for-employee`,
        lastmod: d,
        changefreq: APP_CONSTANTS.SITEMAP_CHANGEFREQ.WEEKLY,
        priority: APP_CONSTANTS.SITEMAP_PRIORITY.MEDIUM,
      },
      {
        loc: `${baseUrl}/corporate`,
        lastmod: d,
        changefreq: APP_CONSTANTS.SITEMAP_CHANGEFREQ.WEEKLY,
        priority: APP_CONSTANTS.SITEMAP_PRIORITY.MEDIUM,
      },
      {
        loc: `${baseUrl}/corporate/connect-with-us`,
        lastmod: d,
        changefreq: APP_CONSTANTS.SITEMAP_CHANGEFREQ.MONTHLY,
        priority: APP_CONSTANTS.SITEMAP_PRIORITY.MEDIUM,
      },
      {
        loc: `${baseUrl}/about`,
        lastmod: d,
        changefreq: APP_CONSTANTS.SITEMAP_CHANGEFREQ.MONTHLY,
        priority: APP_CONSTANTS.SITEMAP_PRIORITY.MEDIUM,
      },
      {
        loc: `${baseUrl}/faq`,
        lastmod: d,
        changefreq: APP_CONSTANTS.SITEMAP_CHANGEFREQ.MONTHLY,
        priority: APP_CONSTANTS.SITEMAP_PRIORITY.MEDIUM,
      },
      {
        loc: `${baseUrl}/guidance`,
        lastmod: d,
        changefreq: APP_CONSTANTS.SITEMAP_CHANGEFREQ.WEEKLY,
        priority: APP_CONSTANTS.SITEMAP_PRIORITY.MEDIUM_HIGH,
      },
      {
        loc: `${baseUrl}/terms`,
        lastmod: d,
        changefreq: APP_CONSTANTS.SITEMAP_CHANGEFREQ.YEARLY,
        priority: APP_CONSTANTS.SITEMAP_PRIORITY.LOW,
      },
      {
        loc: `${baseUrl}/privacy-policy`,
        lastmod: d,
        changefreq: APP_CONSTANTS.SITEMAP_CHANGEFREQ.YEARLY,
        priority: APP_CONSTANTS.SITEMAP_PRIORITY.LOW,
      },
      {
        loc: `${baseUrl}/contact-us`,
        lastmod: d,
        changefreq: APP_CONSTANTS.SITEMAP_CHANGEFREQ.MONTHLY,
        priority: APP_CONSTANTS.SITEMAP_PRIORITY.MEDIUM,
      },
    ];
  }

  private generateJobSitemapUrls(
    jobs: JobsWithOrWithoutEntityDetails,
    baseUrl: string
  ): SitemapUrl[] {
    const now: string = new Date().toISOString();

    return jobs
      .filter(
        (job: DbGcpFirestoreJobDto) => job.status === JobStatusEnum.PUBLISHED && !job.isDeleted
      )
      .map((job: DbGcpFirestoreJobDto) => {
        const urlPath: string = this.buildJobUrlPath(job); // e.g. /jobs/slug/123
        const lastmod: string = job.updatedAt || job.createdAt || now;

        return {
          loc: `${baseUrl}${urlPath}`,
          lastmod: this.formatDateForSitemap(lastmod),
          changefreq: APP_CONSTANTS.SITEMAP_CHANGEFREQ.DAILY,
          priority: APP_CONSTANTS.SITEMAP_PRIORITY.MEDIUM_HIGH,
        };
      });
  }

  // Match frontend slug logic: /jobs/{seo-slug}/{jobId}
  private buildJobUrlPath(job: DbGcpFirestoreJobDto): string {
    const jobId: string = job.id;
    const title: string = job.jobTitle || "";
    const companyName: string =
      job.companyName ||
      (job as DbGcpFirestoreJobDto & { companyDetails?: { name?: string } }).companyDetails?.name ||
      "company";
    const location: string =
      Array.isArray(job.location?.fullLocation) && job.location.fullLocation.length
        ? job.location.fullLocation.join("-")
        : "location";
    const experience: string =
      job.experienceRange && job.experienceRange.min != null && job.experienceRange.max != null
        ? `${job.experienceRange.min}-${job.experienceRange.max}-years`
        : "";

    const titleSlug: string = this.toSlug(title);
    const companySlug: string = this.toSlug(companyName);
    const locationSlug: string = this.toSlug(location);
    const experienceSlug: string = experience === "0 Years" ? "" : this.toSlug(experience);

    const slugParts: string = [titleSlug, companySlug, locationSlug, experienceSlug]
      .filter(Boolean)
      .join("-");

    const maxLength: number = 100;
    const finalSlug: string =
      slugParts.length > maxLength
        ? slugParts.substring(0, maxLength).replace(/-+$/, "")
        : slugParts;

    return `/jobs/${finalSlug}/${jobId}`;
  }

  /** Builds a single <url> entry string for sitemap XML. */
  private buildJobUrlEntry(job: DbGcpFirestoreJobDto): string {
    const urlPath: string = this.buildJobUrlPath(job);
    const loc: string = `${this.baseUrl}${urlPath}`;
    const lastmod: string = this.formatDateForSitemap(
      job.updatedAt || job.createdAt || new Date().toISOString()
    );
    return `    <url>
      <loc>${this.escapeXml(loc)}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>${APP_CONSTANTS.SITEMAP_CHANGEFREQ.DAILY}</changefreq>
      <priority>${APP_CONSTANTS.SITEMAP_PRIORITY.MEDIUM_HIGH}</priority>
    </url>
`;
  }

  private toSlug(text: string): string {
    if (!text) return "";
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove any non-alphanumeric characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  }
}

const sitemapServiceObj = new SitemapService();

export default sitemapServiceObj;
