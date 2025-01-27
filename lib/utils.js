function asyncMap(items, iterator, cb) {
    var len = items.length;
    var rv = [];
    cb = once(cb);

    items.forEach(function (item, i) {
        iterator(item, function (err, data) {
            if (err) return cb(err);
            rv[i] = data;
            len--;
            if (len === 0) {
                cb(null, rv);
            }
        });
    });
}
exports.asyncMap = asyncMap;


function flatten(arrs) {
    return Array.prototype.concat.apply([], arrs);
}
exports.flatten = flatten;


function existent(val) {
    return !!val;
}
exports.existent = existent;


function isFunction(val) {
    return Object.prototype.toString.call(val) == '[object Function]';
}
exports.isFunction = isFunction;


function once(fn) {
    var inv = false;

    return function () {
        if (inv) return;
        inv = true;
        fn.apply(null, arguments);
    }
}
exports.once = once;


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
exports.onlyUnique = onlyUnique;

function deepExtend(destination, source) {
    for (var property in source) {
        if (source[property] && source[property].constructor &&
            source[property].constructor === Object) {
            destination[property] = destination[property] || {};
            deepExtend(destination[property], source[property]);
        } else {
            destination[property] = source[property];
        }
    }
    return destination;
};
exports.deepExtend = deepExtend;
