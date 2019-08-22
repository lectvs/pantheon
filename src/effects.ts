type Effects = {
    silhouette: Effects.Base & {
        color: number;
    };
}

namespace Effects {
    export type Base = {
        enabled: boolean;
    }

    export function empty(): Effects {
        return {
            silhouette: {
                enabled: false,
                color: 0xFFFFFF,
            }
        }
    }
}
