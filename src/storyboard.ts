type Storyboard = Dict<Storyboard.Node>;

namespace Storyboard {

    export type Node = (Nodes.Cutscene | Nodes.Config | Nodes.Start | Nodes.Gameplay) & {
        transitions: Node.Transition[];
    }

    export namespace Nodes {
        export type Cutscene = {
            type: 'cutscene';
            script: Cutscene.Generator;
        }

        export type Gameplay = {
            type: 'gameplay';
        }

        export type Config = {
            type: 'config';
            config: any;
        }

        export type Start = {
            type: 'start';
        }
    }

    export namespace Node {
        export type Transition = (Node.Transitions.Instant | Node.Transitions.OnStage) & {
            toNode: string;
        }
    }

    export namespace Node.Transitions {
        export type Instant = {
            type: 'instant';
        }

        export type OnStage = {
            type: 'onStage';
            stage: string;
        }
    }

    export function arbitraryPathToNode(storyboard: Storyboard, endNode: string) {
        if (!storyboard[endNode]) {
            debug(`Cannot make path to end node ${endNode} since it doesn't exist in storyboard`, storyboard);
            return [];
        }

        let result = [endNode];

        let currentNode = endNode;
        while (storyboard[currentNode].type !== 'start') {
            let foundNode = undefined;
            for (let node in storyboard) {
                let transition = storyboard[node].transitions.find(t => t.toNode === currentNode);
                if (transition) {
                    foundNode = node;
                    break;
                }
            }

            if (foundNode) {
                result.unshift(foundNode);
                currentNode = foundNode;
            } else {
                debug(`Could not find a path to ${endNode} in storyboard`, storyboard);
                return [];
            }
        }

        return result;
    }
}