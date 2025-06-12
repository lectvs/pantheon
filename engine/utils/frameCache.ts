namespace FrameCache {
    class Cache<T> {
        private factory: Factory<T>;
        private cache: T[];
        private index: number;

        constructor(factory: Factory<T>) {
            this.factory = factory;
            this.cache = [];
            this.index = 0;
        }

        get() {
            if (this.index >= this.cache.length) {
                this.cache.push(this.factory());
            }
            let result = this.cache[this.index];
            this.index++;
            return result;
        }

        getSize() {
            return this.cache.length;
        }

        reset() {
            this.index = 0;
            if (this.cache.length > MAX_FRAME_CACHE_SIZE) {
                console.error('Frame cache size limit exceeded:', this.cache.length);
                this.cache.length = MAX_FRAME_CACHE_SIZE;
            }
        }

        clear() {
            this.cache.length = 0;
            this.index = 0;
        }
    }

    const MAX_FRAME_CACHE_SIZE = 15_000;

    /**
     * To add a new cache, add the function below and add the cache to the reset() function below.
     */

    const _arrayCache = new Cache<any[]>(() => []);
    export function array(): [];
    export function array<T>(e1: T): [T];
    export function array<T>(e1: T, e2: T): [T, T];
    export function array<T>(e1: T, e2: T, e3: T): [T, T, T];
    export function array<T>(e1: T, e2: T, e3: T, e4: T): [T, T, T, T];
    export function array<T>(e1?: T, e2?: T, e3?: T, e4?: T): T[] {
        let result = _arrayCache.get();
        result.length = 0;
        if (e1 !== undefined) result.push(e1);
        if (e2 !== undefined) result.push(e2);
        if (e3 !== undefined) result.push(e3);
        if (e4 !== undefined) result.push(e4);
        return result;
    }

    export function copyOfArray<T>(source: T[]): T[] {
        let result: T[] = array();
        result.pushAll(source);
        return result;
    }

    const _objectCache = new Cache<any>(() => ({}));
    export function object() {
        let result = _objectCache.get();
        for (let key in result) {
            delete result[key];
        }
        return result;
    }

    const _setCache = new Cache<Set<any>>(() => new Set());
    export function set(): Set<any>;
    export function set<T>(e1?: T, e2?: T, e3?: T, e4?: T): Set<T>;
    export function set<T>(e1?: T, e2?: T, e3?: T, e4?: T) {
        let result = _setCache.get();
        result.clear();
        if (e1 !== undefined) result.add(e1);
        if (e2 !== undefined) result.add(e2);
        if (e3 !== undefined) result.add(e3);
        if (e4 !== undefined) result.add(e4);
        return result;
    }

    const _vec2Cache = new Cache(() => new Vector2(0, 0));
    export function vec2(x: number, y: number): Vector2 {
        let result = _vec2Cache.get();
        result.x = x;
        result.y = y;
        return result;
    }

    const _rectangleCache = new Cache(() => new Rectangle(0, 0, 0, 0));
    export function rectangle(x: number, y: number, width: number, height: number): Rectangle {
        let result = _rectangleCache.get();
        result.x = x;
        result.y = y;
        result.width = width;
        result.height = height;
        return result;
    }

    const _boundariesCache = new Cache(() => new Boundaries(0, 0, 0, 0));
    export function boundaries(left: number, right: number, top: number, bottom: number): Boundaries {
        let result = _boundariesCache.get();
        result.left = left;
        result.right = right;
        result.top = top;
        result.bottom = bottom;
        return result;
    }

    const _displacementCollisionCache = new Cache<Bounds.DisplacementCollision>(() => ({} as Bounds.DisplacementCollision));
    export function displacementCollision(bounds1: Bounds, bounds2: Bounds, displacementX: number, displacementY: number): Bounds.DisplacementCollision {
        let result = _displacementCollisionCache.get();
        result.bounds1 = bounds1;
        result.bounds2 = bounds2;
        result.displacementX = displacementX;
        result.displacementY = displacementY;
        return result;
    }

    const _raycastCollisionCache = new Cache<Bounds.RaycastCollision>(() => ({} as Bounds.RaycastCollision));
    export function raycastCollision(bounds1: Bounds, bounds2: Bounds, displacementX: number, displacementY: number, t: number): Bounds.RaycastCollision {
        let result = _raycastCollisionCache.get();
        result.bounds1 = bounds1;
        result.bounds2 = bounds2;
        result.displacementX = displacementX;
        result.displacementY = displacementY;
        result.t = t;
        return result;
    }

    export function reset() {
        _arrayCache.reset();
        _objectCache.reset();
        _setCache.reset();
        _vec2Cache.reset();
        _rectangleCache.reset();
        _boundariesCache.reset();
        _displacementCollisionCache.reset();
        _raycastCollisionCache.reset();
    }

    export function clear() {
        _arrayCache.clear();
        _objectCache.clear();
        _setCache.clear();
        _vec2Cache.clear();
        _rectangleCache.clear();
        _boundariesCache.clear();
        _displacementCollisionCache.clear();
        _raycastCollisionCache.clear();
    }

    export function _getAllCaches() {
        return [
            _arrayCache,
            _objectCache,
            _setCache,
            _vec2Cache,
            _rectangleCache,
            _boundariesCache,
            _displacementCollisionCache,
            _raycastCollisionCache,
        ];
    }
}