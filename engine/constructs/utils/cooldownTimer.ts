class CooldownTimer extends Timer {
    private currentUses: number;
    private maxUses: number;

    constructor(cooldown: number, uses: number) {
        super(cooldown, () => this.currentUses = M.clamp(this.currentUses+1, 0, this.maxUses), Infinity);
        this.currentUses = uses;
        this.maxUses = uses;
    }

    override update(delta: number) {
        if (this.currentUses < this.maxUses) {
            super.update(delta);
        }
    }

    consumeUse() {
        if (this.currentUses <= 0) return false;
        this.currentUses--;
        return true;
    }
}