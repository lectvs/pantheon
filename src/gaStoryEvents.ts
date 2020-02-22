
namespace S { export const storyEvents: StoryEvent.Map = {

    'inside_girldemon': {
        stage: 'inside',
        script: function*() {
            let girldemon = WorldObject.fromConfig<HumanCharacter>({
                name: 'girldemon',
                parent: HUMAN_CHARACTER('generic_sprites_dark'),
                x: 120, y: 108,
            });
            girldemon.setSpeed(100);
            World.Actions.addWorldObjectToWorld(girldemon, global.script.theater.currentWorld);

            let sai = global.getWorldObject<HumanCharacter>('sai');
            while (sai.y > 160) yield;

            global.script.world.runScript(moveToX(girldemon, 180));
            yield waitUntil(() => girldemon.x > 150);
            yield doOverTime(0.3, t => girldemon.alpha = 1-t);
        }
    },
    'hallway_dad': {
        stage: 'hallway',
        script: function*() {
            
        }
    }

}} const storyEvents = S.storyEvents;