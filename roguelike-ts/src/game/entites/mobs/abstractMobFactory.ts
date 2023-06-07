import { Mob } from './mob';

export abstract class AbstractMobFactory {
    static createMobSign() {
        const mobTypes: string[] = ['A', 'C', 'P'];
        return mobTypes[Math.floor(Math.random() * mobTypes.length)];
    }

    abstract createAggressiveMob(point: [number, number]): Mob;
    abstract createPassiveMob(point: [number, number]): Mob;
    abstract createCowardMob(point: [number, number]): Mob;
}
