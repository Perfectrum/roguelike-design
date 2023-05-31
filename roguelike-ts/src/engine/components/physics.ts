import { Widgets } from 'blessed';
import { Scene } from '../elements/scene';
import { GameObject } from '../elements/gameobject';

export type PhysicsFunc = (s: Scene, t: number, c: number) => void;

type PointWithObject = [number, number, GameObject];
function findCollisions(points: PointWithObject[]): GameObject[][] {
    const dict: { [x: number]: { [y: number]: GameObject[] } } = {};
    const result: GameObject[][] = [];

    for (const point of points) {
        const [x, y, obj] = point;
        if (dict[x] === undefined) {
            dict[x] = {};
        }
        if (dict[x][y] === undefined) {
            dict[x][y] = [];
        }

        dict[x][y].push(obj);
    }

    for (const xKey in dict) {
        for (const yKey in dict[xKey]) {
            const box = dict[xKey][yKey];
            if (box.length > 1) {
                result.push(box);
            }
        }
    }

    return result;
}

function markCollision(collisions: GameObject[][], willCollide: boolean) {
    for (const batch of collisions) {
        for (let i = 0; i < batch.length; ++i) {
            const res: GameObject[] = [];
            for (let j = 0; j < batch.length; ++j) {
                if (i == j) {
                    continue;
                }
                res.push(batch[j]);
            }
            if (willCollide) {
                batch[i].setPredictionCollision(res);
            } else {
                batch[i].setCurrentCollision(res);
            }
        }
    }
}

export function createPhysics(screen: Widgets.Screen) {
    return function (scene: Scene, dt: number, ticks: number) {
        const objs = scene.getPhysicsObjects();

        const willCollide = findCollisions(
            objs.map((x) => [
                x.getX() + x.getForce().x,
                x.getY() + x.getForce().y,
                x.resetFutureCollision()
            ])
        );
        markCollision(willCollide, true);

        for (const obj of objs) {
            obj.update(dt);
            if (ticks % obj.getUpdateRate() === 0) {
                obj.rateUpdate();
            }
        }

        markCollision(
            findCollisions(objs.map((x) => [x.getX(), x.getY(), x.resetCurrentCollision()])),
            false
        );

        for (const obj of objs) {
            obj.post();
        }
    };
}
