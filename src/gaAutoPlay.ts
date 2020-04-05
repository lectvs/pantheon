function autoPlayScript(options: {endNode?: string, stage?: string}) {
    return function*() {
        yield;
        let theater = global.theater;
        let sai = theater.partyManager.getMember('sai').worldObject;

        let script = new Script(function* () {
            // @ts-ignore
            while (theater.currentStageName !== 'inside') {
                Input.debugKeyJustDown('advanceDialog');
                yield;
            }
        
            // @ts-ignore
            while (theater.currentStageName !== 'hallway') {
                Input.debugKeyJustDown('advanceDialog');
                Input.debugKeyDown('up');
                Input.debugKeyDown('right');
                yield;
            }
        
            // @ts-ignore
            while (sai.x < Main.width/2) {
                Input.debugKeyJustDown('advanceDialog');
                Input.debugKeyDown('up');
                Input.debugKeyDown('right');
                yield;
            }
        
            // @ts-ignore
            while (theater.currentStageName !== 'escaperoom') {
                Input.debugKeyJustDown('advanceDialog');
                Input.debugKeyDown('up');
                yield;
            }

            // @ts-ignore
            while (sai.x > 92) {
                Input.debugKeyJustDown('advanceDialog');
                Input.debugKeyDown('up');
                Input.debugKeyDown('left');
                yield;
            }

            // @ts-ignore
            while (theater.storyManager.currentNodeName !== 'i_keypad') {
                Input.debugKeyJustDown('advanceDialog');
                Input.debugKeyDown('up');
                Input.debugKeyJustDown('interact');
                yield;
            }

            // @ts-ignore
            while (theater.currentStageName !== 'none') {
                Input.debugKeyJustDown('advanceDialog');
                yield;
            }

            // @ts-ignore
            while (theater.stageManager.transitioning) {
                yield;
            }
        });

        let optionsMatched = () => {
            if (options.endNode && theater.storyManager.currentNodeName !== options.endNode) return false;
            if (options.stage && (theater.currentStageName !== options.stage || theater.stageManager.transitioning)) return false;
            return true;
        };

        DEBUG_PROGRAMMATIC_INPUT = true;
        DEBUG_SKIP_RATE = 100;

        while (!script.done && !optionsMatched() && DEBUG_SKIP_RATE > 1 && DEBUG_PROGRAMMATIC_INPUT) {
            script.update(global.script.world, global.script.delta);
            yield;
        }

        DEBUG_PROGRAMMATIC_INPUT = false;
        DEBUG_SKIP_RATE = 1;
    }
}

