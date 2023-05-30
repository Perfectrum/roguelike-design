import { GameObject } from "../../engine/elements/gameobject"
import { Exit } from "../entites/exit";
import { Hero } from "../entites/hero";
import { Loot } from "../entites/loot";
import { Mob } from "../entites/mob";
import { Space } from "../entites/space";
import { Wall } from "../entites/wall";

export function fromText(text:string) : [ GameObject | null , GameObject[] ] {
    const objs:GameObject[] = [];
    let hero:GameObject | null = null;

    const lines = text.split('\n');

    let [ x, y ] = [0, 0];
    for (const line of lines) {
        for (const char of line) {
            if (char === '#') {
                objs.push(new Wall([x, y]));
            }
            if (char === '@') {
                objs.splice(0, 0, new Space([x, y]));
                hero = new Hero([x, y]);
            }
            if (char === 'l') {
                objs.splice(0, 0, new Space([x, y]));
                objs.push(new Loot([x, y], 'loot'));
            }
            if (char === ' ') {
                objs.splice(0, 0, new Space([x, y]));
            }
            if (char === '&') {
                objs.push(new Exit([x, y]));
            }
            if (char === 'M') {
                objs.splice(0, 0, new Space([x, y]));
                objs.push(new Mob([x, y]));
            }
            ++x;
        }
        ++y;
        x = 0;
    }

    return [hero, objs];
}

const testLayout = 
`
#####################
#                   #
#        l          #
#                   #
#    l              #
#         @         #
#                   #
#             l     #
#    l              #
#                   #
#####################
`;

function testMap() {
    return fromText(testLayout);
}

export const maps = {
    testMap
}
