import { Request, Response, NextFunction } from "express";
import sitemapServiceObj from "../services/Sitemap.service";

/**
 * SitemapController
 * 
 * This class is used to generate the sitemap.xml file
 * 
 * @authorisedRoles ["public"]
 */

class SitemapController {
  /**
   * GET /sitemap.xml
   * Returns XML sitemap with Content-Type: application/xml
   */
  getSitemap = async (req: Request, res: Response, next: NextFunction) => {
    try {
      global.logger.info("Getting sitemap.xml from S3 (or generating if missing)");
      const xml: string = await sitemapServiceObj.getOrGenerateSitemapFromS3();
      res.header("Content-Type", "application/xml; charset=utf-8");
      res.status(200).send(xml);
    } catch (error) {
      global.logger.error("Failed to get sitemap.xml", { error });
      next(error);
    }
  };
}

const sitemapController = new SitemapController();
export default sitemapController;