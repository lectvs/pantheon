type Dict<T> = {[name: string]: T};

type Dimens = {
    width: number;
    height: number;
}

type Factory<T> = () => T;

type Point = PIXI.Point;
const Point = PIXI.Point;
type Pt = {
    x: number;
    y: number;
}

type Rectangle = PIXI.Rectangle;
const Rectangle = PIXI.Rectangle;
type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
}

type Boundaries = {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
}

function pt(x: number, y: number) {
    return { x, y };
}

function rect(x: number, y: number, width: number, height: number): Rect {
    return { x, y, width, height };
}
