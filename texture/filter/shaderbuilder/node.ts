namespace SB {
    export class Node {
        build() {
            console.error('Tried to build base Node class. Did you override build()?');
            return undefined;
        }

        getUniforms(): Dict<Types.Types> {
            return {};
        }
    }

    export class Statement extends Node {
    }

    export class Expression<T extends Types.Types> extends Node {
        type: T;

        constructor(type: T) {
            super();
            this.type = type;
        }
    }

    export class FloatNode extends Expression<Types.Float> {
        private value: number;

        constructor(value: number) {
            super('float');
            this.value = value;
        }

        build() {
            if (Math.floor(this.value) === this.value) {
                return `${this.value}.0`;
            }
            return `${this.value}`;
        }
    }

    export class UniformNode<T extends Types.Types> extends Expression<T> {
        private name: string;

        constructor(type: T, name: string) {
            super(type);
            this.name = name;
        }

        build() {
            return this.name;
        }

        getUniforms() {
            return {
                [this.name]: this.type
            };
        }
    }
    export function uniform<T extends Types.Types>(type: T, name: string) {
        return new UniformNode(type, name);
    }
    export function float(nameOrValue: string | number): Expression<Types.Float> {
        if (_.isNumber(nameOrValue)) {
            return new FloatNode(nameOrValue);
        }
        return new UniformNode('float', nameOrValue);
    }

    export class AddNode<A extends Types.Types> extends Expression<A> {
        private expr1: Expression<A>;
        private expr2: Expression<A>;

        constructor(type: A, expr1: Expression<A>, expr2: Expression<A>) {
            super(type);
            this.expr1 = expr1;
            this.expr2 = expr2;
        }

        build() {
            return `(${this.expr1.build()} + ${this.expr2.build()})`;
        }

        getUniforms() {
            return combineUniformTypeDicts(this.expr1.getUniforms(), this.expr2.getUniforms());
        }
    }
    export function add<A extends Types.Types>(expr1: Expression<A>, expr2: Expression<A>): AddNode<A> {
        return new AddNode(expr1.type, expr1, expr2);
    }

    export class SubtractNode<A extends Types.Types> extends Expression<A> {
        private expr1: Expression<A>;
        private expr2: Expression<A>;

        constructor(type: A, expr1: Expression<A>, expr2: Expression<A>) {
            super(type);
            this.expr1 = expr1;
            this.expr2 = expr2;
        }

        build() {
            return `(${this.expr1.build()} - ${this.expr2.build()})`;
        }

        getUniforms() {
            return combineUniformTypeDicts(this.expr1.getUniforms(), this.expr2.getUniforms());
        }
    }
    export function subtract<A extends Types.Types>(expr1: Expression<A>, expr2: Expression<A>): SubtractNode<A> {
        return new SubtractNode(expr1.type, expr1, expr2);
    }

    export class MultiplyNode<A extends Types.Types, B extends Types.Types, C extends Types.Types> extends Expression<C> {
        private expr1: Expression<A>;
        private expr2: Expression<B>;

        constructor(type: C, expr1: Expression<A>, expr2: Expression<B>) {
            super(type);
            this.expr1 = expr1;
            this.expr2 = expr2;
        }

        build() {
            return `(${this.expr1.build()} * ${this.expr2.build()})`;
        }

        getUniforms() {
            return combineUniformTypeDicts(this.expr1.getUniforms(), this.expr2.getUniforms());
        }
    }
    export function multiply<A extends Types.MultiplyTypes, B extends Types.MultiplyTypes>(expr1: Expression<A>, expr2: Expression<B>): MultiplyNode<A, B, Types.Multiply<A, B>> {
        if (expr1.type === 'float' && expr2.type === 'float') {
            return <MultiplyNode<A, B, Types.Multiply<A, B>>>new MultiplyNode('float', expr1, expr2);
        }
        return <MultiplyNode<A, B, Types.Multiply<A, B>>>new MultiplyNode('vec4', expr1, expr2);
    }

    export class DivideNode<A extends Types.Types, B extends Types.Types, C extends Types.Types> extends Expression<C> {
        private expr1: Expression<A>;
        private expr2: Expression<B>;

        constructor(type: C, expr1: Expression<A>, expr2: Expression<B>) {
            super(type);
            this.expr1 = expr1;
            this.expr2 = expr2;
        }

        build() {
            return `(${this.expr1.build()} / ${this.expr2.build()})`;
        }

        getUniforms() {
            return combineUniformTypeDicts(this.expr1.getUniforms(), this.expr2.getUniforms());
        }
    }
    export function divide<A extends Types.DivideTypes, B extends Types.DivideTypes>(expr1: Expression<A>, expr2: Expression<B>): DivideNode<A, B, Types.Divide<A, B>> {
        if (expr1.type === 'float' && expr2.type === 'float') {
            return <DivideNode<A, B, Types.Divide<A, B>>>new DivideNode('float', expr1, expr2);
        }
        return <DivideNode<A, B, Types.Divide<A, B>>>new DivideNode('vec4', expr1, expr2);
    }

    export class LessThanNode<A extends Types.ComparisonTypes> extends Expression<Types.Bool> {
        private expr1: Expression<A>;
        private expr2: Expression<A>;

        constructor(expr1: Expression<A>, expr2: Expression<A>) {
            super('bool');
            this.expr1 = expr1;
            this.expr2 = expr2;
        }

        build() {
            return `(${this.expr1.build()} < ${this.expr2.build()})`;
        }

        getUniforms() {
            return combineUniformTypeDicts(this.expr1.getUniforms(), this.expr2.getUniforms());
        }
    }
    export function lessThan<A extends Types.ComparisonTypes>(expr1: Expression<A>, expr2: Expression<A>): LessThanNode<A> {
        return new LessThanNode(expr1, expr2);
    }

    export class GreaterThanNode<A extends Types.ComparisonTypes> extends Expression<Types.Bool> {
        private expr1: Expression<A>;
        private expr2: Expression<A>;

        constructor(expr1: Expression<A>, expr2: Expression<A>) {
            super('bool');
            this.expr1 = expr1;
            this.expr2 = expr2;
        }

        build() {
            return `(${this.expr1.build()} > ${this.expr2.build()})`;
        }

        getUniforms() {
            return combineUniformTypeDicts(this.expr1.getUniforms(), this.expr2.getUniforms());
        }
    }
    export function greaterThan<A extends Types.ComparisonTypes>(expr1: Expression<A>, expr2: Expression<A>): GreaterThanNode<A> {
        return new GreaterThanNode(expr1, expr2);
    }

    export class IfNode extends Statement {
        private condition: Expression<Types.Bool>;
        private trueStatements: Statement[];
        private falseStatements: Statement[];

        constructor(condition: Expression<Types.Bool>, trueStatements: Statement[], falseStatements?: Statement[]) {
            super();
            this.condition = condition;
            this.trueStatements = trueStatements;
            this.falseStatements = falseStatements;
        }

        build() {
            let result = `if (${this.condition.build()}) {
                ${this.trueStatements.map(s => s.build()).join('\n')}
            }`;

            if (!_.isEmpty(this.falseStatements)) {
                result += ` else {
                    ${this.falseStatements.map(s => s.build()).join('\n')}
                }`;
            }
            return result;
        }

        getUniforms() {
            return combineUniformTypeDicts(this.condition.getUniforms(),
                        ...this.trueStatements.map(s => s.getUniforms()),
                        ...(this.falseStatements ?? []).map(s => s.getUniforms())
                   );
        }
    }
    export function ifThen(condition: Expression<Types.Bool>, trueStatements: Statement[], falseStatements?: Statement[]) {
        return new IfNode(condition, trueStatements, falseStatements);
    }

    export class InputColorNode extends Expression<Types.Vec4> {
        build() {
            return `inp`;
        }
    }
    export function inputColor() {
        return new InputColorNode('vec4');
    }

    export class SetOutputColorNode extends Statement {
        private expr: Expression<Types.Vec4>;

        constructor(expr: Expression<Types.Vec4>) {
            super();
            this.expr = expr;
        }

        build() {
            return `outp = ${this.expr.build()};`;
        }

        getUniforms() {
            return this.expr.getUniforms();
        }
    }
    export function setOutputColor(expr: Expression<Types.Vec4>) {
        return new SetOutputColorNode(expr);
    }


    export function combineUniformTypeDicts(uniformTypes: Dict<Types.Types>, ...uniformTypesToAdd: Dict<Types.Types>[]) {
        let result = _.clone(uniformTypes);
        for (let uniformTypesList of uniformTypesToAdd) {
            for (let uniform in uniformTypesList) {
                if (uniform in result && result[uniform] !== uniformTypesList[uniform]) {
                    console.error('Multiple uniforms defined with conflicting types:', uniform, result[uniform], uniformTypesList[uniform]);
                    return undefined;
                }
                result[uniform] = uniformTypesList[uniform];
            }
        }
        return result;
    }
}
