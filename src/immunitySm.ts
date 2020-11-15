class ImmunitySm extends StateMachine {
    constructor(immuneTime: number) {
        super();
        this.addState('vulnerable', {});
        this.addState('immune', {
            transitions: [{ delay: immuneTime, toState: 'vulnerable' }]
        });
        this.setState('vulnerable');
    }

    isImmune() {
        return this.getCurrentStateName() === 'immune';
    }

    setImmune() {
        this.setState('immune');
    }
}