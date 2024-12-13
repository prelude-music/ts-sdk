import ApiClient from "@prelude-music/ts-client";
import {Prelude, Page, Resource, Album, Track} from "../index.js";

/**
 * Artist
 */
export class Artist extends Resource {
    /**
     * Artist ID
     */
    public override readonly id: string;

    /**
     * Name of the artist
     */
    public readonly name: string;

    /**
     * Link to an external image of the artist
     */
    public readonly image: URL | null;

    /**
     * Create new Artist instance
     * @param sdk The Prelude SDK instance
     * @param res The artist API response
     */
    public constructor(sdk: Prelude, res: ApiClient.Artist) {
        super(sdk);
        this.id = res.id;
        this.name = res.name;
        this.image = res.image !== null ? new URL(res.image) : null;
    }

    /**
     * Create artist from an API response
     * @param sdk The Prelude SDK instance
     * @param res The artist API response
     */
    public static from(sdk: Prelude, res: ApiClient.ApiResponse<ApiClient.Artist>): Artist {
        return new Artist(sdk, res.body);
    }

    /**
     * Get artist's albums
     */
    public async albums(): Promise<Page<Album>> {
        return new Page<Album>(Album, this.sdk, await this.sdk.api.listArtistAlbums(this.id));
    }

    /**
     * Get artist's tracks
     */
    public async tracks(): Promise<Page<Track>> {
        return new Page<Track>(Track, this.sdk, await this.sdk.api.listArtistTracks(this.id));
    }
}
