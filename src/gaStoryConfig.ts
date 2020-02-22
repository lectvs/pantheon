/// <reference path="./main.ts"/>

var storyConfig: StoryConfig.Config = {
    initialConfig: {
        separated: false,
        cameraMode: Camera.Mode.FOCUS(Main.width/2, Main.height/2),
    },
    executeFn: sc => {
        
        // separated
        let sai = <HumanCharacter>sc.theater.party.members['sai'].worldObject;
        let dad = <HumanCharacter>sc.theater.party.members['dad'].worldObject;

        sai.unfollow();
        dad.unfollow();

        if (!sc.config.separated) {
            if (sc.config.partyLeader === 'sai') {
                dad.follow('sai');
            } else {
                sai.follow('dad');
            }
        }

        // cameraMode
        if (sc.theater.currentWorld) {
            sc.theater.currentWorld.camera.setMode(sc.config.cameraMode);
        }
    }
}