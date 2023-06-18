import { AbstractMobFactory } from '../abstractMobFactory';
import { Mob } from '../mob';
import { Harpy } from './harpy';
import { Ork } from './ork';
import { Ent } from './ent';


/**
 * Класс-фабрика для мобов стиля фентези
 */
export class FantasyMobFactory extends AbstractMobFactory {
    static createMobSign() {
        const mobTypes: string[] = ['O', 'G', 'E'];
        return mobTypes[Math.floor(Math.random() * mobTypes.length)];
    }

    createAggressiveMob(point: [number, number]): Mob {
        return new Ork(point);
    }

    createCowardMob(point: [number, number]): Mob {
        return new Harpy(point);
    }

    createPassiveMob(point: [number, number]): Mob {
        return new Ent(point);
    }
}
