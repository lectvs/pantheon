namespace StateMachine {
    export type State<SD extends StateData, S extends StateData['state']> = {
        callback?: (previousState?: StateData['state'], currentStateData?: SD & { state: S }) => any;
        script?: (currentStateData?: SD & { state: S }) => Script.Function;
        update?: (currentStateData?: SD & { state: S }) => any;
        transitions?: Transition<SD, S>[];
    }

    export type Transition<SD extends StateData, S extends StateData['state']> = {
        toState: SD | ((currentStateData: SD & { state: S }) => SD);
        condition?: (currentStateData?: SD & { state: S }) => any;
        afterConditionDelay?: number;
    }

    export type StateData = {
        state: string;
    } & Dict<any>;
}

class StateMachine<StateData extends StateMachine.StateData> {
    private states: Dict<StateMachine.State<StateData, StateData['state']>>;
    private currentStateData: StateData | undefined;
    
    private script: Script | undefined;

    constructor() {
        this.states = {};
    }

    addState<S extends StateData['state']>(name: S, state: StateMachine.State<StateData, S> = {}) {
        if (name in this.states) {
            console.error(`State ${name} already exists on state machine`, this);
            return;
        }
        this.states[name] = state;
    }

    setState<SD extends StateData>(stateData: SD) {
        if (this.script) this.script.isDone = true;
        let state = this.getState(stateData.state);
        if (!state) return;
        let previousState = this.currentStateData?.state;
        let currentStateData = O.clone(stateData);
        this.currentStateData = currentStateData;

        if (state.callback) state.callback(previousState, currentStateData);

        let stateScript = state.script ? state.script(currentStateData) : S.noop();

        let sm = this;
        this.script = new Script(function*() {
            yield stateScript;
            yield; // Yield one more time so we don't immediately transition to next state.

            let selectedTransition: StateMachine.Transition<SD, SD['state']> | undefined = undefined;
            do {
                selectedTransition = sm.currentStateData
                    ? sm.getValidTransition(sm.states[sm.currentStateData.state] as StateMachine.State<SD, SD['state']>, currentStateData)
                    : undefined;
                if (!selectedTransition) yield;
            } while (!selectedTransition);

            yield S.wait(selectedTransition.afterConditionDelay ?? 0);
            let toState = O.isFunction(selectedTransition.toState)
                ? selectedTransition.toState(currentStateData)
                : selectedTransition.toState;
            sm.setState(toState);
        });

        this.script.update(0);
    }

    update(delta: number) {
        if (this.script) this.script.update(delta);

        let updateCallback = !this.currentStateData || !this.currentStateData.state || !this.states[this.currentStateData.state]
            ? undefined
            : this.states[this.currentStateData.state].update;
        if (updateCallback) updateCallback();
    }

    getCurrentStateData(): StateData | undefined {
        return this.currentStateData;
    }

    getCurrentStateName(): StateData['state'] | undefined {
        return this.currentStateData?.state;
    }

    private getState(name: string) {
        if (!this.states[name]) {
            console.error(`No state named ${name} exists on state machine`, this);
        }
        return this.states[name];
    }

    private getValidTransition<SD extends StateData>(state: StateMachine.State<SD, SD['state']>, currentStateData: SD) {
        if (!state.transitions) return undefined;
        for (let transition of state.transitions) {
            if (transition.condition && !transition.condition(currentStateData)) continue;
            return transition;
        }
        return undefined;
    }
}