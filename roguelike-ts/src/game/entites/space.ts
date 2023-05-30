import { GameObject } from "../../engine/elements/gameobject";

export class Space extends GameObject {
    constructor([x, y]:[number, number]) {
        super(['space']);

        this.x = x;
        this.y = y;
        this.content = " ";

        this.w = 1;
        this.h = 1;

        this.viewOnly = true;
    }


    update(_: number): void {

    }
}


