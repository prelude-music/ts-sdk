import ApiClient from "@prelude-music/ts-client";
import {Page, Artist, Album, Track} from "./index.js";
import {Version} from "./Version.js";
import {ServerInfo} from "./ServerInfo.js";

/**
 * Prelude SDK
 */
export class Prelude implements Version.Versionable {
    /**
     * The API version this SDK is compatible with
     */
    public static readonly VERSION = Version.from("0.0.0");
    /**
     * The API version this SDK is compatible with
     */
    public readonly version = Prelude.VERSION;

    /** @internal **/
    public readonly api: ApiClient;

    /**
     * API server info
     */
    public async info() {
        return new ServerInfo(Version.from((await this.api.info()).body.prelude.version));
    }

    /**
     * Artists
     */
    public readonly artist = {
        get: async (id: string) => Artist.from(this, await this.api.getArtist(id)),
        getAll: async (ids: string[]) => new Page<Artist>(Artist, this, await this.api.getArtists(ids)),
        list: async (limit?: number) => new Page<Artist>(Artist, this, await this.api.listArtists(limit, 1))
    } as const;

    /**
     * Albums
     */
    public readonly album = {
        get: async (id: string) => Album.from(this, await this.api.getAlbum(id)),
        list: async (limit?: number) => new Page<Album>(Album, this, await this.api.listAlbums(limit, 1))
    } as const;

    /**
     * Tracks
     */
    public readonly track = {
        get: async (id: string) => Track.from(this, await this.api.getTrack(id)),
        list: async (limit?: number) => new Page<Track>(Track, this, await this.api.listAlbums(limit, 1))
    } as const;

    /**
     * Create new Prelude SDK instance
     * @param server Prelude API server base URL
     * @example const prelude = new Prelude(new URL("http://prelude.local:9847"));
     */
    public constructor(server: URL) {
        this.api = new ApiClient(server);
    }
}
