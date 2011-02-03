/*
 * Eve 0.2.0 - JavaScript Events Library
 *
 * Copyright (c) 2010 Dmitry Baranovskiy (http://dmitry.baranovskiy.com/)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */

var eve = (function () {
    var version = "0.2.0",
        events = {n: {}},
        eve = function (name, scope) {
            var e = events,
                args = Array.prototype.slice.call(arguments, 2),
                listeners = eve.listeners(name),
                errors = [];
            if (!listeners) {
                return null;
            }
            for (var i = 0, ii = listeners.length; i < ii; i++) {
                try {
                    listeners[i].apply(scope, args);
                } catch (ex) {
                    errors.push({error: ex && ex.message || ex, func: listeners[i]});
                }
            }
            if (errors.length) {
                return errors;
            }
        };
    eve.listeners = function (name) {
        var names = name.split("."),
            e = events,
            es = [e],
            out = [];
        for (var i = 0, ii = names.length; i < ii; i++) {
            var nes = [];
            for (var j = 0, jj = es.length; j < jj; j++) {
                e = es[j].n;
                e[names[i]] && nes.push(e[names[i]]);
                e["*"] && nes.push(e["*"]);
            }
            es = nes;
        }
        for (j = 0, jj = es.length; j < jj; j++) {
            e = es[j];
            while (e.n) {
                if (e.f) {
                    for (i = 0, ii = e.f.length; i < ii; i++) {
                        out.push(e.f[i]);
                    }
                }
                for (var key in e.n) if (e.n[has](key) && e.n[key].f) {
                    var funcs = e.n[key].f;
                    for (i = 0, ii = funcs.length; i < ii; i++) {
                        out.push(funcs[i]);
                    }
                }
                e = e.n;
            }
        }
        return out.length ? out : null;
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
                for (var key in e.n) if (e.n[has](key) && e.n[key].f) {
                    var funcs = e.n[key].f;
                    for (i = 0, ii = funcs.length; i < ii; i++) if (funcs[i] == f) {
                        funcs.splice(i, 1);
                        break;
                    }
                    !funcs.length && delete e.n[key].f;
                }
            } else {
                delete e.f;
                for (key in e.n) if (e.n[has](key) && e.n[key].f) {
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
typeof exports != "undefined" && exports != null && (exports.eve = eve);