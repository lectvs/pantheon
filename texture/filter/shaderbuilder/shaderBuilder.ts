/// <reference path="./node.ts" />

class ShaderBuilder {
    static build(rootNode: SB.Statement | SB.Statement[], uniformDefaultsByName: Dict<any>) {

        let rootNodeList: SB.Statement[] = _.isArray(rootNode) ? rootNode : [rootNode];

        let uniforms = {};
        let uniformTypes = this.getUniformTypes(rootNodeList);

        for (let name in uniformTypes) {
            let type = uniformTypes[name];
            let value = uniformDefaultsByName[name];
            if (value === undefined) continue;

            if (!this.typeCheck(type, value)) {
                console.error('Shader failed type-checking type', type, 'against default value', value);
                return undefined;
            }

            uniforms[`${type} ${name}`] = uniformDefaultsByName[name];
        }

        return new TextureFilter({
            code: rootNodeList.map(rootNode => rootNode.build()).join('\n'),
            uniforms: uniforms
        });
    }

    private static getUniformTypes(rootNodeList: SB.Statement[]) {
        let result: Dict<SB.Types.Types> = {};
        for (let rootNode of rootNodeList) {
            result = SB.combineUniformTypeDicts(result, rootNode.getUniforms());
        }
        return result;
    }

    private static typeCheck<T extends SB.Types.Types>(type: T, value: any) {
        if (type === 'float') return _.isNumber(value) && isFinite(value);
        if (type === 'vec4') return _.isArray(value) && value.length === 4;
        return false;
    }
}

let filter: TextureFilter;
namespace SB {

    let ast = setOutputColor( multiply(inputColor(), float('amount')) );

    filter = ShaderBuilder.build(ast, { amount: 0 });


}

function testSB() {
    global.game.menuSystem.currentMenu.addWorldObject(new Sprite({
        texture: 'player',
        x: global.gameWidth/2,
        y: global.gameHeight/2,
        effects: { post: { filters: [filter] } }
    }));
}
