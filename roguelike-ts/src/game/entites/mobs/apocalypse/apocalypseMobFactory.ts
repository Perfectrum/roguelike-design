import { AbstractMobFactory } from '../abstractMobFactory';
import { Mob } from '../mob';
import { Zombie } from './zombie';
import { MadMonk } from './madMonk';
import { Vulture } from './vulture';

export class ApocalypseMobFactory extends AbstractMobFactory {
    static createMobSign() {
        const mobTypes: string[] = ['Z', 'V', 'M'];
        return mobTypes[Math.floor(Math.random() * mobTypes.length)];
    }

    createAggressiveMob(point: [number, number]): Mob {
        return new Zombie(point);
    }

    createCowardMob(point: [number, number]): Mob {
        return new Vulture(point);
    }

    createPassiveMob(point: [number, number]): Mob {
        return new MadMonk(point);
    }
}
