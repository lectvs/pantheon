class LightingManager extends WorldObject {
    firelightFilter: TextureFilter;
    lights: Light[];

    fireRadiusNoise: number;
    winKeyRadius: number;

    constructor(config: WorldObject.Config) {
        super(config);

        this.lights = [
            { x: 0, y: 0, radius: 0, buffer: 0 },
            { x: 0, y: 0, radius: 0, buffer: 0 },
            { x: 0, y: 0, radius: 0, buffer: 0 },
        ];
        let uniforms = [];
        let defaultUniforms = {};
        let distanceCalculations = "";
        let lightCalculations = "";
        let maxCalculations = "";
        for (let i = 0; i < this.lights.length; i++) {
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
        this.firelightFilter = new TextureFilter({
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

        this.fireRadiusNoise = 0;
        this.winKeyRadius = 0;
    }

    update(delta: number) {
        let world = <FirelitWorld>this.world;
        let campfire = this.world.getWorldObjectByName<Campfire>('campfire');
        let torch = <Sprite>this.world.worldObjectsByName['torch'];

        // Update fire light
        this.lights[0].x = campfire.x - world.camera.worldOffsetX;
        this.lights[0].y = campfire.y - world.camera.worldOffsetY;
        this.lights[0].radius = campfire.visualFireBaseRadius + this.fireRadiusNoise;
        this.lights[0].buffer = campfire.visualFireRadiusBuffer;
        if (Random.boolean(10*delta)) {
            this.fireRadiusNoise = Random.float(-1, 1);
        }

        // Update torch light
        if (torch) {

            
        }
        if (torch && !campfire.hitEffect && global.theater.storyManager.currentNodeName !== 'lose') {
            this.lights[1].x = torch.x + torch.offset.x - world.camera.worldOffsetX;
            this.lights[1].y = torch.y + torch.offset.y - world.camera.worldOffsetY;
            this.lights[1].radius = Math.pow(world.torchFuel, 0.7) * 40;
            this.lights[1].buffer = Math.pow(world.torchFuel, 0.7) * 10;
            if (Random.boolean(10*delta)) {
                this.lights[1].radius += Random.float(-1, 1);
            }
        } else {
            this.lights[1].radius = 0;
        }

        // Update win light
        this.lights[2].x = campfire.x - world.camera.worldOffsetX;
        this.lights[2].y = campfire.y - world.camera.worldOffsetY;
        this.lights[2].radius = this.winKeyRadius;
        this.lights[2].buffer = 0;

        this.updateLights();

        super.update(delta);
    }
    
    private updateLights() {
        for (let i = 0; i < this.lights.length; i++) {
            this.firelightFilter.setUniform(`light_${i}_x`, this.lights[i].x);
            this.firelightFilter.setUniform(`light_${i}_y`, this.lights[i].y);
            this.firelightFilter.setUniform(`light_${i}_radius`, this.lights[i].radius);
            this.firelightFilter.setUniform(`light_${i}_buffer`, this.lights[i].buffer);
        }
    }
}