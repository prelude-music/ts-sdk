import ApiClient from "@prelude-music/ts-client";
import {Prelude, Page, Resource, Artist, Track} from "../index.js";

/**
 * Album
 */
export class Album extends Resource {
    /**
     * Album ID
     */
    public override readonly id: string;

    /**
     * Album name
     */
    public readonly name: string;

    /**
     * Artist ID
     */
    readonly #artist: string;

    public constructor(sdk: Prelude, res: ApiClient.Album) {
        super(sdk);
        this.id = res.id;
        this.name = res.name;
        this.#artist = res.artist;
    }

    /**
     * Create album from an API response
     * @param sdk The Prelude SDK instance
     * @param res The album API response
     */
    public static from(sdk: Prelude, res: ApiClient.ApiResponse<ApiClient.Album>): Album {
        return new Album(sdk, res.body);
    }

    /**
     * Get artist
     */
    public async artist(): Promise<Artist> {
        return await this.sdk.artist.get(this.#artist);
    }

    /**
     * Get tracks
     * @param [limit] Number of resources to request per page
     * @param [page] Page number to request
     */
    public async tracks(limit?: number, page?: number): Promise<Page<Track>> {
        return new Page<Track>(Track, this.sdk, await this.sdk.api.listAlbumTracks(this.id, limit, page));
    }

    /**
     * Album cover art image URL
     */
    public image(): URL {
        return ApiClient.ApiRequest.concatUrl(this.sdk.api.baseUrl, `/albums/${this.id}/image`);
    }
}
