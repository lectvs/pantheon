class TorchLightManager extends WorldObject {
    torchFuel: number;
    torchRadiusNoise: number;
    torchRefuelDistance = 16;
    torchFuelEmptyThreshold = 0.1;

    torchSound: Sound;

    get torchLightX() {
        if (!this.world.hasWorldObject('torch')) {
            return 0;
        }
        let torch = this.world.getWorldObjectByName<Sprite>('torch');
        return torch.x + torch.offset.x;
    }

    get torchLightY() {
        if (!this.world.hasWorldObject('torch')) {
            return 0;
        }
        let torch = this.world.getWorldObjectByName<Sprite>('torch');
        return torch.y + torch.offset.y;
    }

    get torchLightRadius() {
        if (!this.world.hasWorldObject('torch') || /*this.world.getWorldObjectByType(Campfire).hitEffect ||*/ global.theater.storyManager.currentNodeName === 'lose') {
            return 0;
        }
        let radius = Math.pow(this.torchFuel, 0.7) * 40;
        return radius === 0 ? 0 : radius + this.torchRadiusNoise;
    }
    get torchLightBuffer() { return Math.pow(this.torchFuel, 0.7) * 10; }

    constructor(config: WorldObject.Config) {
        super(config);
        this.torchFuel = 0;
        this.torchRadiusNoise = 0;
    }

    update(delta: number) {
        if (this.world.hasWorldObject('torch')) {
            let torch = this.world.getWorldObjectByName<Sprite>('torch');
            let campfire = this.world.getWorldObjectByType(Campfire);

            let oldTorchFuel = this.torchFuel;
            this.torchFuel -= 0.03*delta;
            if (M.distance(campfire.x, campfire.y, torch.x, torch.y) < this.torchRefuelDistance) {
                this.torchFuel += 1*delta;
            }
            this.torchFuel = M.clamp(this.torchFuel, 0, 1);

            if (this.torchFuel <= this.torchFuelEmptyThreshold && oldTorchFuel > this.torchFuelEmptyThreshold) {
                this.torchFuel = 0;
                this.world.getWorldObjectByName<Sprite>('torchFire').addChild<Sprite>(<Sprite.Config>{
                    constructor: Sprite,
                    x: 0, y: 0,
                    texture: 'smoke',
                    scaleX: 0.5, scaleY: 0.5,
                    layer: 'above',
                    life: 2,
                    updateCallback: (smoke: Sprite, delta) => {
                        let t = smoke.life.progress;
                        let torchFire = <Sprite>smoke.parent;
                        smoke.offset.x = torchFire.offset.x + 2 * Math.exp(-t) * Math.sin(4*Math.PI*t);
                        smoke.offset.y = torchFire.offset.y + -16 * t;
                        smoke.alpha = 1-t;
                    }
                });
                this.world.playSound('fireout');
            }

            this.updateTorchSound();
        }

        if (Random.boolean(10*delta)) {
            this.torchRadiusNoise = Random.float(-1, 1);
        }

        super.update(delta);
    }

    updateTorchSound() {
        if (!this.torchSound) {
            this.torchSound = this.world.playSound('fire');
            this.torchSound.loop = true;
        }

        let torchBaseVolume = this.getTorchSoundVolume();
        let player = this.world.getWorldObjectByType(Player);
        let distance = M.distance(player.x, player.y, this.x, this.y);
        let volume = torchBaseVolume*Math.max(1 - distance/100, 0);
        this.torchSound.volume = volume;
    }

    getTorchSoundVolume() {
        if (this.torchFuel <= 0) {
            return 0;
        }
        return 0.7;
    }
}