class WaveController extends WorldObject {
    currentWave: number = 0;

    music: Sound;

    isWaveDefeated(wave: number) {
        if (wave === 9001) {
            return this.world.select.type(Throne).health <= 1000 && this.currentWave === wave;
        }
        return this.world.select.nameAll('spawn').length <= 0 && this.world.select.typeAll(Enemy).length <= 1 && this.currentWave === wave;
    }

    spawnWave1() {
        this.currentWave = 1;
        this.world.addWorldObjects([
            spawn(<Sprite.Config>{
                constructor: Golbin,
                x: 220, y: 476,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Golbin,
                x: 548, y: 476,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
        ]);
    }

    spawnWave2() {
        this.currentWave = 2;
        this.world.addWorldObjects([
            spawn(<Sprite.Config>{
                constructor: Knight,
                x: 220, y: 400,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Knight,
                x: 220, y: 552,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Knight,
                x: 548, y: 400,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Knight,
                x: 548, y: 552,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
        ]);
    }

    spawnWave3() {
        this.currentWave = 3;
        this.world.addWorldObjects([
            spawn(<Sprite.Config>{
                constructor: Golbin,
                x: 220, y: 400,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Mage,
                x: 220, y: 552,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Mage,
                x: 548, y: 400,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Golbin,
                x: 548, y: 552,
                layer: 'main',
                physicsGroup: 'enemies',
            }),

        ]);
    }

    spawnWave4() {
        this.currentWave = 4;
        this.world.addWorldObjects([
            spawn(<Sprite.Config>{
                constructor: Golbin,
                x: 220, y: 400,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Golbin,
                x: 220, y: 552,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Knight,
                x: 160, y: 476,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Golbin,
                x: 548, y: 400,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Golbin,
                x: 548, y: 552,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Knight,
                x: 608, y: 476,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
        ]);
    }

    spawnWave5() {
        this.currentWave = 5;
        this.world.addWorldObjects([
            spawn(<Sprite.Config>{
                constructor: Golbin,
                x: 220, y: 400,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Knight,
                x: 220, y: 552,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Knight,
                x: 160, y: 476,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Mage,
                x: 100, y: 476,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Knight,
                x: 548, y: 400,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Golbin,
                x: 548, y: 552,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Golbin,
                x: 608, y: 476,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
            spawn(<Sprite.Config>{
                constructor: Mage,
                x: 668, y: 476,
                layer: 'main',
                physicsGroup: 'enemies',
            }),
        ]);
    }

    spawnWaveKing() {
        this.currentWave = 9001;
        
        let guards = this.world.select.nameAll<Sprite>('guard');
        for (let guard of guards) {
            this.world.addWorldObject(<Enemy.Config>{
                constructor: Knight,
                x: guard.x, y: guard.y,
                layer: 'main',
                flipX: guard.flipX,
                tint: guard.tint,
                maxHealth: 2,
                physicsGroup: 'enemies',
            });
            guard.removeFromWorld();
        }
    }

    startMusic() {
        this.music = this.world.playSound(this.currentWave === 9001 ? 'musicboss' : 'music');
        this.music.volume = 0.5;
        this.music.loop = true;
    }

    stopMusic() {
        if (this.music) {
            let music = this.music;
            this.world.runScript(S.chain(
                S.doOverTime(3, t => music.volume = 0.5*(1-t)),
            ));
        }
    }
}