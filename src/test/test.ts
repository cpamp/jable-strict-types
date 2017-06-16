

import { StrictTypes, Nullable, Arguments } from "../StrictTypes";

export class Test {
    @StrictTypes(Function, Boolean, String)
    public TestMethod(func: any, bool: any, str: any) {

    }

    @StrictTypes(String, Array, Nullable(Object))
    public NoNulls(str: any, arr: any, obj: any) {

    }

    @StrictTypes(String, Object, Arguments(String))
    public Args(str: any, obj: any, ...args: any[]) {
        
    }

    @StrictTypes(String, Object, Arguments(Nullable(String)))
    public NullArgs(str: any, obj: any, ...args: any[]) {
        
    }

    @StrictTypes(Arguments(String), String)
    public WrongArgs(str: string, str2: string) {

    }
}

function Try(func: ((...args: any[]) => any)) {
    try {
        return func()
    } catch(e) {
        console.log(e);
    }
}

var t = new Test();

console.log('\nTest');
Try(() => t.TestMethod(function() {}, true, []));
Try(() => t.TestMethod(function() {}, true, ''));
Try(() => t.TestMethod(null, true, ''));

console.log('\nNull no');
Try(() => t.NoNulls('', [], null));
Try(() => t.NoNulls('', [], 'null'));
Try(() => t.NoNulls('', [], void 0));

console.log('\nargs');
Try(() => t.Args('', {}, '', ''));
Try(() => t.Args('', {}, '', []));
Try(() => t.Args('', {}, '', null));

console.log('\nNull args');
Try(() => t.NullArgs('', {}, '', ''));
Try(() => t.NullArgs('', {}, '', []));
Try(() => t.NullArgs('', {}, '', null));

Try(() => t.WrongArgs('', ''));