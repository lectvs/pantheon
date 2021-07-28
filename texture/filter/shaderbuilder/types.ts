namespace SB.Types {
    export type Types = Float | Bool | Vec4;
    export type Float = 'float';
    export type Bool = 'bool';
    export type Vec4 = 'vec4';

    export type MultiplyTypes = Float | Vec4;
    export type Multiply<A extends MultiplyTypes, B extends MultiplyTypes> =
          A extends Float
            ? B extends Float
              ? Float
              : Vec4
            : Vec4;

    export type DivideTypes = Float | Vec4;
    export type Divide<A extends DivideTypes, B extends DivideTypes> =
        A extends Float
            ? B extends Float
              ? Float
              : never
            : Vec4;
        
    export type ComparisonTypes = Float;
}