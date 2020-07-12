type Storyboard = Dict<Storyboard.Node>;

namespace Storyboard {

    export type Node = (Nodes.Cutscene | Nodes.Party | Nodes.Config | Nodes.Start | Nodes.Gameplay) & {
        transitions: Node.Transition[];
    }

    export namespace Nodes {
        export type Cutscene = {
            type: 'cutscene';
            script: Cutscene.Generator;
            playOnlyOnce?: boolean;
        }

        export type Gameplay = {
            type: 'gameplay';
        }

        export type Party = {
            type: 'party';
            setLeader?: string;
            setMembersActive?: string[];
            setMembersInactive?: string[];
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
        export type Transition = (
                  Node.Transitions.Instant
                | Node.Transitions.OnStage
                | Node.Transitions.OnInteract
                | Node.Transitions.OnCondition
            ) & {
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

        export type OnInteract = {
            type: 'onInteract';
            with: string;
            onStage?: string;
        }

        export type OnCondition = {
            type: 'onCondition';
            condition: () => any;
        }
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