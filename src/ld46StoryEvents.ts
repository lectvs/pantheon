
function getStoryEvents(): StoryEvent.Map { return {

    'spawn_monster': {
        stage: 'game',
        script: function*() {
            yield S.wait(Debug.DEBUG ? 3 : 60);
            let player = global.world.getWorldObjectByType(Player);
            global.world.addWorldObject({
                name: 'monster',
                constructor: Monster,
                x: player.x + 200, y: player.y + 200,
                layer: 'main',
            });
        }
    }

}}