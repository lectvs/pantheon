class ImmunitySm extends StateMachine {
    constructor(immuneTime: number) {
        super();
        this.addState('vulnerable', {});
        this.addState('immune', {
            script: S.wait(immuneTime),
            transitions: [
                { type: 'instant', toState: 'vulnerable' },
            ]
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