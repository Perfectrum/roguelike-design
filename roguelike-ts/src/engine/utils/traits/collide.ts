import { GameObject } from '../../elements/gameobject';

/**
 * Декоратор, указывающий что объект не может сталкиваться с другими объектами,
 * имеющими определенные теги
 * @param {string[]} tags - Массив тегов, с которыми объект не может сталкиваться
 * @returns {Function} Декоратор
 */
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
