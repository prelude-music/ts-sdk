import ApiClient from "@prelude-music/ts-client";
import {Prelude, Resource, Artist, Album} from "../index.js";

/**
 * Track
 */
export class Track extends Resource {
    /**
     * Track ID
     */
    public override readonly id: string;

    /**
     * Track title
     */
    public readonly title: string;
    /**
     * Track year
     */
    public readonly year: number | null;
    /**
     * Track genres
     */
    public readonly genres: string[];
    /**
     * Track number and total tracks in album
     */
    public readonly track: { no: number, of: number | null } | null;
    /**
     * Disk number and total disks
     */
    public readonly disk: { no: number, of: number | null } | null;
    /**
     * Track duration
     */
    public readonly duration: number;
    /**
     * Track meta
     */
    public readonly meta: {
        /**
         * Number of audio channels
         */
        channels: number;
        /**
         * Sample rate in Hz
         */
        sampleRate: number;
        /**
         * Bitrate in bits per second
         */
        bitrate: number;
        /**
         * Whether the audio file is in a lossless/uncompressed format
         */
        lossless: boolean;
    };
    /**
     * Artist ID
     * @internal
     */
    readonly #artist: string;
    /**
     * Album ID
     * @internal
     */
    readonly #album: string | null;

    public constructor(sdk: Prelude, res: ApiClient.Track) {
        super(sdk);
        this.id = res.id;
        this.title = res.title;
        this.#artist = res.artist;
        this.#album = res.album;
        this.year = res.year;
        this.genres = res.genres;
        this.track = res.track;
        this.disk = res.disk;
        this.duration = res.duration;
        this.meta = res.meta;
    }

    /**
     * Create track from an API response
     * @param sdk The Prelude SDK instance
     * @param res The track API response
     */
    public static from(sdk: Prelude, res: ApiClient.ApiResponse<ApiClient.Track>): Track {
        return new Track(sdk, res.body);
    }

    /**
     * Get this track's artist
     */
    public async artist(): Promise<Artist> {
        return await this.sdk.artist.get(this.#artist);
    }

    /**
     * Get this track's album
     */
    public async album(): Promise<Album | null> {
        if (this.#album === null)
            return null;
        return await this.sdk.album.get(this.#album);
    }

    /**
     * Track cover art image URL
     */
    public image(): URL {
        return ApiClient.ApiRequest.concatUrl(this.sdk.api.baseUrl, `/tracks/${this.id}/image`);
    }

    /**
     * Track audio file URL
     */
    public audio(): URL {
        return ApiClient.ApiRequest.concatUrl(this.sdk.api.baseUrl, `/tracks/${this.id}/audio`);
    }
}
