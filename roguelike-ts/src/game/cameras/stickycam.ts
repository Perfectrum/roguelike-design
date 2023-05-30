import { Widgets } from 'blessed';
import { Camera } from '../../engine/elements/camera';
import { GameObject } from '../../engine/elements/gameobject';

export class ObjectLinkedCamera extends Camera {
    private hero: GameObject;

    constructor(hero: GameObject, tags?: string[], ops?: Widgets.TextOptions) {
        super(tags, ops);

        this.hero = hero;
    }

    update(dt: number): void {
        super.update(dt);

        const hx = this.hero.getX();
        const hy = this.hero.getY();

        const w2 = Math.floor(this.w / 2);
        const h2 = Math.floor(this.h / 2);

        this.x = hx - w2;
        this.y = hy - h2;
    }
}
