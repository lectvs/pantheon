function getStoryboard(): Storyboard { return {
    'start': {
        type: 'start',
        transitions: [{ type: 'onStage', stage: 'game', toNode: 'gameplay' }]
    },
    'gameplay': {
        type: 'gameplay',
        transitions: []
    },
}}