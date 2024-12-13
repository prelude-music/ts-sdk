import {Prelude} from "../index.js";

export abstract class Resource {
    /**
     * Unique ID of this resource
     */
    public abstract readonly id: string;

    protected constructor(public readonly sdk: Prelude) {
    }
}
