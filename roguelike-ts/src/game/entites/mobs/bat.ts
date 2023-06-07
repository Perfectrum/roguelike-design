// import { GameObject } from '../../../engine/elements/gameobject';
// import { Animatable } from '../../../engine/utils/traits';
// import { repeat } from '../../../engine/utils/traits/animable';
// import { Hero } from '../hero';
// import { Mob } from './mob';

// export class Bat extends Mob {
//     constructor(point: [number, number]) {
//         super(point, 'Bat');
//     }

//     maxHP() {
//         return 5;
//     }

//     killXP() {
//         return 15;
//     }

//     damageXP() {
//         return 0;
//     }

//     killScore(): number {
//         return 2;
//     }

//     @Animatable([...repeat('W', 2), ...repeat('M', 2)])
//     update(t: number): void {
//         super.update(t);
//     }
// }
