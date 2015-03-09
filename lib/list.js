/*jslint unparam: true*/
module.exports = (function (adt) {
    "use strict";
    function mreturn(x, t) {
        return t.Cons.from(x, t.Nil.from());
    }
    return adt
        .data("List", {Cons: 1, Nil: 0})
        .implements("map", {
            Cons: function (h, tail, f, t) {
                return t.Cons.from(f(h), tail.map(f));
            },
            Nil: function (f, t) {
                return t.Nil.from();
            }
        })
        .implements("head", {
            Cons: function (x, xs, t) {
                return x;
            },
            Nil: function (t) {
                throw new Error("Nil has no head");
            }
        })
        .implements("tail", {
            Cons: function (x, xs, t) {
                return xs;
            },
            Nil: function (t) {
                throw new Error("Nil has no tail");
            }
        })
        .implements("drop", {
            Cons: function (x, xs, n, t) {
                return n <= 0 ? t.Cons.from(x, xs) : xs.drop(n - 1);
            },
            Nil: function (n, t) {
                return t.Nil.from();
            }
        })
        // Is it worth implementing as a non-primitive combinator instead?
        .implements("count", {
            Cons: function (x, xs, t) {
                return 1 + xs.count();
            },
            Nil: function (t) {
                return 0;
            }
        })
        .implements("ap", {
            Cons: function (f, fs, vs, t) {
                return t.List.mplus(vs.map(f), fs.ap(vs));
            },
            Nil: function (vs, t) {
                return t.Nil.from();
            }
        })
        .implements("foldRight", {
            Cons: function (x, xs, z, f, t) {
                return f(x, xs.foldRight(z, f));
            },
            Nil: function (z, f, t) {
                return z;
            }
        })
        .implements("foldLeft", {
            Cons: function (x, xs, z, f, t) {
                return xs.foldLeft(f(x, z), f);
            },
            Nil: function (z, f, t) {
                return z;
            }
        })
        .static("mreturn", mreturn)
        .static("pure", mreturn)
        .static("mzero", function (t) {
            return t.Nil.from();
        })
        .static("mplus", function (l, r, t) {
            return l.foldRight(r, t.Cons.from);
        })
        .static("fromArray", function (arr, t) {
            var list = t.Nil.from(),
                i = arr.length - 1;
            for (i; i >= 0; i -= 1) {
                list = t.Cons.from(arr[i], list);
            }
            return list;
        })
        .static("toArray", function (list, t) {
            var val = t.List.destructure()
                    .Cons(function (h, _) { return h; })
                    .Nil(function () { return null; }),
                arr = [],
                i = 0,
                cell = list;
            for (i, cell; cell.isCons; i += 1, cell = cell.tail()) {
                arr[i] = val(cell);
            }
            return arr;
        })
        .implements("toArray", {
            Cons: function (x, xs, t) {
                return t.List.toArray(t.Cons.from(x, xs));
            },
            Nil: function (t) {
                return [];
            }
        })
        .implements("mbind", {
            Cons: function (x, xs, f, t) {
                return t.Cons.from(x, xs).map(f)
                    .foldRight(t.List.mzero(), t.List.mplus);
            },
            Nil: function (f, t) {
                return t.Nil.from();
            }
        });
}(
    require("./algebraic")
));
