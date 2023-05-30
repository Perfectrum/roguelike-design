import { GameObject } from '../../elements/gameobject';

export function Forcable(isConst = false) {
    return function (
        _target: any,
        _propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<(t: number) => void>
    ) {
        const original = descriptor.value!;
        descriptor.value = function (this: GameObject, dt: number) {
            this.x += this.force.x;
            this.force.x -= !isConst ? Math.sign(this.force.x) : 0;
            this.y += this.force.y;
            this.force.y -= !isConst ? Math.sign(this.force.y) : 0;

            original.call(this, dt);
        };

        return descriptor;
    };
}
