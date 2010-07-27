/*!
 * Eve 0.1.2 - JavaScript Events Library
 *
 * Copyright (c) 2010 Dmitry Baranovskiy (http://dmitry.baranovskiy.com/eve/)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
eve = (function () {
    var version = "0.1.2",
        events = {n: {}},
        eve = function (name, scope) {
            var names = name.split("."),
                e = events,
                args = Array.prototype.slice.call(arguments, 2),
                errors = [];
            for (var i = 0, ii = names.length; i < ii; i++) {
                e = e.n;
                if (!e[names[i]]) {
                    return [{error: "Name doesn\u2019t exist"}];
                }
                e = e[names[i]];
            }
            while (e.n) {
                if (e.f) {
                    for (i = 0, ii = e.f.length; i < ii; i++) {
                        try {
                            e.f[i].apply(scope, args);
                        } catch (ex) {
                            errors.push({error: ex && ex.message || ex, func: e.f[i]});
                        }
                    }
                }
                for (var key in e.n) if (e.n.hasOwnProperty(key) && e.n[key].f) {
                    var funcs = e.n[key].f;
                    for (i = 0, ii = funcs.length; i < ii; i++) {
                        try {
                            funcs[i].apply(scope, args);
                        } catch (e) {
                            errors.push({error: e && e.message || e, func: funcs[i]});
                        }
                    }
                }
                e = e.n;
            }
            if (errors.length) {
                return errors;
            }
        };
    eve.on = function (name, f) {
        var names = name.split("."),
            e = events;
        for (var i = 0, ii = names.length; i < ii; i++) {
            e = e.n;
            !e[names[i]] && (e[names[i]] = {n: {}});
            e = e[names[i]];
        }
        e.f = e.f || [];
        for (i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
            return false;
        }
        e.f.push(f);
    };
    eve.unbind = function (name, f) {
        var names = name.split("."),
            e = events,
            errors = [];
        for (var i = 0, ii = names.length; i < ii; i++) {
            e = e.n;
            if (!e[names[i]]) {
                return false;
            }
            e = e[names[i]];
        }
        while (e.n) {
            if (f) {
                if (e.f) {
                    for (i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
                        e.f.splice(i, 1);
                        break;
                    }
                    !e.f.length && delete e.f;
                }
                for (var key in e.n) if (e.n.hasOwnProperty(key) && e.n[key].f) {
                    var funcs = e.n[key].f;
                    for (i = 0, ii = funcs.length; i < ii; i++) if (funcs[i] == f) {
                        funcs.splice(i, 1);
                        break;
                    }
                    !funcs.length && delete e.n[key].f;
                }
            } else {
                delete e.f;
                for (key in e.n) if (e.n.hasOwnProperty(key) && e.n[key].f) {
                    delete e.n[key].f;
                }
            }
            e = e.n;
        }
        return true;
    };
    eve.version = version;
    eve.toString = function () {
        return "You are running Eve " + version;
    };
    return eve;
})();
typeof exports != "undefined" && (exports.eve = eve);