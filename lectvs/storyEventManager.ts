type StoryEvent = {
    stage: string;
    script: StoryEvent.Generator;
    neverComplete?: boolean;
}

namespace StoryEvent {
    export type Map = Dict<StoryEvent>;
    export type Generator = () => IterableIterator<Script.Function | (() => IterableIterator<Script.Function>)[]>;
}

class StoryEventManager {
    theater: Theater;
    storyEvents: StoryEvent.Map;
    completedEvents: Set<string>;

    constructor(theater: Theater, storyEvents: StoryEvent.Map) {
        this.theater = theater;
        this.storyEvents = storyEvents;
        this.completedEvents = new Set<string>();
    }

    toScript(generator: StoryEvent.Generator): Script.Function {
        let sem = this;
        return function*() {
            let iterator = generator();

            while (true) {
                let result = iterator.next();
                if (result.value) {
                    if (_.isArray(result.value)) {
                        result.value = S.simul(...result.value.map(scr => sem.toScript(scr)));
                    }
                    let script = new Script(result.value);
                    while (!script.done) {
                        script.update(global.script.delta);
                        if (script.done) break;
                        yield;
                    }
                } else if (!result.done) {  // Normal yield statement.
                    yield;
                }
                if (result.done) break;
            }
        }
    }

    canStartEvent(name: string) {
        let event = this.getEventByName(name);
        if (!event) return false;
        if (this.theater.currentStageName !== event.stage) return false;
        if (!event.neverComplete && this.completedEvents.has(name)) return false;
        return true;
    }

    completeEvent(name: string) {
        let event = this.getEventByName(name);
        if (!event) return;

        this.completedEvents.add(name);
    }

    onStageLoad() {
        for (let eventName in this.storyEvents) {
            if (this.canStartEvent(eventName)) {
                this.startEvent(eventName);
            }
        }
    }

    reset() {
        
    }

    startEvent(name: string) {
        let event = this.getEventByName(name);
        if (!event) return;

        let sem = this;
        this.theater.currentWorld.runScript(S.chain(
            this.toScript(event.script),
            function*() {
                sem.completeEvent(name);
            }
        ));
    }

    private getEventByName(name: string) {
        let event = this.storyEvents[name];
        if (!event) {
            debug(`Cannot get event ${name} because it does not exist:`, this.storyEvents);
            return undefined;
        }
        return event;
    }
}