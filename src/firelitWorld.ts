type Light = {
    x: number;
    y: number;
    radius: number;
    buffer: number;
}

class FirelitWorld extends World {
    firelightFilter: TextureFilter;
    lights: Light[];

    fireRadiusNoise: number;
    torchFuel: number;
    torchRefuelDistance = 16;
    torchFireSprite: Sprite;
    winKeyRadius: number;

    hasWon: boolean;
    hasLost: boolean;

    constructor(config: World.Config) {
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
        this.torchFuel = 0;
        this.torchFireSprite = WorldObject.fromConfig({
            parent: fireSpriteConfig(),
            layer: 'main'
        });
        this.winKeyRadius = 0;

        this.runScript(S.call(() => {
            // Load torch in a script to delay one frame... :(
            let trees = this.getWorldObjectsByType<Tree>(Tree);
            trees[6].spawnsTorch = true;
        }));

        // Spawn monster after 60 seconds
        this.runScript(S.chain(
            S.wait(Debug.DEBUG ? 3 : 60),
            S.call(() => {
                let player = this.getWorldObjectByName('player');
                let monster = WorldObject.fromConfig({
                    name: 'monster',
                    constructor: Monster,
                    x: player.x + 200, y: player.y + 200,
                    layer: 'main',
                });
                World.Actions.addWorldObjectToWorld(monster, this);
            })
        ));
    }

