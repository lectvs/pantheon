function getStoryboard(): Storyboard { return {
    'start': {
        type: 'start',
        transitions: [{ type: 'onStage', stage: 'game', toNode: 'intro' }]
    },
    'intro': {
        type: 'cutscene',
        script: function*() {
            //Script.instant(S.fadeOut());
            //yield S.fadeSlides(1);
        },
        transitions: [{ type: 'instant', toNode: 'gameplay' }]
    },
    'gameplay': {
        type: 'gameplay',
        transitions: []
    },
}}