import { Widgets } from 'blessed';
import { Force, GameObject } from '../../engine/elements/gameobject';
import { Forcable, CanNotCollideWith } from '../../engine/utils/traits';
import { Loot } from './items/loot';
import { LootPlace, WearsLoot } from './items/amunition';
import { Exit } from './env/exit';
import { Mob } from './mobs/mob';
import { FireBall } from './fireball';

export class Hero extends GameObject {
    private hp: number;
    private xp: number;
    private level: number;
    private damage: number;
    private armor: number;
    private fireballs: number;

    public statistics: {
        levels: number;
        mobs: number;
        score: number;
    };

    private inventory: Record<LootPlace, WearsLoot | null>;

    constructor([x, y]: [number, number]) {
        super(['hero']);

        this.x = x;
        this.y = y;

        this.z = 5;

        this.content = 'O';

        this.w = 1;
        this.h = 1;

        this.hp = 100;
        this.xp = 0;
        this.damage = 1;

        this.level = 1;
        this.armor = 1;

        this.fireballs = 5;

        this.inventory = {
            head: null,
            body: null,
            rightHand: null,
            leftHand: null
        };

        this.statistics = {
            levels: 0,
            mobs: 0,
            score: 0
        };
    }

    init() {
        this.changeHpUI();
        this.changeXpUI();
        this.changeDmgNArm();
        this.changeInventory();
        this.changeFireBallDisplay();
        this.changeStatisticsUI();
    }

    private getPureDamage() {
        return this.damage + 2 * (this.level - 1);
    }

    private getInvetoryDamage() {
        return Object.values(this.inventory)
            .filter((x) => x !== null)
            .map((x) => x!.getDamage())
            .reduce((a, x) => a + x, 0);
    }

    private getDamage() {
        return this.getPureDamage() + this.getInvetoryDamage();
    }

    private getPureArmor() {
        return this.armor + 5 * (this.level - 1);
    }

    private getInventoryArmor() {
        return Object.values(this.inventory)
            .filter((x) => x !== null)
            .map((x) => x!.getArmor())
            .reduce((a, x) => a + x, 0);
    }

    private getArmor() {
        return this.getPureArmor() * this.getInventoryArmor();
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
            let dirs: [number, number] = [0, 0];
            if (key.name === 'w') {
                dirs = [0, -1];
            }
            if (key.name === 's') {
                dirs = [0, 1];
            }
            if (key.name === 'a') {
                dirs = [-1, 0];
            }
            if (key.name === 'd') {
                dirs = [1, 0];
            }

            if (dirs[0] !== 0 || dirs[1] !== 0) {
                if (this.fireballs > 0) {
                    this.placeObject(new FireBall([this.x, this.y, ...dirs], this));
                    --this.fireballs;
                    this.changeFireBallDisplay();
                }
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
                    this.statistics.levels += 1;
                    this.statistics.score += 500;
                }
            }
        }

        if (key.name === 'f') {
            const object = this.findCollideWith('danger');
            if (object) {
                if (object instanceof Mob) {
                    this.giveXp(object.takeDamage(this.getDamage()));
                    if (object.killed) {
                        this.statistics.mobs += 1;
                        this.statistics.score += object.killScore();
                    }
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

        this.statistics.score += xps * 0.5;
        this.changeXpUI();
        this.changeDmgNArm();
    }

    private changeDmgNArm() {
        this.findUI('dmgTitle')?.setContent(
            `{bold}DMG{/bold} | ${this.getPureDamage()} (+${this.getInvetoryDamage()})`
        );
        this.findUI('armTitle')?.setContent(
            `{bold}ARM{/bold} | ${this.getPureArmor()} (+${this.getInventoryArmor()})`
        );
    }

    private changeStatisticsUI() {
        this.findUI('mobsLabel')?.setContent(`$ MOBS: ${this.statistics.mobs.toFixed(0)}`);
        this.findUI('levelsLabel')?.setContent(
            `$#####$ LEVELS: ${this.statistics.levels.toFixed(0)}`
        );
        this.findUI('scoreLabel')?.setContent(
            `$###########$ SCORE: ${this.statistics.score.toFixed(0)}`
        );
    }

    private changeHpUI() {
        let hps = '';
        const items = Math.round((this.hp / 100) * 10);
        if (items < 3) {
            hps = '{red-fg}';
        } else if (items < 6) {
            hps = '{yellow-fg}';
        } else {
            hps = `{green-fg}`;
        }
        let i = 0;
        for (; i < items; ++i) {
            hps += '#';
        }
        hps += '{/}';
        for (; i < 10; ++i) {
            hps += '-';
        }

        this.findUI('hpBar')?.setContent(
            `{bold}HP{/bold}  | [${hps}] ${this.hp.toFixed(0).padStart(3, ' ')}`
        );
    }

    private changeInventory() {
        let text = '';
        for (const [key, val] of Object.entries(this.inventory)) {
            if (val) {
                text += `:: ${val.getName()}\n: ${val.getDescription()}\n\n`;
            } else {
                text += ':: -\n:  -\n\n';
            }
        }

        this.findUI('inventoryDisplay')?.setContent(text);
    }

    private changeFireBallDisplay() {
        this.findUI('fireballsDisplay')?.setContent(`Fireballs ${this.fireballs}`);
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
            `{bold}XP{/bold}  | [${xps}] ${this.xp.toString().padStart(3, ' ')}`
        );
        this.findUI('xpTitle')?.setContent(`HERO LEVEL => ${this.level} <=`);
    }

    private drawHpBar(maxHp: number, current: number) {
        let hps = '{red-fg}';
        const items = Math.round((current / maxHp) * 10);
        let i = 0;
        for (; i < items; ++i) {
            hps += '#';
        }
        hps += '{/}';
        for (; i < 10; ++i) {
            hps += '-';
        }

        return `[${hps}]`;
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

    equip(loot: WearsLoot) {
        const oldLoot = this.inventory[loot.getPlace()];
        this.inventory[loot.getPlace()] = loot;
        if (oldLoot) {
            oldLoot.setCoords(this.x, this.y);
            this.placeObject(oldLoot);
        }
        this.changeDmgNArm();
        this.changeInventory();
    }

    giveFireBall(count: number) {
        this.fireballs += count;
        this.changeFireBallDisplay();
    }

    @CanNotCollideWith(['wall'])
    @Forcable()
    override update(_: number): void {}

    override post() {
        this.findUI('tip')?.setText(``);
        this.contentBraces = ['', ''];
        this.content = 'O';

        const action = this.findCollideWith('action');
        if (action) {
            if (action instanceof Loot) {
                this.findUI('tip')?.setText(`Use E to take "${action.getName()}"`);
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
                this.findUI('tip')?.setContent(
                    `You are fighting with MOB "${danger.getName()}"! ${this.drawHpBar(
                        danger.maxHP(),
                        danger.currentHP()
                    )}`
                );
            }

            this.contentBraces[0] = '{red-fg}';
            this.contentBraces[1] = `{/}`;
            this.content = 'X';

            return;
        }
    }
}
