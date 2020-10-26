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
            let newGuard = this.world.addWorldObject(new Knight());
            newGuard.x = guard.x;
            newGuard.y = guard.y;
            newGuard.flipX = guard.flipX;
            newGuard.tint = guard.tint;
            newGuard.health = 2;
            World.Actions.setLayer(newGuard, 'main');
            World.Actions.setPhysicsGroup(newGuard, 'enemies');

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

    private enemySpawn(constructor: new () => Enemy, x: number, y: number) {
        let enemy = new constructor();
        enemy.x = x;
        enemy.y = y;
        World.Actions.setLayer(enemy, 'main');
        World.Actions.setPhysicsGroup(enemy, 'enemies');
        return spawn(enemy);
    }
}