
namespace StateMachine {
    export type State = {
        callback?: (context: any) => any;
        script?: (context: any) => Script.Function;
        transitions: Transition[];
    }

    export type Transition = (Transitions.Instant) & {
        toState: string;
    }

    namespace Transitions {
        export type Instant = {
            type: 'instant';
        }
    }
}

class StateMachine {
    private context: any;
    private states: Dict<StateMachine.State>;
    private currentState: StateMachine.State;
    
    private script: Script;

    constructor(context: any, states: Dict<StateMachine.State>) {
        this.context = context;
        this.states = O.deepClone(states);
    }

    setState(name: string) {
        if (this.script) this.script.done = true;
        let state = this.getState(name);
        if (!state) return;
        this.currentState = state;

        if (state.callback) state.callback(this.context);

        let stateScript = O.getOrDefault(state.script, (context) => S.noop())(this.context);

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

    update(world: World, worldObject: WorldObject, delta: number) {
        if (this.script && world) {
            this.script.update(world, worldObject, delta);
        }
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
            debug(`No state named ${name} exists on state machine`, this);
        }
        return this.states[name];
    }

    private getValidTransition(state: StateMachine.State) {
        for (let transition of state.transitions) {
            if (transition.type === 'instant') return transition;
            else debug(`Invalid transition type ${transition.type} for transition`, transition);
        }
        return undefined;
    }
}