function autoPlayScript(endNode: string) {
    return function*() {
        yield;
        let theater = global.theater;
        let sai = theater.party.members['sai'].worldObject;

        let script = new Script(function* () {
            while (theater.currentStageName === 'outside') {
                Input.debugKeyJustDown('advanceDialog');
                yield;
            }
        
            while (theater.currentStageName === 'inside') {
                Input.debugKeyJustDown('advanceDialog');
                Input.debugKeyDown('up');
                Input.debugKeyDown('right');
                yield;
            }
        
            while (sai.x < Main.width/2) {
                Input.debugKeyDown('up');
                Input.debugKeyDown('right');
                yield;
            }
        
            while (theater.currentStageName === 'hallway') {
                Input.debugKeyDown('up');
                yield;
            }
        });

        DEBUG_PROGRAMMATIC_INPUT = true;
        DEBUG_SKIP_RATE = 100;

        while (!script.done && theater.storyManager.currentNodeName !== endNode) {
            script.update(global.script.world, global.script.delta);
            yield;
        }

        DEBUG_PROGRAMMATIC_INPUT = false;
        DEBUG_SKIP_RATE = 1;
    }
}

