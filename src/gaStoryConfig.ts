var storyConfig: StoryConfig.Config = {
    initialConfig: {
        partyLeader: 'dad',
        separated: false,
    },
    executeFn: sc => {
        if (!_.contains(sc.theater.party.activeMembers, sc.config.partyLeader)) {
            debug(`Invalid party leader ${sc.config.partyLeader}`);
            return;
        }

        sc.theater.party.leader = sc.config.partyLeader;
        
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
    }
}