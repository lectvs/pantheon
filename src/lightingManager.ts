namespace Lighting {
    export class FirelightFilter extends TextureFilter {
        constructor(numLights: number) {
            let uniforms = [];
            let defaultUniforms = {};
            let distanceCalculations = "";
            let lightCalculations = "";
            let maxCalculations = "";
            for (let i = 0; i < numLights; i++) {
                uniforms.push(`float light_${i}_x`);
                uniforms.push(`float light_${i}_y`);
                uniforms.push(`float light_${i}_radius`);
                uniforms.push(`float light_${i}_buffer`);
                defaultUniforms[`light_${i}_x`] = 0;
                defaultUniforms[`light_${i}_y`] = 0;
                defaultUniforms[`light_${i}_radius`] = 0;
                defaultUniforms[`light_${i}_buffer`] = 0;
                distanceCalculations += `float light_${i}_distance = sqrt((worldx - light_${i}_x) * (worldx - light_${i}_x) + (worldy - light_${i}_y) * (worldy - light_${i}_y));\n`;
                lightCalculations += `float light_${i}_light = 1.0;
                                    if (light_${i}_distance > light_${i}_radius) light_${i}_light = 0.5;
                                    if (light_${i}_distance > light_${i}_radius + light_${i}_buffer) light_${i}_light = 0.0;\n`;
                maxCalculations += `light = max(light, light_${i}_light);\n`;
            }
            super({
                uniforms: uniforms,
                defaultUniforms: defaultUniforms,
                code: `
                    float light = 0.0;

                    ${distanceCalculations}
                    ${lightCalculations}
                    ${maxCalculations}

                    if (light == 0.5) {
                        if (outp.rgb == vec3(1.0, 1.0, 1.0)) {
                            outp.rgb = vec3(0.0, 0.0, 0.0);
                        } else if (outp.rgb == vec3(0.0, 0.0, 0.0)) {
                            outp.rgb = vec3(1.0, 1.0, 1.0);
                        }
                    } else if (light == 0.0 && inp.rgb != vec3(1.0, 0.0, 0.0)) {
                        outp.r = 0.0;
                        outp.g = 0.0;
                        outp.b = 0.0;
                    }
                `
            });
        }

        setLightUniform(i: number, uniform: string, value: number) {
            this.setUniform(`light_${i}_${uniform}`, value);
        }
    }
}



class LightingManager extends WorldObject {
    get firelightFilter() { return <Lighting.FirelightFilter>this.world.getLayerByName('main').effects.post.filters[0]; }

    fireRadius: LerpingValueWithNoise;
    fireBuffer: LerpingValueWithNoise;

    winRadius: number;

    constructor(config: WorldObject.Config) {
        super(config);

        this.fireRadius = new LerpingValueWithNoise(0, 600, 10, 1);
        this.fireBuffer = new LerpingValueWithNoise(0, 600, 0, 0);
        this.winRadius = 0;
    }

    update(delta: number) {
        let player = this.world.getWorldObjectByType(Player);
        let campfire = this.world.getWorldObjectByType(Campfire);
        let torchLightManager = this.world.getWorldObjectByType(TorchLightManager);

        // Update fire light
        this.fireRadius.goal = campfire.getRadius();
        this.fireBuffer.goal = campfire.getBuffer();
        if (global.theater.storyManager.currentNodeName === 'intro') {
            this.fireRadius.goal = 40;
        }
        if (global.theater.storyManager.currentNodeName === 'win') {
            this.fireRadius.goal = Math.min(this.fireRadius.goal, 40);
        }
        if (player.state === 'hurt') {
            this.fireRadius.goal = 0;
            this.fireBuffer.goal = campfire.getRadius() + campfire.getBuffer();
        }
        this.fireRadius.update(delta);
        this.fireBuffer.update(delta);

        this.firelightFilter.setLightUniform(0, 'x', campfire.x - this.world.camera.worldOffsetX);
        this.firelightFilter.setLightUniform(0, 'y', campfire.y - this.world.camera.worldOffsetY);
        this.firelightFilter.setLightUniform(0, 'radius', this.fireRadius.value);
        this.firelightFilter.setLightUniform(0, 'buffer', this.fireBuffer.value);

        // Update torch light
        this.firelightFilter.setLightUniform(1, 'x', torchLightManager.torchLightX - this.world.camera.worldOffsetX);
        this.firelightFilter.setLightUniform(1, 'y', torchLightManager.torchLightY - this.world.camera.worldOffsetY);
        this.firelightFilter.setLightUniform(1, 'radius', torchLightManager.torchLightRadius);
        this.firelightFilter.setLightUniform(1, 'buffer', torchLightManager.torchLightBuffer);

        // Update win light
        this.firelightFilter.setLightUniform(2, 'x', campfire.x - this.world.camera.worldOffsetX);
        this.firelightFilter.setLightUniform(2, 'y', campfire.y - this.world.camera.worldOffsetY);
        this.firelightFilter.setLightUniform(2, 'radius', this.winRadius);
        this.firelightFilter.setLightUniform(2, 'buffer', 0);

        super.update(delta);
    }
}