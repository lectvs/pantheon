var seenBossDialog: boolean = false;

function getStoryboard(): Storyboard { return {
    'start': {
        type: 'start',
        transitions: [{ onStage: 'game', toNode: 'gameplay' }]
    },
    'gameplay': {
        type: 'gameplay',
        transitions: [
            { condition: () => global.world.select.type(Boss).dead, toNode: 'win' },
            { condition: () => global.world.select.name<Player>('player').dead, toNode: 'death' },
            { condition: () => !global.world.select.type(Boss).startedFighting
                            && global.world.select.name<Player>('player').y > 3618, toNode: 'introduce_boss' },
        ]
    },
    'introduce_boss': {
        type: 'cutscene',
        script: function*() {
            global.world.addWorldObject(new Sprite({
                x: 7*16, y: 222*16,
                texture: Texture.filledRect(48, 32, 0x000000),
                layer: 'walls',
                physicsGroup: 'walls',
                bounds: new RectBounds(0, 0, 48, 32),
            }));

            Puff.puffDirection(global.world, 7*16 + 24, 222*16 + 32, 10, Direction2D.DOWN, 50, 50);

            let player = global.world.select.name<Player>('player');
            player.flipX = true;

            let oldMusic = music;
            global.world.runScript(S.doOverTime(2, t => oldMusic.volume = 1-t));

            if (!seenBossDialog) {
                yield S.wait(2);

                yield S.dialog("[g]Well, well. You've finally arrived.[/g]");
                yield S.dialog("You! You're--!");
                yield S.dialog("[g]You didn't think you'd get through this entire thing with no lore, did you?[/g]");
                yield S.dialog("But, who are you?");
                yield S.dialog("[g]I'm you, but digitized.[/g]");
                yield S.dialogAdd(" [g]It's symbolic.[/g]");
                yield S.dialog("What?");
                yield S.dialog("[g]Look, I'm the final boss, so just fight me, okay?[/g]");
                yield S.wait(0.5);
                seenBossDialog = true;
            }

            music = global.world.playSound('boss');
            global.world.runScript(S.doOverTime(3, t => music.volume = t*t));
            global.world.select.type(Boss).startFighting();
        },
        transitions: [
            { toNode: 'gameplay' }
        ]
    },
    'win': {
        type: 'cutscene',
        script: function*() {
            music.paused = true;
            yield S.wait(2);

            yield S.dialog("[g]No! Defeated so easily?![/g]")
            yield S.dialog("[g]Maybe I'll be harder in the post-jam versionn\nnnnnnnnnnnnnnnnnn\nnnnnnnnnnnnnn!!!![/g]");

            yield S.simul(
                S.shake(10, 5),
                S.fadeOut(5, 0xFFFFFF),
                S.doOverTime(5, t => global.world.volume = 1-t),
            );

            yield S.wait(3);

            global.game.loadMainMenu();
        },
        transitions: []
    },
    'death': {
        type: 'cutscene',
        script: function*() {
            music.paused = true;
            global.world.select.name<Player>('player').playGlitchSound();

            yield S.shake(5, 1);

            global.theater.loadStage('game');
        },
        transitions: [
            { toNode: 'gameplay' }
        ]
    }
}}