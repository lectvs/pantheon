/// <reference path="theater.ts"/>

class TestTheater extends Theater {
    t: Texture;
    f: TextureFilter;
    f2: TextureFilter;
    doSlice: boolean;

    constructor() {
        DEBUG_SHOW_MOUSE_POSITION = false;
        super({
            stages: {'s': { backgroundColor: 0x000066 }},
            stageToLoad: 's',
            storyboard: {'s': { type: 'gameplay', start: () => {} }},
            storyboardEntry: 's',
            party: party,
            dialogBox: {
                x: Main.width/2, y: Main.height - 32,
                texture: 'dialogbox',
                spriteTextFont: Assets.fonts.DELUXE16,
                textAreaFull: { x: -122, y: -27, width: 244, height: 54 },
                textAreaPortrait: { x: -122, y: -27, width: 174, height: 54 },
                portraitPosition: { x: 86, y: 0 },
                advanceKey: 'advanceDialog',
            },
            skipCutsceneScriptKey: 'skipCutsceneScript',
            interactionManager: {
                highlightFunction: sprite => {
                    sprite.effects.outline.enabled = true;
                    sprite.effects.outline.color = 0xFFFF00;
                },
                resetFunction: sprite => {
                    sprite.effects.outline.enabled = false;
                },
            }
        });

        this.t = AssetCache.getTexture('grad');
        this.f = new TextureFilter({
            uniforms: [],
            defaultUniforms: {},
            code: `
                result = vec4(1.0 - color.r, 1.0 - color.g, 1.0 - color.b, color.a);
            `
        });

        this.f2 = new TextureFilter({
            uniforms: [],
            defaultUniforms: {},
            code: `
                result = vec4(1.0, 0.0, 0.0, color.a);
            `
        });

        this.doSlice = true;
    }

    render() {
        super.render();

        if (Input.justDown('1')) {
            this.doSlice = !this.doSlice;
        }

        global.screen.render(AssetCache.getTexture('bed'), {
            x: 100,
            y: 100,
            slice: this.doSlice ? { x: 0, y: 0, width: 20, height: 20 } : undefined,
            filters: [this.f]
        });

         global.screen.render(this.t, {
             x: Input.mouseX,
             y: Input.mouseY,
             slice: { x: 20, y: 20, width: 20, height: 20 },
             filters: [ this.f2 ],
        });
    }
}