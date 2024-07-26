class Version {
    public constructor(
        public readonly major: number,
        public readonly minor: number,
        public readonly patch: number,
        public readonly label?: string
    ) {
    }

    public static from(version: `${number}.${number}.${number}${`-${string}` | ""}`) {
        const parts = version.split(".");
        if (parts.length > 3 || parts.length <= 1) throw new TypeError(`Invalid version string: ${version}`);
        const major = Number.parseInt(parts[0]!, 10);
        const minor = parts[1] === undefined ? 0 : Number.parseInt(parts[1], 10);
        let label: string | undefined;
        let patch: number;
        if (parts[2] !== undefined) {
            const dashIndex = parts[2].indexOf("-");
            if (dashIndex === -1)
                patch = Number.parseInt(parts[2], 10);
            else {
                patch = Number.parseInt(parts[2].slice(0, dashIndex), 10);
                label = parts[2].slice(dashIndex + 1);
            }
        }
        else patch = 0;
        return new Version(major, minor, patch, label);
    }

    public toString() {
        return `${this.major}.${this.minor}.${this.patch}${this.label === undefined ? "" : `-${this.label}`}`;
    }

    /**
     * Check whether this version (local) is compatible with the given version (remote)
     *
     * ```
     * local major != remote major => false
     * local minor > remote minor => false
     * otherwise => true
     * ```
     *
     * @param version
     */
    public isCompatible(version: Version): boolean;
    /**
     * Check whether the current version (local) is compatible with the version of the given object (remote)
     *
     * ```
     * local major != remote major => false
     * local minor > remote minor => false
     * otherwise => true
     * ```
     *
     * @param versionable
     */
    public isCompatible(versionable: Version.Versionable): boolean;
    /**
     * @internal
     */
    public isCompatible(a: Version | Version.Versionable): boolean {
        const version = a instanceof Version ? a : a.version;
        if (this.major !== version.major) return false;
        return this.minor >= version.minor;
    }
}

namespace Version {
    export interface Versionable {
        version: Version;
    }
}

export {Version};
