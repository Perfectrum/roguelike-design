import { Widgets } from 'blessed';
import { Force, GameObject } from '../../engine/elements/gameobject';
import { Forcable, CanNotCollideWith } from '../../engine/utils/traits';
import { Loot, LootPlace } from './loot';
import { Exit } from './exit';
import { Mob } from './mob';
import { FireBall } from './fireball';

export class Hero extends GameObject {
    private hp: number;
    private xp: number;
    private level: number;
    private damage: number;
    private armor: number;

    private inventory: Record<LootPlace, Loot | null>;

    constructor([x, y]: [number, number]) {
        super(['hero']);

        this.x = x;
        this.y = y;

        this.content = 'O';

        this.w = 1;
        this.h = 1;

        this.hp = 100;
        this.xp = 0;
        this.damage = 1;

        this.level = 1;
        this.armor = 1;

        this.inventory = {
            head: null,
            body: null,
            rightHand: null,
            leftHand: null
        };
    }

    init() {
        this.changeHpUI();
        this.changeXpUI();
    }

    private getDamage() {
        return this.damage + 2 * (this.level - 1);
    }

    private getArmor() {
        return this.armor + 5 * (this.level - 1);
    }

    private getResistKoefficient() {
        return 1 - (2 / (1 + Math.exp((-6 * this.getArmor()) / 200)) - 1);
    }

    override keyPressed(key: Widgets.Events.IKeyEventArg): void {
        if (!key.shift) {
            if (key.name === 'w') {
                this.force = Force.up();
            }
            if (key.name === 's') {
                this.force = Force.down();
            }
            if (key.name === 'a') {
                this.force = Force.left();
            }
            if (key.name === 'd') {
                this.force = Force.right();
            }
        }

        if (key.shift) {
            if (key.name === 'w') {
                this.placeObject(new FireBall([this.x, this.y, 0, -1], this));
            }
            if (key.name === 's') {
                this.placeObject(new FireBall([this.x, this.y, 0, 1], this));
            }
            if (key.name === 'a') {
                this.placeObject(new FireBall([this.x, this.y, -1, 0], this));
            }
            if (key.name === 'd') {
                this.placeObject(new FireBall([this.x, this.y, 1, 0], this));
            }
        }

        if (key.name === 'r') {
            this.sendSignal('nextLvl');
        }

        if (key.name === 'e') {
            const object = this.findCollideWith('action');
            if (object) {
                if (object instanceof Loot) {
                    object.effect(this);
                    object.remove();
                }
                if (object instanceof Exit) {
                    this.sendSignal('nextLvl');
                }
            }
        }

        if (key.name === 'f') {
            const object = this.findCollideWith('danger');
            if (object) {
                if (object instanceof Mob) {
                    this.giveXp(object.takeDamage(this.getDamage()));
                }
            }
        }
    }

    giveXp(xps: number) {
        this.xp += xps;
        if (this.xp > 100) {
            this.level += Math.floor(this.xp / 100);
            this.xp = this.xp % 100;
        }
        this.changeXpUI();
    }

    private changeHpUI() {
        let hps = '';
        const items = Math.round((this.hp / 100) * 10);
        let i = 0;
        for (; i < items; ++i) {
            hps += '#';
        }
        for (; i < 10; ++i) {
            hps += '-';
        }

        this.findUI('hpBar')?.setContent(
            `{bold}HP{/bold} [${hps}] ${this.hp.toFixed(0).padStart(3, ' ')}`
        );
    }

    private changeXpUI() {
        let xps = '';
        const items = Math.round((this.xp / 100) * 10);
        let i = 0;
        for (; i < items; ++i) {
            xps += '#';
        }
        for (; i < 10; ++i) {
            xps += '-';
        }

        this.findUI('xpBar')?.setContent(
            `{bold}XP{/bold} [${xps}] ${this.xp.toString().padStart(3, ' ')}`
        );
        this.findUI('xpTitle')?.setContent(`HERO LEVEL => ${this.level} <=`);
    }

    takeDamage(dhp: number) {
        this.hp = Math.max(0, this.hp - dhp * this.getResistKoefficient());
        if (this.hp === 0) {
            return this.sendSignal('gameOver');
        }
        this.changeHpUI();
    }

    heal(dhp: number) {
        this.hp = Math.min(100, this.hp + dhp);
        this.changeHpUI();
    }

    @CanNotCollideWith(['wall'])
    @Forcable()
    override update(_: number): void {}

    override post() {
        const action = this.findCollideWith('action');
        if (action) {
            if (action instanceof Loot) {
                this.findUI('tip')?.setText(`Use E to take ${action.getName()}`);
            }
            if (action instanceof Exit) {
                this.findUI('tip')?.setText(`Use E to teleport to next level!`);
            }
            this.content = '@';

            return;
        }

        const danger = this.findCollideWith('danger');
        if (danger) {
            if (danger instanceof Mob) {
                this.findUI('tip')?.setText(`You are fighting with MOB!`);
            }
            this.content = 'X';

            return;
        }

        this.findUI('tip')?.setText(``);
        this.content = 'O';
    }
}
