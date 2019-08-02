type Storyboard = Dict<Storyboard.Component>;

namespace Storyboard {
    export type Component = Component.Cutscene | Component.Gameplay | Component.Code;

    export namespace Component {
        export type Cutscene = {
            type: 'cutscene';
            script : () => IterableIterator<Script.Function>;
            after?: string;
        }

        export type Gameplay = {
            type: 'gameplay';
            start: () => any;
        }

        export type Code = {
            type: 'code',
            func: () => any;
            after?: string;
        }
    }
}