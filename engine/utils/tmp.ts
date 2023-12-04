namespace tmp {
    const _vec2 = new Vector2(0, 0);
    export function vec2(x: Pt): Vector2;
    export function vec2(x: number, y: number): Vector2;
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
    export function vec2_1(x: number, y: number): Vector2;
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
    export function vec2_2(x: number, y: number): Vector2;
    export function vec2_2(x: number | Pt, y?: number) {
        if (typeof x !== 'number') {
            y = x.y;
            x = x.x;
        }
        _vec2_2.x = x;
        _vec2_2.y = y ?? x;
        return _vec2_2;
    }
}