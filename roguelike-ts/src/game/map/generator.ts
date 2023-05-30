import { fromText } from './maps';

interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface Tree {
    content: Box;
    left: Tree | null;
    right: Tree | null;
}

const MIN_ROOM = 15;

function createTree(content: Box, left: Tree | null = null, right: Tree | null = null): Tree {
    return {
        content,
        left,
        right
    };
}

function splitNode(node?: Tree): Tree[] {
    if (!node) {
        return [];
    }
    const dir = Math.random();

    const wspace = node.content.w - 2 * MIN_ROOM;
    const hspace = node.content.h - 2 * MIN_ROOM;

    const doWCut = () => {
        if (wspace <= 0) {
            return [];
        }

        const div = Math.round(Math.random() * wspace);

        node.left = createTree({
            x: node.content.x,
            y: node.content.y,
            w: MIN_ROOM + div,
            h: node.content.h
        });

        node.right = createTree({
            x: node.content.x + node.left.content.w,
            y: node.content.y,
            w: node.content.w - node.left.content.w,
            h: node.content.h
        });

        return [node.left, node.right];
    };

    const doHCut = () => {
        if (hspace <= 0) {
            return [];
        }

        const div = Math.round(Math.random() * hspace);

        node.left = createTree({
            x: node.content.x,
            y: node.content.y,
            w: node.content.w,
            h: MIN_ROOM + div
        });

        node.right = createTree({
            x: node.content.x,
            y: node.content.y + node.left.content.h,
            w: node.content.w,
            h: node.content.h - node.left.content.h
        });

        return [node.left, node.right];
    };

    if (dir > 0.5) {
        const res = doWCut();
        return res;
    } else {
        const res = doHCut();
        return res;
    }
}

function getLeafs(tree: Tree | null): Box[] {
    if (!tree) {
        return [];
    }

    if (tree.left === null && tree.right === null) {
        return [tree.content];
    }

    return ([] as Box[]).concat(getLeafs(tree.left)).concat(getLeafs(tree.right));
}

function makeRoades(node: Tree): Box[] {
    if (!node.left || !node.right) {
        return [];
    }

    const lcx = node.left.content.x + Math.floor(node.left.content.w / 2);
    const lcy = node.left.content.y + Math.floor(node.left.content.h / 2);

    const rcx = node.right.content.x + Math.floor(node.right.content.w / 2);
    const rcy = node.right.content.y + Math.floor(node.right.content.h / 2);

    if (lcx === rcx) {
        const box: Box = {
            x: lcx - 1,
            y: Math.min(lcy, rcy) - 1,
            w: 3,
            h: Math.max(lcy, rcy) - Math.min(lcy, rcy) + 2
        };

        return [box].concat(makeRoades(node.left)).concat(makeRoades(node.right));
    } else {
        const box: Box = {
            x: Math.min(lcx, rcx) - 1,
            y: lcy - 1,
            w: Math.max(lcx, rcx) - Math.min(lcx, rcx) + 2,
            h: 3
        };

        return [box].concat(makeRoades(node.left)).concat(makeRoades(node.right));
    }
}

function selectRoom(room: Box): Box {
    const dx = Math.round(Math.random() * (room.w / 3));
    const dy = Math.round(Math.random() * (room.h / 3));

    const dw = Math.round(Math.random() * (room.w / 4));
    const dh = Math.round(Math.random() * (room.h / 4));

    return {
        x: room.x + dx,
        y: room.y + dy,
        w: room.w - dw - dx,
        h: room.h - dh - dy
    };
}

export function generateMap(w: number, h: number, lsize: number, msize: number) {
    const t = createTree({ x: 0, y: 0, w, h });
    const queue = [t];
    while (queue.length) {
        const item = queue.shift();
        const leafs = splitNode(item);
        for (const l of leafs) {
            queue.push(l);
        }
    }

    const field: string[][] = [];

    for (let j = 0; j <= h; ++j) {
        const line: string[] = [];
        for (let i = 0; i <= w; ++i) {
            line.push('#');
        }
        field.push(line);
    }

    const leafRooms = getLeafs(t).map(selectRoom);
    const rooms = leafRooms.concat(makeRoades(t));

    for (const room of rooms) {
        for (let x = 1; x < room.w; ++x) {
            for (let y = 1; y < room.h; ++y) {
                field[room.y + y][room.x + x] = ' ';
            }
        }
    }

    const mask = [
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1],
        [-1, -1],
        [-1, 0],
        [-1, 1]
    ];

    for (let y = 0; y < field.length; ++y) {
        for (let x = 0; x < field[y].length; ++x) {
            const ch = field[y][x];
            if (ch === '#') {
                let inner = true;
                for (const [dx, dy] of mask) {
                    const cx = x + dx;
                    const cy = y + dy;

                    if (cx < 0 || cy < 0 || cy >= field.length || cx >= field[cy].length) {
                        continue;
                    }

                    const cs = field[cy][cx];
                    if (cs === ' ') {
                        inner = false;
                    }
                }

                if (inner) {
                    field[y][x] = '$';
                }
            }
        }
    }

    if (rooms.length > 0) {
        const hx = rooms[0].x + Math.round(rooms[0].w / 2);
        const hy = rooms[0].y + Math.round(rooms[0].h / 2);

        field[hy][hx] = '@';
    }

    if (leafRooms.length > 0) {
        const last = leafRooms[leafRooms.length - 1];
        const hx = last.x + last.w - 2;
        const hy = last.y + last.h - 2;

        field[hy][hx] = '&';
    }

    const placeObjects = (content: string, size: number) => {
        for (let i = 0; i < size; ++i) {
            let rounds = 0;
            while (rounds < 50) {
                ++rounds;
                const roomIdx = Math.floor(Math.random() * leafRooms.length);
                const room = leafRooms[roomIdx];

                const dx = Math.floor(Math.random() * (room.w - 2)) + 1;
                const dy = Math.floor(Math.random() * (room.h - 2)) + 1;

                if (field[room.y + dy][room.x + dx] !== ' ') {
                    continue;
                } else {
                    field[room.y + dy][room.x + dx] = content;
                    break;
                }
            }
        }
    };

    // generate loot
    placeObjects('l', lsize);
    placeObjects('M', msize);

    return fromText(field.map((x) => x.join('')).join('\n'));
}
