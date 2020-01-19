/// <reference path="./base.ts"/>
/// <reference path="./party.ts"/>

const party: Party.Config = {
    leader: 'sai',
    activeMembers: ['sai', 'dad'],
    members: {
        'sai': {
            config: {
                name: 'sai',
                parent: HUMAN_CHARACTER('generic_sprites'),
                effects: {
                    outline: {
                        color: 0xFF0000,
                        alpha: 1
                    }
                }
            },
        },
        'dad': {
            config: {
                name: 'dad',
                parent: HUMAN_CHARACTER('generic_sprites'),
                effects: {
                    outline: {
                        color: 0x0000FF,
                        alpha: 1
                    }
                }
            },
        },
    }
};