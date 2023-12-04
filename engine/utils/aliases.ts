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

type ValueElseUndefined<T> =
  T extends (string | number | boolean | symbol | object) ? T : undefined;

function vec2(pt: Pt): Vector2;
function vec2(x: number, y: number): Vector2;
function vec2(x: number | Pt, y?: number): Vector2 {
    if (typeof(x) === 'number') {
        return new Vector2(x, y ?? x);
    }
    return new Vector2(x.x, x.y);
}

function rect(x: number, y: number, width: number, height: number): Rect {
    return { x, y, width, height };
}
