namespace StateMachine {
    export type State = {
        callback?: () => any;
        script?: Script.Function;
        update?: () => any;
        transitions?: Transition[];
    }

    export type Transition = {
        toState: string;
        condition?: () => any;
        delay?: number;
    }
}

class StateMachine {
    private states: Dict<StateMachine.State>;
    private currentState: StateMachine.State;
    
    private script: Script;

    constructor() {
        this.states = {};
    }

    addState(name: string, state: StateMachine.State) {
        if (name in this.states) {
            console.error(`State ${name} already exists on state machine`, this);
            return;
        }
        this.states[name] = state;
    }

    setState(name: string) {
        if (this.script) this.script.done = true;
        let state = this.getState(name);
        if (!state) return;
        this.currentState = state;

        if (state.callback) state.callback();

        let stateScript = state.script ?? S.noop();

        let sm = this;
        this.script = new Script(function*() {
            yield stateScript;
            yield; // Yield one more time so we don't immediately transition to next state.

            let selectedTransition: StateMachine.Transition = undefined;
            do {
                selectedTransition = sm.getValidTransition(sm.currentState);
                if (!selectedTransition) yield;
            } while (!selectedTransition);

            yield S.wait(selectedTransition.delay ?? 0);
            sm.setState(selectedTransition.toState);
        });

        this.script.update(0);
    }

    update(delta: number) {
        if (this.script) this.script.update(delta);
        if (this.currentState?.update) this.currentState.update();
    }

    getCurrentStateName() {
        for (let name in this.states) {
            if (this.states[name] === this.currentState) {
                return name;
            }
        }
        return undefined;
    }

    private getState(name: string) {
        if (!this.states[name]) {
            console.error(`No state named ${name} exists on state machine`, this);
        }
        return this.states[name];
    }

    private getValidTransition(state: StateMachine.State) {
        for (let transition of state.transitions || []) {
            if (transition.condition && !transition.condition()) continue;
            return transition;
        }
        return undefined;
    }
}