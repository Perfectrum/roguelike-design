import { GameObject } from '../../engine/elements/gameobject';

export class Exit extends GameObject {
    constructor([x, y]: [number, number]) {
        super(['exit', 'action']);

        this.x = x;
        this.y = y;
        this.content = '&';

        this.w = 1;
        this.h = 1;
    }

    
    update(_: number): void {}
}
