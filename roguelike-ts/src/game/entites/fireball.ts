import { GameObject } from "../../engine/elements/gameobject";
import { Animatable, Forcable } from "../../engine/utils/traits";
import { Hero } from "./hero";
import { Mob } from "./mob";

export class FireBall extends GameObject {

    private owner : Hero;

    constructor([x, y, dx, dy]:[number, number, number, number], owner:Hero) {
        super(['exit', 'action']);

        this.x = x;
        this.y = y;
        this.content = "*";

        this.w = 1;
        this.h = 1;

        this.force.x = dx;
        this.force.y = dy;

        this.owner = owner;
    }

    @Animatable(["*", "o"])
    @Forcable(true)
    update(_: number): void { }

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
                    return;
                }
            }
        }
    }
}


