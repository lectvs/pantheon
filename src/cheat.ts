namespace cheat {
    export function lose() {
        if (!Debug.CHEATS_ENABLED) return;
        /// @ts-ignore
        global.world.getWorldObjectByType(Campfire).fireRadius.timer.time = 100;
    }

    export function win() {
        if (!Debug.CHEATS_ENABLED) return;
        let gasoline = global.world.getWorldObjectsByType(Item).filter(item => item.type === Item.Type.GASOLINE)[0];
        let campfire = global.world.getWorldObjectByType(Campfire);
        gasoline.x = campfire.x;
        gasoline.y = campfire.y;
        gasoline.z = 0;
    }
}