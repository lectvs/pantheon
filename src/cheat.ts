/// <reference path="../lectvs/debug/cheat.ts" />

Cheat.init({
    'win': () => global.world.select.type(Throne).damage(5),
    'lose': () => A.range(5).forEach(i => global.world.select.type(Player).damage()),
    'killall': () => {
        global.world.select.typeAll(Enemy).filter(e => !(e instanceof Throne)).forEach(e => e.kill());
        global.world.select.nameAll('spawn').forEach(s => s.kill());
    },
    'explode': () => {
        global.world.addWorldObject(new Explosion({
            x: 400, y: 400,
        }));
    },
    'skiptofinalwave': () => {
        Cheat['killall']();
        Debug.SKIP_RATE = 1;
        global.theater.storyManager.setNode('spawn_wave_king');
    },
});