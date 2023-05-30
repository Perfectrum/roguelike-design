import { GameObject } from '../../elements/gameobject';

export function CanNotCollideWith(tags: string[]) {
    return function (
        _target: any,
        _propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<(t: number) => void>
    ) {
        const original = descriptor.value!;
        descriptor.value = function (this: GameObject, dt: number) {
            for (const tag of tags) {
                for (const obj of this.willCollide) {
                    if (obj.containsTag(tag)) {
                        this.force.x = 0;
                        this.force.y = 0;
                    }
                }
            }

            original.call(this, dt);
        };

        return descriptor;
    };
}
