export declare type PluginOptions = {
    query: string;
    sitemapTree: Sitemap;
    outputFolder: string;
    xslPath?: string;
    entryLimitPerFile: number;
    createLinkInHead: boolean;
    outputFolderURL?: string;
    outputURL?: string;
};
export declare type Sitemap = {
    writeFile?: boolean;
    fileName: string;
    outputFolder?: string;
    lastmod?: string;
    xslPath?: string;
    children?: Sitemap[];
    queryName?: string;
    filterPages?: FilteringFunction;
    serializer?: SerializationFunction;
    trailingSlash: TrailingSlashMode;
    arbitraryNodes?: SitemapNode[];
    xmlAnchorAttributes: string;
    urlsetAnchorAttributes: string;
    sitemapindexAnchorAttributes: string;
};
export declare type TrailingSlashMode = "auto" | "remove" | "add";
export declare type FilteringFunction = (page: any) => boolean;
export declare type SerializationFunction = (page: any) => SitemapNode;
export declare type SitemapNode = {
    type: "url" | "sitemap";
    loc: string;
    changefreq?: string;
    priority?: string;
    lastmod?: string | Date;
    [key: string]: string | SitemapSubNode | Date | undefined;
};
export declare type SitemapSubNode = {
    [key: string]: string | SitemapSubNode;
};
export declare type SiteInfo = {
    site: {
        siteMetadata: {
            siteUrl: string;
        };
    };
};
