module.exports = (function (core, _) {
    "use strict";

    return {
        partial: _.partial,
        partialRight: _.partialRight,
        constant: _.constant,
        curry: function (f) {
            if (f.length === 0) {
                throw "Cannot curry variadic or void input function.";
            }
            return _.curry(f);
        },
        curryN: _.curry(function (n, f) { return _.curry(f, n); }),
        toList: _.toArray,
        first: _.first,
        rest: _.rest,
        head: _.first,
        tail: _.rest,
        multi: core.multi,
        keys: _.keys,
        id: _.identity,
        property: _.property,
        reduce: _.curry(function (f, a, s) { return _.reduce(s, f, a); }),
        pick: _.curry(function (f, o) { return _.pick(o, f); }),
        omit: _.curry(function (f, o) { return _.omit(o, f); }),
        contains: _.curry(function (n, h) { return _.includes(h, n); }),
        compose: _.compose,
        last: _.last,
        initial: _.initial,
        merge: _.merge
    };
}(
    require("./core.ref"),
    require("lodash")
));
