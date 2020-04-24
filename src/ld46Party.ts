/// <reference path="main.ts" />

const party: Party.Config = {
    leader: 'sai',
    activeMembers: ['sai', 'dad'],
    members: {
        'player': {
            config: <Sprite.Config>{
                name: 'player',
                constructor: Sprite,
                x: Main.width/2 - 8, y: Main.height/2 - 8,
                texture: 'debug',
            },
            stage: 'none',
        },
    }
};