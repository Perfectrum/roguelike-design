import { GameObject } from '../../../engine/elements/gameobject';
import { Space } from '../env';
import { Behavior, Panic, Ignore } from './behavior';

/**
 * Абстрактный класс моба
 * @extends GameObject
 */
export abstract class Mob extends GameObject {

    /**
     * Текущее поведение моба
     * @type {Behavior}
     * @public
     */
    public behaviorState: Behavior;
    
    /**
     * Поведения моба по умолчанию
     * @type {Behavior}
     * @public
     */
    public defaultBehaviorState: Behavior;

    /**
     * Начальные координаты
     * @type {number}
     * @protected
     */
    protected initX: number;
    protected initY: number;

    /**
     * Очки здоровья
     * @type {number}
     * @public
     */
    public hp: number;

    /**
     * Показатель урона
     * @type {number}
     * @public
     */
    public damage: number;
    
    /**
     * Флаг, указывающий, был ли моб убит
     * @type {boolean}
     * @public
     */
    public killed: boolean;

    /**
     * Дальность поля зрения моба
     * @type {number}
     * @public
     */
    public visionRange: number;

    /**
     * Название моба
     * @type {string}
     * @public
     */
    public name: string;

    /**
     * Создает новый экземпляр моба
     * @param {[number, number]} [x, y] - Координаты
     * @param {string} name - Название
     */
    constructor([x, y]: [number, number], name: string) {
        super(['mob', 'danger']);
        this.defaultBehaviorState = new Ignore(
            this,
            (mob: Mob) => mob.hp <= mob.maxHP() * 0.3,
            new Panic(this, (mob: Mob) => mob.hp > mob.maxHP() * 0.3)
        );
        this.behaviorState = this.defaultBehaviorState;

        this.initX = x;
        this.initY = y;

        this.x = x;
        this.y = y;
        this.z = 4;
        this.visionRange = 10;
        this.content = ' ';

        this.w = 1;
        this.h = 1;

        this.hp = this.maxHP();

        this.damage = 1;

        this.name = name;
        this.killed = false;
    }

    abstract maxHP(): number;
    abstract killXP(): number;
    abstract damageXP(): number;

    /**
     * Задает силу, действующую на моба.
     * @param {[number, number]} [x, y] - Сила, действующая по осям x и y
     * @public
     */
    public push([x, y]: [number, number]): void {
        this.force.x = x;
        this.force.y = y;
    }

    killScore() {
        return 11;
    }

    currentHP() {
        return this.hp;
    }

    getName() {
        return this.name;
    }

    getInitX() {
        return this.initX;
    }

    getInitY() {
        return this.initY;
    }

    /**
     * Возвращает расстояние до указанного объекта
     * @param {GameObject} target Целевой объект
     * @returns {number} Расстояние
     */
    public distanceTo(target: GameObject): number {
        return Math.abs(target.getX() - this.x) + Math.abs(target.getY() - this.y);
    }

  /**
     * Пытается увидеть указанный объект без учета в поля видимости
     * @param {string} target Название целевого объекта
     * @returns {GameObject} Увиденный объект или undefined, если цели
     * с данным названием не найдена
     */  
  public lookForPure(target: string) {
        return this.findObject(target);
    }

    /**
     * Пытается увидеть указанный объект, если он в поле видимости
     * @param {string} target Название целевого объекта
     * @returns {GameObject} Увиденный объект или undefined, если цели
     * с данным названием нет в поле зрения
     */
    public lookFor(target: string) {
        const obj = this.findObject(target);
        if (!obj) {
            return undefined;
        }

        if (this.distanceTo(obj) <= this.visionRange) {
            return obj;
        }
    }


    /**
    * Возвращает ссылку на объект пространства, в котором находится моб
    * @returns {Space} - "Пол", на котором стоит моб
    */
    public getFloor()  {
        const objs = this.findObjectByCoords(this.getX(), this.getY(), 0, 0);
        return objs.find(x => x.containsTag('space'))! as Space;
    }


    /**
     * Получение урона и смерть, если полученный урон фатален
     * @param {number} dhp Показатель полученного урона
     * @returns {number} Количество очков опыта, которые должен
     * получить атаковавший моба игрок
     */
    takeDamage(dhp: number): number {
        this.hp -= dhp;
        if (this.hp <= 0) {
            this.remove();
            this.killed = true;
            return this.killXP();
        }
        return this.damageXP();
    }

    abstract update(t: number): void;
}
