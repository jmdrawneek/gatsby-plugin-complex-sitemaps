import { SitemapNode, SitemapSubNode, TrailingSlashMode } from "./types";
export declare const sitemapNodeToXML: (node: SitemapNode | SitemapSubNode) => string;
export declare const writeXML: (xml: string, folderPath: string, filename: string) => void;
export declare const msg: (msg: string) => string;
export declare const joinURL: (trailingSlashMode: TrailingSlashMode, baseURL: string, ...parts: string[]) => string;
