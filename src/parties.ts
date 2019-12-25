/// <reference path="./party.ts"/>

const party: Party.Config = {
    leader: 'sai',
    activeMembers: ['sai', 'dad'],
    members: {
        'sai': {
            config: {
                name: 'sai',
                parent: HUMAN_CHARACTER('generic_sprites'),
            },
        },
        'dad': {
            config: {
                name: 'dad',
                parent: HUMAN_CHARACTER('generic_sprites'),
            },
        },
    }
};