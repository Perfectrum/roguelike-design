import { GameObject } from '../../engine/elements/gameobject';
import { Animatable } from '../../engine/utils/traits';

function repeat(sym: string, n: number) {
    const res: string[] = [];
    while (--n) {
        res.push(sym);
    }
    return res;
}

export class Wall extends GameObject {
    constructor([x, y]: [number, number]) {
        super(['wall']);

        this.x = x;
        this.y = y;
        // this.content = "#";

        this.w = 1;
        this.h = 1;
    }

    @Animatable([...repeat('#', 10), ...repeat('%', 10)])
    override update(_: number): void {}
}
