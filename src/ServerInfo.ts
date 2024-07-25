import {Version} from "./Version.js";

export class ServerInfo implements Version.Versionable{
    public constructor(public readonly version: Version) {
    }
}
