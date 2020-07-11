
namespace StateMachine {
    export type State = {
        callback?: () => any;
        script?: Script.Function;
        transitions?: Transition[];
    }

    export type Transition = (Transitions.Instant | Transitions.Condition) & {
        toState: string;
    }

    namespace Transitions {
        export type Instant = {
            type: 'instant';
        }

        export type Condition = {
            type: 'condition';
            condition: () => any;
        }
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
        this.states[name] = state;
    }

    setState(name: string) {
        if (this.script) this.script.done = true;
        let state = this.getState(name);
        if (!state) return;
        this.currentState = state;

        if (state.callback) state.callback();

        let stateScript = state.script ?? S.noop();

        this.script = new Script(S.chain(
            stateScript,
            S.loopFor(Infinity, S.chain(
                S.call(() => {
                    let transition = this.getValidTransition(this.currentState);
                    if (transition) {
                        this.setState(transition.toState);
                    }
                }),
                S.yield(),
            ))
        ));
    }

    update(delta: number) {
        if (this.script) this.script.update(delta);
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
            error(`No state named ${name} exists on state machine`, this);
        }
        return this.states[name];
    }

    private getValidTransition(state: StateMachine.State) {
        for (let transition of state.transitions || []) {
            if (transition.type === 'instant') {
                return transition;
            } else if (transition.type === 'condition') {
                if (transition.condition()) return transition;
            } else {
                /// @ts-ignore
                error(`Invalid transition type ${transition.type} for transition`, transition);
            }
        }
        return undefined;
    }
}