type Dict<T> = {[name: string]: T};

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

