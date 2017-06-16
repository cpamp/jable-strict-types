type IFunction = ((...args: any[]) => any);

interface IHasName extends IFunction{
    name: string;
}

interface IHasConstructor extends IFunction {
    constructor: IHasName;
}

class NullableType {
    constructor(public value: IFunction) {}
}

export function Nullable(type: IFunction): IFunction {
    return <any>(new NullableType(type));
}

class ArgumentsType {
    constructor(public value: IFunction) {}
}

export function Arguments(type: IFunction): IFunction {
    return <any>(new ArgumentsType(type));
}

export function StrictTypes(...classes: IFunction[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        var oldFunc = descriptor.value;
        descriptor.value = function(...args: any[]) {
            if (classes[classes.length - 1] instanceof ArgumentsType) {
                let argClass = (<ArgumentsType>(<any>classes[classes.length - 1])).value;
                classes[classes.length - 1] = argClass;
                while (classes.length < args.length) {
                    classes.push(argClass)
                }
            }
            if (classes.length !== args.length)
                throw "Number of arguments does not match number of types.";
            for (var i = 0; i < args.length; i++) {
                var arg = args[i] as IHasConstructor,
                    c = classes[i] as IHasName;

                if (c instanceof ArgumentsType)
                    throw "Arguments must be the last parameter";

                if (arg != null && arg.constructor !== c && !(c instanceof NullableType))
                    throw invalideType(arg.constructor.name, i);

                if (!(c instanceof NullableType) && arg == null)
                    throw "Null values not allowed at index: " + i;
                else if (<any>c instanceof NullableType && arg != null && (<NullableType>(<any>c)).value !== arg.constructor)
                    throw invalideType(arg.constructor.name, i);
            }
            return oldFunc.apply(this, args);
        }
    };
}

function invalideType(name: string, index: number) {
    return "Invalid type " + name + " at argument index: " + index;
}