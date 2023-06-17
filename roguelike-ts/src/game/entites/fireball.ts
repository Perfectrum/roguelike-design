import { GameObject } from '../../engine/elements/gameobject';
import { Animatable, Forcable } from '../../engine/utils/traits';
import { Hero } from './hero';
import { Mob } from './mobs/mob';

/**
 * Класс, представляющий фаербол
 */
export class FireBall extends GameObject {
    /**
     * Указатель на игрока - обладателя фаербола
     * @private
     */
    private owner: Hero;

    /**
     * Создает экземпляр фаербола
     * @param {[number, number, number, number]} coordinates - Координаты [x, y, dx, dy]
     * @param {Hero} owner - Владелец фаербола
     */
    constructor([x, y, dx, dy]: [number, number, number, number], owner: Hero) {
        super(['exit', 'action']);

        this.x = x;
        this.y = y;
        this.content = '*';
        this.contentBraces = ['{#ff5f00-fg}', '{/}'];

        this.w = 1;
        this.h = 1;

        this.force.x = dx;
        this.force.y = dy;

        this.owner = owner;
    }

    
    @Animatable(['*', 'o'])
    @Forcable(true)
    update(_: number): void {}

    post(): void {
        for (const objs of this.collide) {
            if (objs.containsTag('wall')) {
                this.remove();
                return;
            }
            if (objs.containsTag('mob')) {
                if (objs instanceof Mob) {
                    this.owner.giveXp(objs.takeDamage(3));
                    this.remove();
                    if (objs.killed) {
                        this.owner.statistics.mobs += 1;
                        this.owner.statistics.score += objs.killScore();
                    }
                    return;
                }
            }
        }
    }
}
