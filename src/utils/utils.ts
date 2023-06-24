/**
 * 对比两个对象是否相等
 * @param a 
 * @param b 
 * @returns true | false
 */
export const isEqual = (a: any, b: any) => {
    if (a === b) return true; //恒等
    if (a && b && typeof a == 'object' && typeof b == 'object') { //都是对象的时候
        if (a.constructor !== b.constructor) return false; //构造函数不一样

        var length, i, keys;
        if (Array.isArray(a)) { //都是数组的时候，
            length = a.length;
            if (length != b.length) return false; //长度不一样，不相等
            for (i = length; i-- !== 0;)
                if (!isEqual(a[i], b[i])) return false; //递归每一项，有不相等的就false
            return true;
        }

        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags; //正则的时候
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false; //keys长度不一样

        for (i = length; i-- !== 0;)
            if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false; //keys长度一样，但是属性不一样

        for (i = length; i-- !== 0;) {
            var key = keys[i];

            if (!isEqual(a[key], b[key])) return false;  //递归value
        }

        return true;
    }

    // true if both NaN, false otherwise
    return a !== a && b !== b;
};
