function autoPlayScript(options: {endNode?: string, stage?: string}) {
    return function*() {
        yield;
        let theater = global.theater;
        let sai = theater.partyManager.getMember('sai').worldObject;

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
                Input.debugKeyJustDown('advanceDialog');
                Input.debugKeyDown('up');
                Input.debugKeyDown('right');
                yield;
            }
        
            while (theater.storyManager.currentStageForStory === 'hallway') {
                Input.debugKeyJustDown('advanceDialog');
                Input.debugKeyDown('up');
                yield;
            }
        });

        let optionsMatched = () => {
            if (options.endNode && theater.storyManager.currentNodeName !== options.endNode) return false;
            if (options.stage && theater.storyManager.currentStageForStory !== options.stage) return false;
            return true;
        };

        DEBUG_PROGRAMMATIC_INPUT = true;
        DEBUG_SKIP_RATE = 100;

        while (!script.done && !optionsMatched()) {
            script.update(global.script.world, global.script.delta);
            yield;
        }

        DEBUG_PROGRAMMATIC_INPUT = false;
        DEBUG_SKIP_RATE = 1;
    }
}

