import { Router } from "express";
import sitemapController from "../controllers/Sitemap.controller";

const SitemapRouter = Router();

/**
 * Public sitemap endpoint.
 *
 * This endpoint is used to handle requests for the sitemap XML file.
 * It is required only in the following scenarios:
 * - When creating a sitemap XML file in the S3 bucket initially.
 * - When fetching the sitemap XML file for any specific purpose.
 *
 * If this router is mounted at "/sitemap", the full path will be:
 *   GET /sitemap/sitemap.xml
 */
SitemapRouter.get("/sitemap.xml", sitemapController.getSitemap);

export default SitemapRouter;