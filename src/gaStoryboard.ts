
namespace S { export const storyboard: Storyboard = {
    'start': {
        type: 'start',
        transitions: [
            { toNode: 'outside_party', type: 'instant' }
        ]
    },
    'outside_party': {
        type: 'party',
        setLeader: 'dad',
        transitions: [
            { toNode: 'outside', type: 'onStage', stage: 'outside'}
        ]
    },
    'outside': {
        type: 'cutscene',
        script: function*() {
            let sai = global.getWorldObject<HumanCharacter>('sai');
            let dad = global.getWorldObject<HumanCharacter>('dad');
            let guard1 = global.getWorldObject<HumanCharacter>('guard1');
            let guard2 = global.getWorldObject<HumanCharacter>('guard2');

            yield fadeOut(0);
            yield fadeSlides(1);
            yield moveToY(dad, 120);
            yield dialog('guard1/default', "Well, well. What do we have here?");
            yield dialog('guard2/default', "We're not expecting the mail til this evening.");
            yield dialog('dad/default', "Ha ha. I've got a prisoner.");
            yield dialog('guard2/default', "A prisoner?");
            yield moveToY(guard1, sai.y);
            yield moveToX(guard1, guard1.x + 4);
            yield moveToY(guard2, sai.y);
            yield moveToX(guard2, guard2.x - 4);
            yield dialog('sai/default', "...");
            yield dialog('guard2/default', "He's a kid. You're bringing a kid in as a prisoner?");
            yield dialog('guard1/default', "Jesus... what did you do to him?");
            yield dialog('dad/default', "I don't need you to lecture me. I need to take him to the closest cell as soon as possible.");
            yield dialog('dad/default', "He's a feisty one. Don't underestimate him.");
            yield dialog('guard1/default', "Well, you didn't have to-");
            yield dialog('dad/default', "Hey, I'm not getting paid by the hour. Are you going to let me in or not?");
            yield dialog('guard1/default', "...");
            yield dialog('guard2/default', "...");
            yield dialog('guard2/default', "Fine, fine. You don't have to get mad.");
            yield moveTo(guard2, 144, 100);
            guard2.setDirection(Direction2D.DOWN);
            yield moveTo(guard1, 96, 100);
            guard1.setDirection(Direction2D.DOWN);
            yield dialog('dad/default', "Thank you. I won't be long.");
            yield dialog('dad/default', "Come on, boy. I don't have all day.");
            
            yield dialog('sai/default', "...");
            yield moveToY(dad, 96);
        },
        transitions: [
            { toNode: 'inside_load', type: 'onStage', stage: 'inside' }
        ]
    },
    'inside_load': {
        type: 'config',
        config: {
            cameraMode: Camera.Mode.FOCUS(120, 270),
        },
        transitions: [
            { toNode: 'inside_talk', type: 'instant' }
        ]
    },
    'inside_talk': {
        type: 'cutscene',
        script: function*() {
            let sai = global.getWorldObject<HumanCharacter>('sai');
            let dad = global.getWorldObject<HumanCharacter>('dad');

            yield moveToY(dad, dad.y - 64);
            yield dialog('dad/default', "Let's see, the storage room is probably nearby. It should be right down...");
            yield dialog('sai/default', "Are we there yet, dad? Do we have to keep walking?");
            yield dialog('dad/default', "...");
            yield dialog('dad/default', "Hey, what did I tell you about talking?");
            yield dialog('sai/default', "Sorry... my legs hurt...");
            yield dialog('dad/default', "(Sigh) ...");
            sai.unfollow();
            yield moveToY(dad, dad.y + 4);
            yield dialog('dad/default', "Sai...");
            yield dialog('dad/default', "Do you remember what you learned about dealing with pain?");
            yield dialog('sai/default', "Take deep breaths...");
            yield dialog('dad/default', "That's right. Can you do that for me?");
            yield dialog('sai/default', "...");
            yield dialog('sai/default', "They still hurt...");
            yield dialog('dad/default', "Well, there's nothing we can really do about it right now. You'll just have to hold on, okay?");
            yield dialog('dad/default', "You're a powerful weapon, Sai. You know what they'll do if they find you out.");
            yield dialog('dad/default', "Come on. We need to keep moving. I think the storage room is down the hall.");
            yield dialog('sai/default', "...");
            yield moveToY(dad, 120);
            World.Actions.removeWorldObjectFromWorld(dad);
        },
        transitions: [
            { toNode: 'inside_pre_gameplay_party', type: 'instant' }
        ]
    },
    'inside_pre_gameplay_party': {
        type: 'party',
        setLeader: 'sai',
        setMembersInactive: ['dad'],
        transitions: [
            { toNode: 'inside_pre_gameplay', type: 'instant' }
        ]
    },
    'inside_pre_gameplay': {
        type: 'config',
        config: {
            separated: true,
            cameraMode: Camera.Mode.FOLLOW('sai', 0, -18),
        },
        transitions: [
            { toNode: 'inside_gameplay', type: 'instant' }
        ]
    },
    'inside_gameplay': {
        type: 'gameplay',
        transitions: [
            { type: 'onStage', stage: 'hallway', toNode: 'hallway_talk' },
        ]
    },
    'hallway_talk': {
        type: 'cutscene',
        script: function*() {
            let dad = <HumanCharacter>global.script.theater.party.getMember('dad').worldObject;
            dad.x = 120; dad.y = 420;
            dad.setDirection(Direction2D.UP);
            World.Actions.addWorldObjectToWorld(dad, global.script.theater.currentWorld);
        },
        transitions: [
            { toNode: 'hallway_gameplay', type: 'instant' }
        ]
    },
    'hallway_gameplay': {
        type: 'gameplay',
        transitions: [
            { type: 'onInteract', with: 'demon1', toNode: 'i_demon1' },
            { type: 'onInteract', with: 'demon2', toNode: 'i_demon2' },
            { type: 'onInteract', with: 'demon3', toNode: 'i_demon3' },
            { type: 'onInteract', with: 'demon4', toNode: 'i_demon4' },
            { type: 'onInteract', with: 'demon5', toNode: 'i_demon5' },
            { type: 'onInteract', with: 'demon6', toNode: 'i_demon6' },
            { type: 'onInteract', with: 'demon7', toNode: 'i_demon7' },
            { type: 'onInteract', with: 'demon8', toNode: 'i_demon8' },
        ]
    },
    'i_demon1': {
        type: 'cutscene',
        script: function*() {
            yield dialog('demon/default', "Aw, you're all bruised up...");
            yield dialog('demon/default', "That's dedication to your act.");
        },
        transitions: [
            { type: 'instant', toNode: 'inside_gameplay' }
        ]
    },
    'i_demon2': {
        type: 'cutscene',
        script: function*() {
            yield dialog('demon/default', "It... is an act, right?");
        },
        transitions: [
            { type: 'instant', toNode: 'inside_gameplay' }
        ]
    },
    'i_demon3': {
        type: 'cutscene',
        script: function*() {
            yield dialog('demon/default', "Aw, you're all bruised up...");
            yield dialog('demon/default', "That's dedication to your act.");
        },
        transitions: [
            { type: 'instant', toNode: 'inside_gameplay' }
        ]
    },
    'i_demon4': {
        type: 'cutscene',
        script: function*() {
            yield dialog('demon/default', "It... is an act, right?");
        },
        transitions: [
            { type: 'instant', toNode: 'inside_gameplay' }
        ]
    },
    'i_demon5': {
        type: 'cutscene',
        script: function*() {
            yield dialog('demon/default', "Aw, you're all bruised up...");
            yield dialog('demon/default', "That's dedication to your act.");
        },
        transitions: [
            { type: 'instant', toNode: 'inside_gameplay' }
        ]
    },
    'i_demon6': {
        type: 'cutscene',
        script: function*() {
            yield dialog('demon/default', "It... is an act, right?");
        },
        transitions: [
            { type: 'instant', toNode: 'inside_gameplay' }
        ]
    },
    'i_demon7': {
        type: 'cutscene',
        script: function*() {
            yield dialog('demon/default', "Aw, you're all bruised up...");
            yield dialog('demon/default', "That's dedication to your act.");
        },
        transitions: [
            { type: 'instant', toNode: 'inside_gameplay' }
        ]
    },
    'i_demon8': {
        type: 'cutscene',
        script: function*() {
            yield dialog('demon/default', "It... is an act, right?");
        },
        transitions: [
            { type: 'instant', toNode: 'inside_gameplay' }
        ]
    },
}} const storyboard = S.storyboard;