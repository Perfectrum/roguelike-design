import { GameObject } from '../../engine/elements/gameobject';
import { Mob } from '../entites/mobs/mob';
import { Exit, Space, Wall } from '../entites/env';
import { Loot } from '../entites/items/loot';
import { randomLoot } from '../map/maps';
import { AbstractMobFactory } from '../entites/mobs/abstractMobFactory';

/**
 * Класс метаданных карты
 */
export class MapMeta {
    /**
     * Маркер героя на карте
     * @type {string}
     */
    public heroMark: string;
    
    /**
     * Отображение среды на игровые объекты (маркеры пустого пространства, стен и дверей)
     * @type {Record<string, (point: [number, number]) => GameObject>}
     */
    public envMapping: Record<string, (point: [number, number]) => GameObject>;
    
    /**
     * Маркеры лута
     * @type {Record<string, (point: [number, number]) => Loot>}
     */
    public lootMapping: Record<string, (point: [number, number]) => Loot>;
    
    /**
     * Маркеры мобов каждого сеттинга (предполагается, что все маркеры уникальны)
     * @type {Record<string, (point: [number, number]) => Loot>}
     */
    public mobMappings: Record<
        string,
        Record<string, (AbstractMobFactory: AbstractMobFactory, point: [number, number]) => Mob>
    >;
    
    /**
     * Конструктор создает метаданные карты по умолчанию
     */
    public constructor() {
        this.heroMark = '@';

        this.envMapping = {
            ' ': (point) => new Space(point),
            '#': (point) => new Wall(point),
            '&': (point) => new Exit(point)
        };

        this.lootMapping = {
            l: (point) => randomLoot(point)
        };

        this.mobMappings = {
            fantasy: {
                O: (factory, point) => factory.createAggressiveMob(point),
                G: (factory, point) => factory.createCowardMob(point),
                E: (factory, point) => factory.createPassiveMob(point)
            },
            cyberpunk: {
                K: (factory, point) => factory.createAggressiveMob(point),
                H: (factory, point) => factory.createCowardMob(point),
                D: (factory, point) => factory.createPassiveMob(point)
            },
            apocalypse: {
                Z: (factory, point) => factory.createAggressiveMob(point),
                V: (factory, point) => factory.createCowardMob(point),
                M: (factory, point) => factory.createPassiveMob(point)
            }
        };
    }
}
