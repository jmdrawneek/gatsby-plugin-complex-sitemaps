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
const path = __importStar(require("path"));
const utils_1 = require("../utils");
class SitemapManager {
    constructor(sitemap, pluginOptions, reporter) {
        var _a, _b, _c, _d;
        this.sitemap = sitemap;
        this.pluginOptions = pluginOptions;
        this.reporter = reporter;
        this.nodes =
            (_b = (_a = this.sitemap.arbitraryNodes) === null || _a === void 0 ? void 0 : _a.map(node => ({ ...node, type: "url" }))) !== null && _b !== void 0 ? _b : [];
        //"Copy" sitemap.children to children attribute after init a new SitemapManager with it
        this.sitemap.children = (_d = (_c = this.sitemap) === null || _c === void 0 ? void 0 : _c.children) !== null && _d !== void 0 ? _d : [];
        this.children = this.sitemap.children.map((child) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            //Merge sitemap specific outputFolder (if exist) with child.outputFolder, pluginOptions.outputFolder and pluginOptions.outputFolderURL
            let childOutputFolder = child.outputFolder;
            let pluginOutputFolder = pluginOptions.outputFolder;
            let pluginOutputFolderURL = pluginOptions.outputFolderURL;
            if (child.outputFolder ||
                this.sitemap.outputFolder ||
                this.pluginOptions.outputFolder) {
                childOutputFolder = path.join((_b = (_a = this.sitemap.outputFolder) !== null && _a !== void 0 ? _a : this.pluginOptions.outputFolder) !== null && _b !== void 0 ? _b : "", (_c = child.outputFolder) !== null && _c !== void 0 ? _c : "");
                pluginOutputFolder = path.join((_d = this.pluginOptions.outputFolder) !== null && _d !== void 0 ? _d : "", (_e = child.outputFolder) !== null && _e !== void 0 ? _e : "");
                pluginOutputFolderURL = (0, utils_1.joinURL)("auto", (_f = pluginOptions.outputFolderURL) !== null && _f !== void 0 ? _f : "", (_g = child.outputFolder) !== null && _g !== void 0 ? _g : "");
            }
            //Create SitemapManager for every child and save it into "children" array
            return new SitemapManager({
                ...child,
                xslPath: (_h = child.xslPath) !== null && _h !== void 0 ? _h : pluginOptions.xslPath,
                outputFolder: childOutputFolder,
            }, {
                ...this.pluginOptions,
                outputFolder: pluginOutputFolder,
                outputFolderURL: pluginOutputFolderURL,
            }, reporter);
        });
    }
    getLocs() {
        var _a, _b;
        const fileNumber = Math.ceil(this.nodes.length / this.pluginOptions.entryLimitPerFile);
        const urls = [];
        if (fileNumber > 1) {
            for (let i = 1; i <= fileNumber; i++) {
                urls.push((0, utils_1.joinURL)("remove", (_a = this.pluginOptions.outputFolderURL) !== null && _a !== void 0 ? _a : this.pluginOptions.outputFolder, this.sitemap.fileName.replace(/\.xml$/, `-${i}.xml`)));
            }
        }
        else {
            urls.push((0, utils_1.joinURL)("remove", (_b = this.pluginOptions.outputFolderURL) !== null && _b !== void 0 ? _b : this.pluginOptions.outputFolder, this.sitemap.fileName));
        }
        return urls;
    }
    async populate(queryData) {
        await Promise.all([
            this.populateChildren(queryData),
            this.populateWithQuery(queryData),
        ]);
        this.populateWithChildren();
    }
    populateWithChildren() {
        var _a;
        (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach((child) => {
            const childLocs = child.getLocs();
            this.reporter.verbose(`${this.sitemap.fileName} child : ${child.sitemap.fileName} => ${childLocs.join("&")}`);
            childLocs.forEach(loc => {
                var _a;
                return this.nodes.unshift({
                    type: "sitemap",
                    loc: loc,
                    lastmod: (_a = child.sitemap.lastmod) !== null && _a !== void 0 ? _a : new Date().toISOString(),
                });
            });
        });
    }
    async populateWithQuery(queryData) {
        var _a, _b, _c, _d, _e, _f;
        //Parse query result
        if (queryData &&
            ((_a = this.sitemap) === null || _a === void 0 ? void 0 : _a.queryName) &&
            queryData[this.sitemap.queryName] &&
            ((_b = this.sitemap) === null || _b === void 0 ? void 0 : _b.serializer)) {
            let edges = queryData[this.sitemap.queryName].edges;
            const serializationFunction = this.sitemap.serializer;
            //We run the filtering function if the user has passed one
            if ((_c = this.sitemap) === null || _c === void 0 ? void 0 : _c.filterPages) {
                this.reporter.verbose(`Filtering function found for ${this.sitemap.fileName}, start filtering`);
                const filterFunction = (_d = this.sitemap) === null || _d === void 0 ? void 0 : _d.filterPages;
                const beforeFilteringLength = edges.length;
                edges = edges.filter((edge) => filterFunction(edge.node));
                this.reporter.verbose(`Filtering ended : ${beforeFilteringLength - edges.length} node removed`);
            }
            //We transform each edge from the query result to a SitemapNode
            edges = await Promise.all(edges.map(async (edge) => {
                var _a;
                const serializedNode = await serializationFunction(edge.node);
                if (Array.isArray(serializedNode)) {
                    return serializedNode.map(nodeItem => {
                        var _a;
                        return {
                            ...nodeItem,
                            loc: (0, utils_1.joinURL)(this.sitemap.trailingSlash, (_a = this.pluginOptions.outputURL) !== null && _a !== void 0 ? _a : this.pluginOptions.outputFolder, nodeItem.loc),
                            type: "url",
                        };
                    });
                }
                return {
                    ...serializedNode,
                    loc: (0, utils_1.joinURL)(this.sitemap.trailingSlash, (_a = this.pluginOptions.outputURL) !== null && _a !== void 0 ? _a : this.pluginOptions.outputFolder, serializedNode.loc),
                    type: "url",
                };
            }));
            this.nodes.push(...edges.flat(1));
        }
        else {
            this.reporter.warn(`${(_e = this.sitemap) === null || _e === void 0 ? void 0 : _e.fileName} => Invalid query name (${(_f = this.sitemap) === null || _f === void 0 ? void 0 : _f.queryName}) => only children`);
        }
    }
    async populateChildren(queryData) {
        var _a;
        await Promise.all((_a = this.children) === null || _a === void 0 ? void 0 : _a.map(async (child) => {
            await child.populate(queryData);
        }));
    }
    //This function generate the xml of each file of the tree from the leaves to the root
    async generateXML(pathPrefix) {
        var _a, _b;
        await this.generateChildrenXML(pathPrefix);
        if (!this.sitemap.writeFile) {
            return;
        }
        const writeFolderPath = path.join(pathPrefix, (_b = (_a = this.sitemap.outputFolder) !== null && _a !== void 0 ? _a : this.pluginOptions.outputFolder) !== null && _b !== void 0 ? _b : "");
        const files = [{ sitemap: [], url: [] }];
        //Format every node attribute into xml field and add it to the xml string until it's full then add it to the next xml string
        this.nodes
            .sort(orderSitemapFirst)
            .forEach((node, index) => {
            const fileIndex = parseInt(`${Math.floor(index / this.pluginOptions.entryLimitPerFile)}`);
            if (!files[fileIndex]) {
                files[fileIndex] = { sitemap: [], url: [] };
            }
            files[fileIndex][node === null || node === void 0 ? void 0 : node.type].push(`<${node.type}>${(0, utils_1.sitemapNodeToXML)(node)}</${node.type}>`);
        });
        //For each file we add xml, xsl, urlset and/or sitemapindex, we process the file name and write it
        await Promise.all(files.map(async (file, index) => {
            var _a, _b, _c;
            const xmlContent = `<?xml ${(_a = this.sitemap.xmlAnchorAttributes) !== null && _a !== void 0 ? _a : ""}?>\n` +
                (this.sitemap.xslPath
                    ? `<?xml-stylesheet type="text/xsl" href="${this.sitemap.xslPath}"?>\n`
                    : "") +
                (file.sitemap.length
                    ? `<sitemapindex ${(_b = this.sitemap.urlsetAnchorAttributes) !== null && _b !== void 0 ? _b : ""}>\n${file.sitemap.join("\n")}\n</sitemapindex>`
                    : "") +
                (file.url.length
                    ? `<urlset ${(_c = this.sitemap.urlsetAnchorAttributes) !== null && _c !== void 0 ? _c : ""}>\n${file.url.join("\n")}\n</urlset>`
                    : "");
            const finalFileName = files.length > 1
                ? this.sitemap.fileName.replace(/\.xml$/, `-${index + 1}.xml`)
                : this.sitemap.fileName;
            this.reporter.verbose(`Writting ${finalFileName} in ${writeFolderPath}`);
            (0, utils_1.writeXML)(xmlContent, writeFolderPath, finalFileName);
        }));
    }
    async generateChildrenXML(pathPrefix) {
        var _a;
        await Promise.all((_a = this.children) === null || _a === void 0 ? void 0 : _a.map(async (child) => {
            await child.generateXML(pathPrefix);
        }));
    }
}
exports.default = SitemapManager;
const orderSitemapFirst = (a, b) => {
    if (a.type === "url" && b.type === "sitemap") {
        return -1;
    }
    else if (a.type === "sitemap" && b.type === "url") {
        return 1;
    }
    else {
        return 0;
    }
};
