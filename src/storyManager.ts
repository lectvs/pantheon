class StoryManager {
    theater: Theater;
    storyboard: Storyboard;

    cutsceneManager: CutsceneManager;
    storyConfig: StoryConfig;

    private _currentNodeName: string;
    get currentNodeName() { return this._currentNodeName; }
    get currentNode() { return this.getNodeByName(this.currentNodeName); }

    constructor(theater: Theater, storyboard: Storyboard, storyboardPath: string[], storyConfig: any) {
        this.theater = theater;
        this.storyboard = storyboard;

        this.cutsceneManager = new CutsceneManager(theater, storyboard);
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

    private fastForward(path: string[]) {
        for (let i = 0; i < path.length-1; i++) {
            let node = this.getNodeByName(path[i]);
            if (!node) continue;
            if (node.type === 'cutscene') {
                this.cutsceneManager.fastForwardCutscene(path[i]);
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
                if (this.theater.currentStageName === transition.stage) return transition
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
}