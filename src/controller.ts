type Controller = Dict<boolean> & {
    left?: boolean;
    right?: boolean;
    up?: boolean;
    down?: boolean;
    jump?:  boolean;
    attack?: boolean;
}

namespace Controller {
    export type Schema = Dict<() => boolean> & {
        left?: () => boolean;
        right?: () => boolean;
        up?: () => boolean;
        down?: () => boolean;
        jump?: () => boolean;
        attack?: () => boolean;
    }
}