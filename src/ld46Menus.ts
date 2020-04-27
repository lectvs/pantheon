/// <reference path="../lectvs/menu.ts" />

class IntroMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem, {
            backgroundColor: 0x000000,
        }, [
            new SpriteText({
                name: 'introtext',
                x: 20, y: 80, text: "- a game by hayden mccraw -",
                font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
            }),
        ]);

        let introtext = this.getWorldObjectByName<SpriteText>('introtext');
        introtext.x = Main.width/2 - introtext.getTextWidth()/2;
        introtext.y = Main.height/2 - introtext.getTextHeight()/2;

        this.runScript(S.chain(
            S.wait(1.5),
            S.call(() => {
                introtext.setText("- made in 48 hours\n  for ludum dare 46 -");
                introtext.x = Main.width/2 - introtext.getTextWidth()/2;
                introtext.y = Main.height/2 - introtext.getTextHeight()/2;
            }),
            S.wait(1.5),
            S.call(() => { menuSystem.loadMenu(MainMenu); }),
        ));
    }
}

class MainMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem, {
            backgroundColor: 0x000000,
        }, [
            new SpriteText({
                x: 20, y: 20, text: "- a night in the dark -",
                font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
            }),
            new MenuTextButton({
                x: 20, y: 50, text: "start game",
                font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                onClick: () => menuSystem.game.startGame(),
            }),
            new MenuTextButton({
                x: 20, y: 68, text: "controls",
                font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                onClick: () => menuSystem.loadMenu(ControlsMenu),
            }),
        ]);
    }
}

class ControlsMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem, {
            backgroundColor: 0x000000,
            physicsGroups: { 'items': {} }
        }, [
            new SpriteText({
                x: 20, y: 15, text: "controls",
                font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
            }),
            new SpriteText({
                x: 20, y: 42, text: "arrows <^> - move\n\n" +
                                    "c - pickup\n" +
                                    "    drop\n" +
                                    "    throw\n\n" +
                                    "x - attack",
                font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
            }),
            new Player({
                name: 'player_move',
                x: 180, y: 53,
                effects: { outline: { color: 0xFFFFFF } }
            }),
            new Player({
                name: 'player_pickup',
                x: 140, y: 90,
                effects: { outline: { color: 0xFFFFFF } }
            }),
            new ItemGround({
                name: 'log',
                x: 140, y: 90,
                type: Item.Type.LOG,
            }),
            new Player({
                name: 'player_attack',
                x: 140, y: 154,
                effects: { outline: { color: 0xFFFFFF } }
            }),
            new ItemGround({
                name: 'axe',
                x: 140, y: 156,
                type: Item.Type.AXE,
                effects: { outline: { color: 0xFFFFFF } }
            }),
            new Tree({
                name: 'tree',
                x: 160, y: 156,
                effects: { outline: { color: 0xFFFFFF } }
            }),
            new MenuTextButton({
                x: 20, y: 160, text: "back",
                font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                onClick: () => menuSystem.back(),
            }),
        ]);

        let player_move = this.getWorldObjectByName<Player>('player_move');
        //player_move.test = true;
        let player_pickup = this.getWorldObjectByName<Player>('player_pickup');
        //player_pickup.test = true;
        let player_attack = this.getWorldObjectByName<Player>('player_attack');
        //player_attack.test = true;
        let tree = this.getWorldObjectByName<Tree>('tree');

        tree.setTexture('blacktree');

        this.runScript(S.simul(
            S.loopFor(Infinity, S.chain(
                S.doOverTime(0.8, t => { player_move.controller.right = true; }),
                S.doOverTime(0.8, t => { player_move.controller.left = true; }),
            )),
            S.loopFor(Infinity, S.chain(
                S.wait(0.5),
                S.call(() => { player_pickup.controller.pickupDropItem = true; }),
                S.wait(0.5),
                S.call(() => { player_pickup.controller.pickupDropItem = true; }),
                S.wait(0.5),
                S.call(() => { player_pickup.controller.pickupDropItem = true; }),
                S.wait(0.5),
                S.simul(
                    S.doOverTime(1.5, t => { player_pickup.controller.right = true; }),
                    S.chain(
                        S.wait(0.2),
                        S.call(() => { player_pickup.controller.pickupDropItem = true; }),
                    )
                ),
                S.call(() => { player_pickup.flipX = true; }),
                S.wait(0.5),
                S.call(() => { player_pickup.controller.pickupDropItem = true; }),
                S.wait(0.5),
                S.simul(
                    S.doOverTime(1.5, t => { player_pickup.controller.left = true; }),
                    S.chain(
                        S.wait(0.2),
                        S.call(() => { player_pickup.controller.pickupDropItem = true; }),
                    )
                ),
                S.call(() => { player_pickup.flipX = false; }),
            )),
            S.loopFor(Infinity, S.chain(
                S.call(() => {
                    let log = this.getWorldObjectByName<Sprite>('log');
                    log.effects.outline.enabled = true;
                    log.effects.outline.color = 0xFFFFFF;
                }),
                S.call(() => {
                    let axe = this.getWorldObjectByName<Sprite>('axe');
                    axe.effects.outline.enabled = true;
                    axe.effects.outline.color = 0xFFFFFF;
                }),
                S.wait(0.01),
            )),
            S.chain (
                S.call(() => { player_attack.controller.pickupDropItem = true; }),
                S.loopFor(Infinity, S.chain(
                    S.wait(0.5),
                    S.call(() => { player_attack.controller.useItem = true; }),
                    S.call(() => { tree.hp = 3; }),
                )),
            )
        ));
    }
}

class PauseMenu extends Menu {
    constructor(menuSystem: MenuSystem) {
        super(menuSystem, {
            backgroundColor: 0x000000,
        }, [
            new SpriteText({
                x: 20, y: 20, text: "- paused -",
                font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
            }),
            new MenuTextButton({
                x: 20, y: 50, text: "resume",
                font: Assets.fonts.DELUXE16, style: { color: 0xFFFFFF },
                onClick: () => menuSystem.game.unpauseGame(),
            }),
        ]);
    }
}