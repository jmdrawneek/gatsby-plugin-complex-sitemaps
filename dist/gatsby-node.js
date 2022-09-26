"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const options_validation_1 = require("./options-validation");
const SitemapManager_1 = __importDefault(require("./Sitemap/SitemapManager"));
const path = __importStar(require("path"));
const utils_1 = require("./utils");
const PUBLIC_PATH = "./public";
const SITE_INFO_QUERY = `{
  site {
    siteMetadata {
      siteUrl
    }
  }
}`;
exports.onPostBuild = async ({ graphql, pathPrefix, reporter }, pluginOptions) => {
    const timer = reporter.activityTimer((0, utils_1.msg)(`Generating sitemaps`));
    timer.start();
    //Run queries
    const siteInfo = (await graphql(SITE_INFO_QUERY)).data;
    const queryData = (await graphql(pluginOptions.query)).data;
    //Reformat options and behavior
    pluginOptions.outputFolderURL = (0, utils_1.joinURL)("auto", siteInfo.site.siteMetadata.siteUrl, pluginOptions.outputFolder);
    pluginOptions.outputURL = siteInfo.site.siteMetadata.siteUrl;
    const basePath = path.join(PUBLIC_PATH, pathPrefix);
    //Init root manager => recursively init children manager
    const rootManager = new SitemapManager_1.default(pluginOptions.sitemapTree, pluginOptions, reporter);
    //Run query and populate all managers with query data and parent/children information
    reporter.verbose("Start populating sitemap");
    await rootManager.populate(queryData);
    reporter.verbose("Populating sitemap ended");
    //Generate the content of XML files and write the files recursively
    await rootManager.generateXML(basePath);
    timer.end();
    return;
};
exports.pluginOptionsSchema = options_validation_1.pluginOptionsSchema;
