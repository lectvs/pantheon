class Interactable extends PhysicsWorldObject {
    onInteract: () => any;
    pressTexture = 'pressx';

    constructor(config: PhysicsWorldObject.Config) {
        super(config);
    }
    
    interact() {
        if (this.onInteract) this.onInteract();
    }
}