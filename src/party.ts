type Party = Dict<Party.Member>;

namespace Party {
    export type Member = {
        config: SomeStageConfig;
        worldObject?: WorldObject;
        active?: boolean;
    }

    export function addMemberToWorld(member: Party.Member, world: World) {
        return world.addWorldObject(member.worldObject, {
            name: member.config.name,
            layer: member.config.layer,
            // @ts-ignore
            physicsGroup: member.config.physicsGroup,
        });
    }

    export function getActiveMembers(party: Party) {
        let result: Party.Member[] = [];
        for (let key in party) {
            if (party[key].active) {
                result.push(party[key]);
            }
        }
        return result;
    }

    export function load(party: Party) {
        for (let key in party) {
            let member = party[key];
            member.worldObject = new member.config.constructor(member.config);
            member.active = false;
        }
    }
}