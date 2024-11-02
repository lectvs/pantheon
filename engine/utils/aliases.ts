/// <reference path="../utils/m_math.ts"/>
/// <reference path="../utils/vector.ts"/>

type Dict<T> = {[name: string]: T};
type DictNumber<T> = {[name: number]: T};

type Dimens = {
    width: number;
    height: number;
}

type Point = PIXI.Point;
const Point = PIXI.Point;
type Pt = {
    x: number;
    y: number;
}

type Pt3 = {
    x: number;
    y: number;
    z: number;
}

type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
}

type Bndries = {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

type Getter<T> = () => T;
type Setter<T> = (value: T) => void;

type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};

type ValueElseUndefined<T> =
    T extends (string | number | boolean | symbol | object) ? T : undefined;

type KeysOfWithValueType<T, V> = {[K in keyof T]-?: T[K] extends V ? K : never}[keyof T];

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

const clamp = M.clamp;
const lerp = M.lerp;
const map = M.map;
const mapClamp = M.mapClamp;

function vec2(pt: Pt): Vector2;
function vec2(x: number, y: number): Vector2;
function vec2(x: number | Pt, y?: number): Vector2 {
    if (typeof(x) === 'number') {
        return new Vector2(x, y ?? x);
    }
    return new Vector2(x.x, x.y);
}

function pt3(x: number, y: number, z: number): Pt3 {
    return { x, y, z };
}

function rect(x: number, y: number, width: number, height: number): Rect {
    return { x, y, width, height };
}
