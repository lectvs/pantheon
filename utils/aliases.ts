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

type Getter<T> = () => T;
type Setter<T> = (value: T) => void;

type ReplaceConfigCallbacks<SuperType extends WorldObject.Config, NewType extends WorldObject> = Omit<SuperType, WorldObject.CallbackKeys> & WorldObject.Callbacks<NewType>;

function vec2(x: number | Pt, y?: number): Vector2 {
    if (typeof(x) === 'number') return new Vector2(x, y);
    return new Vector2(x.x, x.y);
}

function rect(x: number, y: number, width: number, height: number): Rect {
    return { x, y, width, height };
}
