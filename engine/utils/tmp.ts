namespace tmp {
    const _vec2 = new Vector2(0, 0);
    export function vec2(x: Pt): Vector2;
    export function vec2(x: number, y?: number): Vector2;
    export function vec2(x: number | Pt, y?: number) {
        if (typeof x !== 'number') {
            y = x.y;
            x = x.x;
        }
        _vec2.x = x;
        _vec2.y = y ?? x;
        return _vec2;
    }

    const _vec2_1 = new Vector2(0, 0);
    export function vec2_1(x: Pt): Vector2;
    export function vec2_1(x: number, y?: number): Vector2;
    export function vec2_1(x: number | Pt, y?: number) {
        if (typeof x !== 'number') {
            y = x.y;
            x = x.x;
        }
        _vec2_1.x = x;
        _vec2_1.y = y ?? x;
        return _vec2_1;
    }

    const _vec2_2 = new Vector2(0, 0);
    export function vec2_2(x: Pt): Vector2;
    export function vec2_2(x: number, y?: number): Vector2;
    export function vec2_2(x: number | Pt, y?: number) {
        if (typeof x !== 'number') {
            y = x.y;
            x = x.x;
        }
        _vec2_2.x = x;
        _vec2_2.y = y ?? x;
        return _vec2_2;
    }

    const _rectangle = new Rectangle(0, 0, 0, 0);
    export function rectangle(x: number, y: number, width: number, height: number) {
        _rectangle.x = x;
        _rectangle.y = y;
        _rectangle.width = width;
        _rectangle.height = height;
        return _rectangle;
    }

    const _rectangle_2 = new Rectangle(0, 0, 0, 0);
    export function rectangle_2(x: number, y: number, width: number, height: number) {
        _rectangle_2.x = x;
        _rectangle_2.y = y;
        _rectangle_2.width = width;
        _rectangle_2.height = height;
        return _rectangle_2;
    }

    const _rectBounds = new RectBounds(0, 0, 0, 0);
    export function rectBounds(x: number, y: number, width: number, height: number, parent?: Bounds.Parent) {
        _rectBounds.x = x;
        _rectBounds.y = y;
        _rectBounds.width = width;
        _rectBounds.height = height;
        _rectBounds.parent = parent;
        return _rectBounds;
    }

    // For use with `Function.apply()`
    const _argArray: any[] = [];
    export function argArray<T>(e1: T): [T] {
        _argArray.length = 0;
        _argArray.push(e1);
        return _argArray as [T];
    }
}