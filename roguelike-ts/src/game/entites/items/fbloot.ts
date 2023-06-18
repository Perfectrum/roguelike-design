import { Loot } from './loot';

/**
 * Класс лута с фаерболом
 */
export class FireBallLoot extends Loot {
    /**
     * Количество фаерболов
     * @private
     */
    private count: number;

    /**
     * Создает экземпляр лута с фаерболом
     * @param {[number, number]} point - Координаты предмета
     * @param {number} count - Количество огненных шаров (1 по умолчанию)
     */
    constructor(point: [number, number], count = 1) {
        super(point, `Fireball (x${count})`);
        this.count = count;

        this.content = 'e';
        this.contentBraces = ['{#ff00d7-fg}', '{/}'];

        this.effect = (h) => {
            h.giveFireBall(this.count);
        };
    }
}
