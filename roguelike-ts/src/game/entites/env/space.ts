import { GameObject } from '../../../engine/elements/gameobject';

type NeighbourSide = 'top' | 'bottom' | 'left' | 'right';

export class Space extends GameObject {

    neighbours:[Space | null, Space | null, Space | null, Space | null]

    constructor([x, y]: [number, number]) {
        super(['space']);

        this.neighbours = [null, null, null, null];

        this.x = x;
        this.y = y;
        this.content = ' ';

        this.w = 1;
        this.h = 1;

        this.viewOnly = true;
    }

    id() {
        return `space_${this.x}_${this.y}`;
    }

    addNeighbour(side: NeighbourSide, n:Space) {
        if (side === 'top') {
            n.neighbours[2] = this;
            this.neighbours[0] = n;
        }
        if (side === 'bottom') {
            n.addNeighbour('top', this);
        }
        if (side === 'left') {
            n.neighbours[1] = this;
            this.neighbours[3] = n;
        }
        if (side === 'right') {
            n.addNeighbour('left', this);
        }
    }

    findPath([x, y] : [number, number]) : [number, number][] {

        const visited = new Set<string>();
        const parents : { [k:string] : [number, Space] } = {}

        const queue : Space[] = [this];
        while (queue.length > 0) {

            console.log('ewfwfew');

            const space = queue.shift()!;

            if (space.getX() === x && space.getY() === y) {
                let current = space;
                const result : [number, number][] = [];
                while (current !== null || current !== this) {
                    const next = parents[current.id()];
                    if (!next) {
                        return [];
                    }

                    const [ side, nextSpace ] = next;
                    if (side === 0) {
                        result.splice(0, 0, [0, 1]);
                    }
                    if (side === 1) {
                        result.splice(0, 0, [1, 0]);
                    }
                    if (side === 2) {
                        result.splice(0, 0, [0, -1]);
                    }
                    if (side === 3) {
                        result.splice(0, 0, [-1, 0]);
                    }

                    current = nextSpace;
                }

                console.log('-----------');
                return result;
            }

            visited.add(space.id());
            let i = -1;
            for (const item of space.neighbours) {
                ++i;
                if (item === null) {
                    continue;
                }
                console.log(visited.size);
                if (visited.has(item.id())) {
                    continue;
                }

                parents[item.id()] = [i, space];
                queue.push(item);
            }
        }

        console.log('-----------');
        return [];
    }

    update(_: number): void { }
}
