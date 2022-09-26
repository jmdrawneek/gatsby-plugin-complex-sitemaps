import { PluginOptions, Sitemap, SitemapNode } from "../types";
import { Reporter } from "gatsby";
export default class SitemapManager {
    sitemap: Sitemap;
    pluginOptions: PluginOptions;
    children: SitemapManager[];
    nodes: SitemapNode[];
    reporter: Reporter;
    constructor(sitemap: Sitemap, pluginOptions: PluginOptions, reporter: Reporter);
    getLocs(): string[];
    populate(queryData: any): Promise<void>;
    populateWithChildren(): void;
    populateWithQuery(queryData: any): Promise<void>;
    populateChildren(queryData: any): Promise<void>;
    generateXML(pathPrefix: string): Promise<void>;
    generateChildrenXML(pathPrefix: string): Promise<void>;
}
