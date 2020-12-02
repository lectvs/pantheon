class StoryManager {
    theater: Theater;
    storyboard: Storyboard;

    cutsceneManager: CutsceneManager;
    eventManager: StoryEventManager;
    storyConfig: StoryConfig;

    get currentNodeName() { return this.stateMachine.getCurrentStateName(); }
    get currentNode() { return this.getNodeByName(this.currentNodeName); }

    private stateMachine: StateMachine;

    constructor(theater: Theater, storyboard: Storyboard, storyboardPath: string[], events: StoryEvent.Map, storyConfig: StoryConfig.Config) {
        this.theater = theater;
        this.storyboard = storyboard;

        this.cutsceneManager = new CutsceneManager(theater, storyboard);
        this.eventManager = new StoryEventManager(theater, events);
        this.storyConfig = new StoryConfig(theater, storyConfig);

        this.stateMachine = new StateMachine();
        
        for (let storyNodeName in storyboard) {
            let storyNode = storyboard[storyNodeName];
            
            let state: StateMachine.State = {};

            if (storyNode.type === 'cutscene') {
                let cutsceneName = storyNodeName;
                state.callback = () => {
                    this.cutsceneManager.playCutscene(cutsceneName);
                }
                state.script = S.waitUntil(() => !this.cutsceneManager.isCutscenePlaying);
            } else if (storyNode.type === 'config') {
                let config = storyNode.config;
                state.callback = () => {
                    this.storyConfig.updateConfig(config);
                    this.storyConfig.execute();
                }
            }
            
            state.transitions = storyNode.transitions.map(transition => {
                return <StateMachine.Transition>{
                    toState: transition.toNode,
                    condition: () => {
                        if (transition.condition && !transition.condition()) return false;
                        if (transition.onStage && (this.theater.currentStageName !== transition.onStage || this.theater.stageManager.transitioning)) return false;

                        // All conditions met. Handle interaction.
                        if (transition.onInteract) {
                            if (this.theater.interactionManager.interactRequested !== transition.onInteract) {
                                return false;
                            }
                            this.theater.interactionManager.consumeInteraction();
                        }
                        return true;
                    },
                    delay: transition.delay,
                };
            });

            this.stateMachine.addState(storyNodeName, state);
        }

        let nodeToStartOn = this.fastForward(storyboardPath);
        this.stateMachine.setState(nodeToStartOn);
    }

    update() {
        this.cutsceneManager.update();
        this.stateMachine.update(this.theater.delta);
    }

    onStageLoad() {
        this.cutsceneManager.onStageLoad();
        this.eventManager.onStageLoad();
        this.storyConfig.execute();
    }

    getCurrentInteractableObjects(stageName?: string) {
        return this.getInteractableObjectsForNode(this.currentNode, stageName);
    }

    setNode(node: string) {
        if (!this.getNodeByName(node)) return;
        if (this.storyboard[node].type === 'cutscene' && !this.cutsceneManager.canPlayCutscene(node)) return;
        this.stateMachine.setState(node);
    }

    private fastForward(path: string[]) {
        for (let i = 0; i < path.length-1; i++) {
            let node = this.getNodeByName(path[i]);
            if (!node) continue;
            if (node.type === 'cutscene') {
                this.cutsceneManager.fastForwardCutscene(path[i]);
            } else if (node.type === 'config') {
                this.storyConfig.updateConfig(node.config);
                this.storyConfig.execute();
            }
        }
        this.storyConfig.execute();
        return _.last(path);
    }

    private getInteractableObjectsForNode(node: Storyboard.Node, stageName?: string) {
        let result = new Set<string>();

        if (!node) return result;

        for (let transition of node.transitions) {
            if (!transition.onInteract) continue;
            if (stageName && transition.onStage && stageName !== transition.onStage) continue;
            
            let toNode = this.getNodeByName(transition.toNode);
            if (toNode.type === 'cutscene' && !this.cutsceneManager.canPlayCutscene(transition.toNode)) continue;

            result.add(transition.onInteract);
        }

        return result;
    }

    private getNodeByName(name: string) {
        if (!this.storyboard[name]) {
            error(`No storyboard node exists with name ${name}`);
        }
        return this.storyboard[name];
    }
}