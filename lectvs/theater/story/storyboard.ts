type Storyboard = Dict<Storyboard.Node>;

namespace Storyboard {

    export type Node = (Nodes.Cutscene | Nodes.Gameplay | Nodes.Transition | Nodes.Start) & {
        transitions: Transition[];
    }

    export namespace Nodes {
        export type Cutscene = {
            type: 'cutscene';
            script: Script.Function;
            playOnlyOnce?: boolean;
            skippable?: boolean;
        }

        export type Gameplay = {
            type: 'gameplay';
        }

        export type Transition = {
            type: 'transition';
            delay: number;
        }

        export type Start = {
            type: 'start';
        }
    }

    export type Transition = {
        toNode: string;
        condition?: () => any;
        delay?: number;
        onStage?: string;
    }

    export function arbitraryPathToNode(storyboard: Storyboard, endNode: string) {
        if (!storyboard[endNode]) {
            error(`Cannot make path to end node ${endNode} since it doesn't exist in storyboard`, storyboard);
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
                error(`Could not find a path to ${endNode} in storyboard`, storyboard);
                return [];
            }
        }

        return result;
    }
}