namespace WorldEvent {
    export type EventSource = {
        type: 'world';
    } | {
        type: 'worldobject';
        worldObject: WorldObject;
    }

    export type ListenerWorldObjectSource = WorldObject | string | (new (...params: any[]) => WorldObject);
    export type ListenerSource = {
        type: 'world';
    } | {
        type: 'worldobject';
        worldObject: ListenerWorldObjectSource;
    }

    export type Event = {
        source: EventSource;
        event: string;
        data: any;
    }

    export type WorldEvent = WorldEvent.Event & { source: { type: 'world' } };
    export type WorldObjectEvent = WorldEvent.Event & { source: { type: 'worldobject', worldObject: WorldObject } };

    export type Listener = {
        fromSources?: ListenerSource[];
        events?: string[];
        onEvent: (event: WorldEvent.Event) => void;
        isActive?: () => boolean;
        shouldPrune: () => boolean;
        enabled?: boolean;
    }

    export function matches(event: WorldEvent.Event, listener: Listener) {
        let matchesSources = listener.fromSources
            ? listener.fromSources.some(listenerSource => matchesSource(event.source, listenerSource))
            : true;
        
        if (!matchesSources) return false;
        
        let matchesEvents = listener.events
            ? listener.events.includes(event.event)
            : true;
        
        if (!matchesEvents) return false;

        return true;
    }

    function matchesSource(eventSource: EventSource, listenerSource: ListenerSource) {
        if (listenerSource.type === 'world') {
            return eventSource.type === 'world';
        }

        if (listenerSource.type === 'worldobject') {
            if (eventSource.type !== 'worldobject') return false;
            if (St.isString(listenerSource.worldObject)) {
                return listenerSource.worldObject === eventSource.worldObject.name;
            }
            if (O.isFunction(listenerSource.worldObject)) {
                return eventSource.worldObject instanceof listenerSource.worldObject;
            }
            return listenerSource.worldObject === eventSource.worldObject;
        }

        return false;
    }
}

class WorldEventManager {
    private listeners: WorldEvent.Listener[];

    constructor() {
        this.listeners = [];
    }

    emitEvent(event: WorldEvent.Event) {
        this.listeners.filterInPlace(listener => {
            if (listener.shouldPrune()) {
                return false;
            }
            let listenerActive = !listener.isActive || listener.isActive();
            let listenerEnabled = listener.enabled ?? true;
            if (listenerActive && listenerEnabled && WorldEvent.matches(event, listener)) {
                listener.onEvent(event);
            }
            return true;
        });
    }

    pruneListeners() {
        this.listeners.filterInPlace(listener => {
            return !listener.shouldPrune();
        });
    }

    registerListener(listener: WorldEvent.Listener) {
        this.listeners.push(listener);
        return listener;
    }
}