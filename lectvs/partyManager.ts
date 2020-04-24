namespace Party {
    export type Config = {
        leader: string;
        activeMembers: string[];
        members: Dict<Party.Member>;
    }

    export type Member = {
        config: WorldObject.Config;
        stage: string;
        worldObject?: WorldObject;
    }
}

class PartyManager {
    private theater: Theater;
    private activeMembers: Set<string>;
    private members: Dict<Party.Member>;
    private _leader: string;

    constructor(theater: Theater, config: Party.Config) {
        this.theater = theater;
        this.leader = config.leader;
        this.activeMembers = new Set<string>(config.activeMembers);
        this.members = config.members;
        this.load();
    }

    addMembersToWorld(world: World, stageName: string, entryPoint: Pt) {
        for (let memberName in this.members) {
            let member = this.members[memberName];
            if (this.isMemberActive(memberName)) {
                member.stage = stageName;
                member.worldObject.x = entryPoint.x;
                member.worldObject.y = entryPoint.y;
            }
            if (member.stage === stageName) {
                if (member.worldObject.world) {
                    World.Actions.removeWorldObjectFromWorld(member.worldObject);
                }
                World.Actions.addWorldObjectToWorld(member.worldObject, world);
            }
        }
    }

    getMember(name: string) {
        let member = this.members[name];
        if (!member) {
            debug(`No party member named '${name}':`, this);
        }
        return member;
    }

    isMemberActive(name: string) {
        return this.activeMembers.has(name);
    }

    get leader() {
        return this._leader;
    }

    set leader(name: string) {
        this._leader = name;
        for (let key in this.members) {
            if (this.members[key].worldObject) {
                this.members[key].worldObject.controllable = (key === this.leader);
            }
        }
    }

    load() {
        for (let key in this.members) {
            let member = this.members[key];
            member.config = WorldObject.resolveConfig(member.config);
            member.worldObject = WorldObject.fromConfig(member.config);
            if (key === this.leader) {
                member.worldObject.controllable = true;
            }
        }
    }

    moveMemberToStage(memberName: string, stageName: string, x: number, y: number) {
        let member = this.getMember(memberName);
        if (!member) return;

        if (!stageName) {
            member.stage = null;
            return;
        }

        let stage = this.theater.worldManager.worlds[stageName];
        if (!stage) {
            debug(`Cannot move party member ${memberName} to stage ${stageName} because the stage does not exist`);
            return;
        }

        member.stage = stageName;
        member.worldObject.x = x;
        member.worldObject.y = y;
    }

    setMemberActive(name: string) {
        if (!this.getMember(name)) return;
        this.activeMembers.add(name);
    }

    setMemberInactive(name: string) {
        if (!this.getMember(name)) return;
        this.activeMembers.delete(name);
    }
}