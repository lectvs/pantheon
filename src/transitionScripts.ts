namespace TransitionScripts {
    var startFallingTime: number = undefined;

    export function executeTransition(world: World, oldSector: Vector2, newSector: Vector2) {
        let player = world.select.type(Player);

        if (oldSector.x === 0 && oldSector.y === 0 && newSector.x === -1 && newSector.y === 0) {
            global.theater.playMusic('house', 0.5);
            return false;
        }

        if (oldSector.x === -1 && oldSector.y === 0 && newSector.x === 0 && newSector.y === 0) {
            global.theater.stopMusic(0.5);
            return false;
        }

        if (oldSector.x === 4 && oldSector.y === 0 && newSector.x === 4 && newSector.y === 1) {
            player.spinning = true;
            return false;
        }

        if (oldSector.x === 4 && oldSector.y === 1 && newSector.x === 4 && newSector.y > 1) {
            if (startFallingTime === undefined) {
                startFallingTime = world.time;
            }
            if (world.time > startFallingTime + 5) {
                player.v.y = Math.min(player.v.y, 800);
                player.vylimit = Infinity;
                global.theater.cutsceneManager.playCutscene('intro_undermine');
                return false;
            }
            player.teleport(player.x, player.y - world.height * (newSector.y - oldSector.y));
            sectorModifier++;
            return true;
        }

        if (oldSector.x === 6 && oldSector.y === 1 && newSector.x === 6 && newSector.y === 2) {
            player.teleport(player.x + 2*world.width, player.y);
            return true;
        }

        if (oldSector.x === 8 && oldSector.y === 2 && newSector.x === 7 && newSector.y === 2) {
            player.teleport(player.x - 2*world.width, player.y);
            return true;
        }

        if (oldSector.x === 8 && oldSector.y === 2 && newSector.x === 9 && newSector.y === 2) {
            if (player.y > 777) {  // Lucky??
                player.teleport(player.x - 2*world.width, player.y);
                return true;
            }
        }

        if (oldSector.x === 6 && oldSector.y === 4 && newSector.x === 6 && newSector.y === 5) {
            player.spinning = true;
            player.vylimit = 400;
            return false;
        }

        if (oldSector.x === 6 && oldSector.y === 5 && newSector.x === 6 && newSector.y === 6) {
            global.theater.stopMusic(0.3);
            return false;
        }

        if (oldSector.x === 6 && oldSector.y === 6 && newSector.x === 6 && newSector.y > 6) {
            // :)
            player.teleport(2215, -318);
            hasFallen = true;
            global.world.select.name('scammir', false)?.removeFromWorld();
            let movabledoor = global.world.select.name<LockedDoor>('movabledoor');
            movabledoor.setVisible(true);
            movabledoor.physicsGroup = 'walls';
            global.world.select.name('note').setVisible(true);
            return true;
        }

        if (oldSector.x === 7 && oldSector.y === 3 && newSector.x === 8 && newSector.y === 3) {
            global.theater.stopMusic(0.5);
            return false;
        }

        if (oldSector.x === 8 && oldSector.y === 3 && newSector.x === 7 && newSector.y === 3) {
            global.theater.playMusic('caverns', 0.5);
            return false;
        }

        if (oldSector.x === 4 && oldSector.y === 3 && newSector.x === -1 && newSector.y === 4) {
            global.theater.stopMusic(0.5);
            return false;
        }

        return false;
    }
}