    update(delta: number) {
        super.update(delta);

        let campfire = this.getWorldObjectByName<Campfire>('campfire');
        let torch = <Sprite>this.worldObjectsByName['torch'];
        let player = this.getWorldObjectByName<Player>('player');
        
        // Update fire light
        this.lights[0].x = campfire.x - this.camera.worldOffsetX;
        this.lights[0].y = campfire.y - this.camera.worldOffsetY;
        this.lights[0].radius = campfire.visualFireBaseRadius + this.fireRadiusNoise;
        this.lights[0].buffer = campfire.visualFireRadiusBuffer;
        if (Random.boolean(10*delta)) {
            this.fireRadiusNoise = Random.float(-1, 1);
        }

        // Update torch light
        if (torch) {
            let oldTorchFuel = this.torchFuel;
            this.torchFuel -= 0.03*delta;
            if (M.distance(campfire.x, campfire.y, torch.x, torch.y) < this.torchRefuelDistance) {
                this.torchFuel += 1*delta;
            }
            this.torchFuel = M.clamp(this.torchFuel, 0, 1);
            
            if (this.torchFireSprite.parent !== torch) {
                World.Actions.addChildToParent(this.torchFireSprite, torch);
            }
            let torchScale = this.torchFuel;
            this.torchFireSprite.scaleX = 0.7*torchScale;
            this.torchFireSprite.scaleY = 0.7*torchScale;
            this.torchFireSprite.offset.x = torch.offset.x;
            this.torchFireSprite.offset.y = torch.offset.y - 4;

            let torchFuelEmptyThreshold = 0.1;
            if (this.torchFuel <= torchFuelEmptyThreshold && oldTorchFuel > torchFuelEmptyThreshold) {
                this.torchFuel = 0;
                let smoke = WorldObject.fromConfig<Sprite>({
                    constructor: Sprite,
                    x: 0, y: 0,
                    texture: 'smoke',
                    scaleX: 0.5, scaleY: 0.5,
                    layer: 'above',
                });
                World.Actions.addChildToParent(smoke, this.torchFireSprite);
                this.runScript(S.doOverTime(2, t => {
                    smoke.offset.x = this.torchFireSprite.offset.x + 2 * Math.exp(-t) * Math.sin(4*Math.PI*t);
                    smoke.offset.y = this.torchFireSprite.offset.y + -16 * t;
                    smoke.alpha = 1-t;
                }));
            }
        }
        if (torch && !campfire.hitEffect && !this.hasLost) {
            this.lights[1].x = torch.x + torch.offset.x - this.camera.worldOffsetX;
            this.lights[1].y = torch.y + torch.offset.y - this.camera.worldOffsetY;
            this.lights[1].radius = Math.pow(this.torchFuel, 0.7) * 40;
            this.lights[1].buffer = Math.pow(this.torchFuel, 0.7) * 10;
            if (Random.boolean(10*delta)) {
                this.lights[1].radius += Random.float(-1, 1);
            }
        } else {
            this.lights[1].radius = 0;
        }

        // Update win light
        this.lights[2].x = campfire.x - this.camera.worldOffsetX;
        this.lights[2].y = campfire.y - this.camera.worldOffsetY;
        this.lights[2].radius = this.winKeyRadius;
        this.lights[2].buffer = 0;

        this.updateLights();

        // Check for win condition
        if (campfire.hasConsumedGasoline && !this.hasWon) {
            this.hasWon = true;
            this.runScript(S.chain(
                S.call(() => {
                    this.camera.setModeFocus(campfire.x, campfire.y);
                    this.camera.setMovementSmooth(0, 0, 0);
                    player.controllable = false;
                    if (this.containsWorldObject('monster')) {
                        World.Actions.removeWorldObjectFromWorld(this.getWorldObjectByName('monster'));
                    }
                    campfire.winEffect = true;
                    if (campfire.winRadius < campfire.visualFireBaseRadius) {
                        campfire.visualFireRadiusBuffer = 100;
                    }
                }),
                S.wait(4),
                S.doOverTime(3, t => {
                    this.winKeyRadius = 400 * t;
                    campfire.timer.time -= 120*global.script.delta;
                }),
                S.call(() => {
                    let whiteScreen = new Texture(Main.width, Main.height);
                    Draw.brush.color = 0xFFFFFF;
                    Draw.fill(whiteScreen);
                    World.Actions.addWorldObjectToWorld(WorldObject.fromConfig({
                        constructor: Sprite,
                        texture: whiteScreen,
                        layer: 'above',
                        ignoreCamera: true,
                    }), this);
                    World.Actions.addWorldObjectToWorld(WorldObject.fromConfig({
                        constructor: SpriteText,
                        font: Assets.fonts.DELUXE16,
                        x: 61, y: 72,
                        text: "your fire lives\nanother day...",
                        style: { color: 0x000000, },
                        ignoreCamera: true,
                    }), this);
                }),
                S.wait(2),
                S.fadeOut(3, 0xFFFFFF),
                S.wait(1),
                S.fadeOut(3),
                S.wait(1),
                S.call(() => {
                    global.game.loadMainMenu();
                })
            ));
        }
    
        // Check for loss condition
        if (campfire.isOut && !this.hasLost && !this.hasWon) {
            this.hasLost = true;
            let smoke: Sprite;
            this.runScript(S.chain(
                S.call(() => {
                    this.camera.setModeFocus(campfire.x, campfire.y);
                    this.camera.setMovementSmooth(0, 0, 0);
                    player.controllable = false;
                    if (this.containsWorldObject('monster')) {
                        World.Actions.removeWorldObjectFromWorld(this.getWorldObjectByName('monster'));
                    }
                }),
                S.wait(2),
                S.call(() => {
                    campfire.fireSprite.alpha = 0;
                    smoke = WorldObject.fromConfig({
                        constructor: Sprite,
                        x: campfire.x, y: campfire.y,
                        texture: 'smoke',
                        layer: 'above',
                    });
                    World.Actions.addWorldObjectToWorld(smoke, this);
                }),
                S.doOverTime(2, t => {
                    smoke.offset.x = 4 * Math.exp(-t) * Math.sin(4*Math.PI*t);
                    smoke.offset.y = -32 * t;
                    smoke.alpha = 1-t;
                }),
                S.wait(1),
                S.call(() => {
                    let blackScreen = new Texture(Main.width, Main.height);
                    Draw.brush.color = 0x000000;
                    Draw.fill(blackScreen);
                    World.Actions.addWorldObjectToWorld(WorldObject.fromConfig({
                        constructor: Sprite,
                        texture: blackScreen,
                        ignoreCamera: true,
                    }), this);
                    World.Actions.addWorldObjectToWorld(WorldObject.fromConfig({
                        name: 'losstext',
                        constructor: SpriteText,
                        font: Assets.fonts.DELUXE16,
                        x: 30, y: 80,
                        text: "you ran out of light...",
                        style: { color: 0xFFFFFF, },
                        ignoreCamera: true,
                    }), this);
                }),
                S.wait(2),
                S.call(() => {
                    let hint = Random.element([
                        "chop faster",
                        "[e]throw[/e] logs into the fire",
                        "did you find the [e]door[/e]?",
                        "did you find the [e]key[/e]?",
                        "did you find the [e]torch[/e]?",
                    ]);
                    World.Actions.addWorldObjectToWorld(WorldObject.fromConfig({
                        name: 'losshint',
                        constructor: SpriteText,
                        font: Assets.fonts.DELUXE16,
                        x: 30, y: 160,
                        text: hint,
                        style: { color: 0x333333, alpha: 0 },
                        ignoreCamera: true,
                    }), this);
                }),
                S.doOverTime(2, t => {
                    let losshint = this.getWorldObjectByName<SpriteText>('losshint');
                    losshint.x = Main.width/2 - losshint.getTextWidth()/2;
                    losshint.style.alpha = t;
                }),
                S.wait(2),
                S.fadeOut(3),
                S.wait(1),
                S.call(() => {
                    global.game.loadMainMenu();
                })
            ));
        }
    }

    renderLayer(layer: World.Layer, layerTexture: Texture, screen: Texture) {
        layerTexture.clear();
        layer.sort();
        for (let worldObject of layer.worldObjects) {
            if (worldObject.visible) {
                worldObject.fullRender(layerTexture);
            }
        }

        let filters = [];
        if (layer.name === 'bg' || layer.name === 'main' || layer.name === 'fg') {
            filters.push(this.firelightFilter);
        }

        screen.render(layerTexture, {
            filters: filters
        });
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