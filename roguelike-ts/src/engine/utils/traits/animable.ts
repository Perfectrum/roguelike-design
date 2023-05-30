
const animTrait = Symbol("anim");
export function Animatable(anim:string[]) {
    return function (_target: any, _propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<((t:number) => void)>) {

        const original = descriptor.value!;
        descriptor.value = function (this:any, dt:number) {
            if (!this[animTrait]) {
                this[animTrait] = 0;
            }
            let i = this[animTrait];
            this.setContent(anim[i % anim.length]);
            original.call(this, dt);
            this[animTrait] = (this[animTrait] + 1) % anim.length;
        }

        return descriptor;
    }
}
