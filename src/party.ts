namespace Party {
    export type Config = {
        leader: string;
        activeMembers: string[];
        members: Dict<Party.Member>;
    }

    export type Member = {
        config: SomeWorldObjectConfig;
        stage: string;
        worldObject?: WorldObject;
    }
}

class Party {
    activeMembers: string[];
    members: Dict<Party.Member>;

    private _leader: string;

    constructor(config: Party.Config) {
        this.leader = config.leader;
        this.activeMembers = config.activeMembers;
        this.members = config.members;
        this.load();
    }

    addMemberToWorld(name: string, world: World) {
        let member = this.members[name];
        if (!member) {
            debug(`Could not find party member named ${name}. Party:`, this);
            return;
        }
        
        if (member.worldObject.world) {
            World.Actions.removeWorldObjectFromWorld(member.worldObject);
        }

        return World.Actions.addWorldObjectToWorld(member.worldObject, world);
    }

    getMember(name: string) {
        let member = this.members[name];
        if (!member) {
            debug(`No party member named '${name}':`, this);
        }
        return member;
    }

    isMemberActive(name: string) {
        return _.contains(this.activeMembers, name);
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

    setMemberActive(name: string) {
        if (this.isMemberActive(name)) return;
        this.activeMembers.push(name);
    }

    setMemberInactive(name: string) {
        A.removeAll(this.activeMembers, name);
    }
}