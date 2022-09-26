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
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const gatsby_1 = require("gatsby");
const path_1 = require("path");
const withPrefix = gatsby_1.withAssetPrefix || gatsby_1.withPrefix;
exports.onRenderBody = ({ setHeadComponents }, pluginOptions) => {
    const { outputFolder, createLinkInHead, sitemapTree } = pluginOptions;
    if (!createLinkInHead) {
        return;
    }
    const urlParts = sitemapTree.outputFolder
        ? [sitemapTree.outputFolder, sitemapTree.fileName]
        : [sitemapTree.fileName];
    setHeadComponents([
        React.createElement("link", { key: `gatsby-plugin-complex-sitemap-tree`, rel: "sitemap", type: "application/xml", href: withPrefix(path_1.posix.join(outputFolder, ...urlParts)) }),
    ]);
};
