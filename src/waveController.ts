class WaveController extends WorldObject {
    currentWave: number = 0;

    music: Sound;

    isNormalWaveDefeated(wave: number = this.currentWave) {
        return this.world.select.nameAll('spawn').length <= 0 && this.world.select.typeAll(Enemy).length <= 1 && this.currentWave === wave;
    }

    isKingWaveDefeated() {
        return (!this.world.select.type(Throne, false) || this.world.select.type(Throne).health) <= 1000 && this.currentWave === 9001;
    }

    spawnWave1() {
        this.currentWave = 1;

        this.world.addWorldObjects([
            this.enemySpawn(Golbin, 220, 476),
            this.enemySpawn(Golbin, 548, 476),
        ]);
    }

    spawnWave2() {
        this.currentWave = 2;
        this.world.addWorldObjects([
            this.enemySpawn(Knight, 220, 400),
            this.enemySpawn(Knight, 220, 552),
            this.enemySpawn(Knight, 548, 400),
            this.enemySpawn(Knight, 548, 552),
        ]);
    }

    spawnWave3() {
        this.currentWave = 3;
        this.world.addWorldObjects([
            this.enemySpawn(Golbin, 220, 400),
            this.enemySpawn(Mage, 220, 552),
            this.enemySpawn(Mage, 548, 400),
            this.enemySpawn(Golbin, 548, 552),
        ]);
    }

    spawnWave4() {
        this.currentWave = 4;
        this.world.addWorldObjects([
            this.enemySpawn(Golbin, 220, 400),
            this.enemySpawn(Golbin, 220, 552),
            this.enemySpawn(Knight, 160, 476),
            this.enemySpawn(Golbin, 548, 400),
            this.enemySpawn(Golbin, 548, 552),
            this.enemySpawn(Knight, 608, 476),
        ]);
    }

    spawnWave5() {
        this.currentWave = 5;
        this.world.addWorldObjects([
            this.enemySpawn(Golbin, 220, 400),
            this.enemySpawn(Knight, 220, 552),
            this.enemySpawn(Knight, 160, 476),
            this.enemySpawn(Mage, 100, 476),
            this.enemySpawn(Knight, 548, 400),
            this.enemySpawn(Golbin, 548, 552),
            this.enemySpawn(Golbin, 608, 476),
            this.enemySpawn(Mage, 668, 476),
        ]);
    }

    spawnWaveKing() {
        this.currentWave = 9001;
        
        let guards = this.world.select.nameAll<Sprite>('guard');
        for (let guard of guards) {
            let newGuard = this.world.addWorldObject(new Knight({
                x: guard.x, y: guard.y,
                tint: guard.tint,
                layer: 'main',
                flipX: guard.flipX,
                physicsGroup: 'enemies'
            }));
            newGuard.health = 2;

            guard.removeFromWorld();
        }
    }

    startMusic() {
        this.music = this.world.playSound(this.currentWave === 9001 ? 'musicboss' : 'music');
        this.music.loop = true;
    }

    stopMusic() {
        if (this.music) {
            this.world.runScript(S.tween(3, this.music, 'volume', this.music.volume, 0));
        }
    }

    private enemySpawn(constructor: new (config: Sprite.Config) => Enemy, x: number, y: number) {
        return spawn(new constructor({
            x: x, y: y,
            layer: 'main',
            physicsGroup: 'enemies'
        }));
    }
}