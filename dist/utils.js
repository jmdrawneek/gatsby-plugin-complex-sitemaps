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
exports.joinURL = exports.msg = exports.writeXML = exports.sitemapNodeToXML = void 0;
const fs_1 = __importDefault(require("fs"));
const path = __importStar(require("path"));
const sitemapNodeToXML = (node) => {
    let xml = "";
    for (const tag in node) {
        if (tag === "type")
            continue; //We do not write the "type" attribute which is used in SitemapManager
        let content = "";
        const tagValue = node[tag];
        if (typeof tagValue === "string") {
            content = encodeXML(tagValue);
        }
        else {
            content = (0, exports.sitemapNodeToXML)(tagValue);
        }
        xml = `${xml}<${tag}>${content}</${tag}>`;
    }
    return `${xml}`;
};
exports.sitemapNodeToXML = sitemapNodeToXML;
const writeXML = (xml, folderPath, filename) => {
    if (!fs_1.default.existsSync(folderPath)) {
        fs_1.default.mkdirSync(folderPath, { recursive: true });
    }
    const filePath = path.join(folderPath, filename);
    fs_1.default.writeFileSync(filePath, xml);
};
exports.writeXML = writeXML;
const msg = (msg) => `gatsby-plugin-complex-sitemaps - ${msg}`;
exports.msg = msg;
const joinURL = (trailingSlashMode, baseURL, ...parts) => {
    //Remove start/end slash on parts
    parts = parts.map((part, index) => index + 1 !== parts.length || trailingSlashMode != "auto"
        ? part.replace(/^\/*/, "").replace(/\/*$/, "")
        : part.replace(/^\/*/, ""));
    //Add / at the end of parts
    parts = parts.map((part) => `${part}`);
    //Remove end slash of baseURL
    baseURL = baseURL.replace(/\/*$/, "");
    //Return https://www.example.com/part1/part2/part3/
    return `${baseURL}/${parts.join("/")}${trailingSlashMode === "add" ? "/" : ""}`;
};
exports.joinURL = joinURL;
const encodeXML = (text) => text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
