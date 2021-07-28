/// <reference path="../controller/controller.ts" />

interface Behavior {
    controller: Controller;

    update(delta: number): void;
    interrupt(action?: string): void;
}