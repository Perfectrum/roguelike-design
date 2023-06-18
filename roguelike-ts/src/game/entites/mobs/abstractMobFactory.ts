import { Mob } from './mob';

/**
 * Абстрактная фабрика мобов, наследники которой соответствуют стилям
 * @abstract
 */
export abstract class AbstractMobFactory {
    /**
     * Создает маркер моба случайного типа (аггрессиваного, пассивного или трусливого)
     * @returns {string} - Маркер моба
     * @static
     */
    static createMobSign() {
        const mobTypes: string[] = ['A', 'C', 'P'];
        return mobTypes[Math.floor(Math.random() * mobTypes.length)];
    }

    /**
     * Абстрактный метод создания аггрессивного моба
     * @param {[number, number]} point - Координаты моба
     */
    abstract createAggressiveMob(point: [number, number]): Mob;
    
    /**
     * Абстрактный метод создания пассивного моба
     * @param {[number, number]} point - Координаты моба
     */
    abstract createPassiveMob(point: [number, number]): Mob;
    
    /**
     * Абстрактный метод создания трусливого моба
     * @param {[number, number]} point - Координаты моба
     */
    abstract createCowardMob(point: [number, number]): Mob;
}
