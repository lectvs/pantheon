
namespace S { export const storyboard: Storyboard = {

    'outside': {
        type: 'cutscene',
        script: function*() {
            let sai = global.getWorldObject<HumanCharacter>('sai');
            let dad = global.getWorldObject<HumanCharacter>('dad');
            let guard1 = global.getWorldObject<HumanCharacter>('guard1');
            let guard2 = global.getWorldObject<HumanCharacter>('guard2');

            finishImmediately(fadeOut(1));
            sai.follow(dad, 12);
            yield fadeSlides(1);
            yield moveToY(dad, 100);
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
            yield moveTo(guard1, 96, 100);
            yield dialog('dad/default', "Thank you. I won't be long.");
            yield dialog('dad/default', "Come on, boy. I don't have all day.");
            yield dialog('sai/default', "...");
            yield moveToY(dad, 96);
            sai.unfollow();
        }
    },

}} const storyboard = S.storyboard;