class StoryManager {
    theater: Theater;
    storyboard: Storyboard;

    cutsceneManager: CutsceneManager;
    eventManager: StoryEventManager;
    storyConfig: StoryConfig;

    private _currentNodeName: string;
    get currentNodeName() { return this._currentNodeName; }
    get currentNode() { return this.getNodeByName(this.currentNodeName); }

    constructor(theater: Theater, storyboard: Storyboard, storyboardPath: string[], events: StoryEvent.Map, storyConfig: StoryConfig.Config) {
        this.theater = theater;
        this.storyboard = storyboard;

        this.cutsceneManager = new CutsceneManager(theater, storyboard);
        this.eventManager = new StoryEventManager(theater, events);
        this.storyConfig = new StoryConfig(theater, storyConfig);

        this.fastForward(storyboardPath);

        if (this.currentNode) {
            this.theater.runScript(this.script());
        }
    }

    script() {
        let sm = this;
        return function*() {
            if (sm.currentNode.type === 'cutscene') {
                sm.cutsceneManager.playCutscene(sm.currentNodeName);
                while (sm.cutsceneManager.isCutscenePlaying) {
                    sm.cutsceneManager.update(global.script.delta);
                    yield;
                }
            } else if (sm.currentNode.type === 'party') {
                sm.updateParty(sm.currentNode);
            } else if (sm.currentNode.type === 'config') {
                sm.storyConfig.updateConfig(sm.currentNode.config);
                sm.storyConfig.execute();
            }

            let transition = sm.getFirstValidTransition(sm.currentNode);
            while (!transition) {
                yield;
                transition = sm.getFirstValidTransition(sm.currentNode);
            }

            sm._currentNodeName = transition.toNode;

            if (sm.currentNode) {
                sm.theater.runScript(sm.script());
            }
        }
    }

    onStageLoad() {
        this.cutsceneManager.onStageLoad();
        this.eventManager.onStageLoad();
        this.storyConfig.execute();
    }

    getInteractableObjects(node: Storyboard.Node, stageName?: string) {
        let result = new Set<string>();

        if (!node) return result;

        for (let transition of node.transitions) {
            if (transition.type !== 'onInteract') continue;
            if (stageName && transition.onStage && stageName === transition.onStage) continue;
            
            let toNode = this.getNodeByName(transition.toNode);
            if (toNode.type === 'cutscene' && !this.cutsceneManager.canPlayCutscene(transition.toNode)) continue;

            result.add(transition.with);
        }

        return result;
    }

    private fastForward(path: string[]) {
        for (let i = 0; i < path.length-1; i++) {
            let node = this.getNodeByName(path[i]);
            if (!node) continue;
            if (node.type === 'cutscene') {
                this.cutsceneManager.fastForwardCutscene(path[i]);
            } else if (node.type === 'party') {
                this.updateParty(node);
            } else if (node.type === 'config') {
                this.storyConfig.updateConfig(node.config);
            }
        }
        this.storyConfig.execute();
        this._currentNodeName = _.last(path);
    }

    private getFirstValidTransition(node: Storyboard.Node) {
        for (let transition of node.transitions) {
            if (transition.type === 'instant') {
                return transition;
            } else if (transition.type === 'onStage') {
                if (this.theater.currentStageName === transition.stage && !this.theater.stageManager.transitioning) return transition;
            } else if (transition.type === 'onInteract') {
                if (this.theater.interactionManager.interactRequested === transition.with) {
                    this.theater.interactionManager.consumeInteraction();
                    return transition;
                }
            }
        }
        return null;
    }

    private getNodeByName(name: string) {
        if (!this.storyboard[name]) {
            debug(`No storyboard node exists with name ${name}`);
        }
        return this.storyboard[name];
    }

    private updateParty(party: Storyboard.Nodes.Party) {
        if (party.setLeader !== undefined) {
            this.theater.partyManager.leader = party.setLeader;
        }

        if (!_.isEmpty(party.setMembersActive)) {
            for (let m of party.setMembersActive) {
                this.theater.partyManager.setMemberActive(m);
            }
        }

        if (!_.isEmpty(party.setMembersInactive)) {
            for (let m of party.setMembersInactive) {
                this.theater.partyManager.setMemberInactive(m);
            }
        }
    }
}