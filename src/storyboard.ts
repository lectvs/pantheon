const storyboard: Storyboard = {
    'start': {
        type: 'start',
        transitions: [{ onStage: 'game', toNode: 'gameplay' }]
    },
    'gameplay': {
        type: 'gameplay',
        transitions: []
    }
}