import { AbstractMobFactory } from '../abstractMobFactory';
import { Mob } from '../mob';
import { KillMachine } from './killMachine';
import { CowardHacker } from './cowardHacker';
import { Drone } from './drone';

/**
 * Класс-фабрика для мобов стиля киберпанк
 */
export class CyberpunkMobFactory extends AbstractMobFactory {
    static createMobSign() {
        const mobTypes: string[] = ['K', 'H', 'D'];
        return mobTypes[Math.floor(Math.random() * mobTypes.length)];
    }

    createAggressiveMob(point: [number, number]): Mob {
        return new KillMachine(point);
    }

    createCowardMob(point: [number, number]): Mob {
        return new CowardHacker(point);
    }

    createPassiveMob(point: [number, number]): Mob {
        return new Drone(point);
    }
}
