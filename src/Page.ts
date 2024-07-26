import ApiClient from "@prelude-music/ts-client";
import {Prelude, Resource} from "./index.js";

/**
 * A partial collection of resources
 */
export class Page<T extends Resource> {
    /**
     * The resources on this page
     */
    public readonly resources: T[];

    /**
     * Create new page instance
     * @param ResourceConstructor Resource class constructor
     * @param sdk Prelude SDK instance
     * @param res The page API response
     */
    public constructor(
        /**
         * Resource class constructor
         * @internal
         */
        private readonly ResourceConstructor: new (sdk: Prelude, res: any) => T,
        /**
         * Prelude SDK instance
         * @internal
         */
        private readonly sdk: Prelude,
        /**
         * The page API response
         * @internal
         */
        private readonly res: ApiClient.ApiResponse<ApiClient.Page<unknown>>
    ) {
        this.resources = res.body.resources.map(r => new this.ResourceConstructor(this.sdk, r));
    }

    /**
     * Current page
     */
    public get page() {
        return this.res.body.page;
    }

    /**
     * Number of resources per page
     */
    public get limit() {
        return this.res.body.limit;
    }

    /**
     * Total number of resources in the library
     */
    public get total() {
        return this.res.body.total;
    }

    /**
     * Whether this is the last page
     */
    public get last() {
        return this.res.body.next === null;
    }

    /**
     * Whether this is the first page
     */
    public get first() {
        return this.res.body.previous === null;
    }

    /**
     * Get all resources from all pages
     */
    public async all(): Promise<T[]> {
        const resources: Map<string, T> = new Map();
        for (const resource of this.resources)
            resources.set(resource.id, resource);
        for await (const page of this.pages(100, 1))
            for (const resource of page.resources)
                resources.set(resource.id, resource);
        return Array.from(resources.values());
    }

    /**
     * Generator for all pages
     * @param limit The number of resources per page. A higher number will result in less HTTP requests at the cost of higher response size.
     * @param [start] The page number to start from. Defaults to the current page.
     */
    public async* pages(limit: number = 100, start?: number): AsyncGenerator<Page<T>> {
        if (start !== undefined) this.res.req.url.searchParams.set("page", start.toString());
        this.res.req.url.searchParams.set("limit", limit.toString());
        let current = new Page<T>(this.ResourceConstructor, this.sdk, await ApiClient.ApiResponse.from<ApiClient.Page<unknown>>(this.res.req, await this.res.req.fetch()));
        while (!current.last) {
            yield current;
            current = await current.next();
        }
    }

    /**
     * Get next page
     */
    public async next(): Promise<Page<T>> {
        this.res.req.url.searchParams.set("page", (this.page + 1).toString());
        return new Page<T>(this.ResourceConstructor, this.sdk, await ApiClient.ApiResponse.from<ApiClient.Page<unknown>>(this.res.req, await this.res.req.fetch()));
    }

    /**
     * Get previous page
     */
    public async previous(): Promise<Page<T>> {
        this.res.req.url.searchParams.set("page", (this.page - 1).toString());
        return new Page<T>(this.ResourceConstructor, this.sdk, await ApiClient.ApiResponse.from<ApiClient.Page<unknown>>(this.res.req, await this.res.req.fetch()));
    }
}
