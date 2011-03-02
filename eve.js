/*
 * Eve 0.2.2 - JavaScript Events Library
 *
 * Copyright (c) 2010 Dmitry Baranovskiy (http://dmitry.baranovskiy.com/)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */

var eve = (function () {
    var version = "0.2.2",
        has = "hasOwnProperty",
        separator = /[\.\/]/,
        wildcard = "*",
        current_event,
        events = {n: {}},
    /*\
     * eve
     [ method ]
     **
     * Fires event with given `name`, given scope and other parameters.
     **
     # <strong>Arguments</strong>
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated
     - scope (object) context for the event handlers
     - varargs (...) the rest of arguments will be sent to event handlers
     **
     = (array) array of errors, if any. Each element of the array is in format:
     | {
     |     error: // error message,
     |     func: // handler that caused error
     | }
    \*/
        eve = function (name, scope) {
            var e = events,
                args = Array.prototype.slice.call(arguments, 2),
                listeners = eve.listeners(name),
                errors = [];
            current_event = name;
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
    /*\
     * eve.listeners
     [ method ]
     **
     * Internal method which gives you array of all event handlers that will be triggered by the given `name`.
     **
     # <strong>Arguments</strong>
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated
     **
     = (array) array of event handlers
    \*/
    eve.listeners = function (name) {
        var names = name.split(separator),
            e = events,
            item,
            items,
            k,
            i,
            ii,
            j,
            jj,
            nes,
            es = [e],
            out = [];
        for (i = 0, ii = names.length; i < ii; i++) {
            nes = [];
            for (j = 0, jj = es.length; j < jj; j++) {
                e = es[j].n;
                items = [e[names[i]], e[wildcard]];
                k = 2;
                while (k--) {
                    item = items[k];
                    if (item) {
                        nes.push(item);
                        out = out.concat(item.f || []);
                    }
                }
            }
            es = nes;
        }
        return out;
    };
    /*\
     * eve.on
     [ method ]
     **
     * Binds given event handler with a given name. You can use wildcards “`*`” for the names:
     | eve.on("*.under.*", f);
     | eve("mouse.under.floor"); // triggers f
     * Use @eve to trigger the listener.
     **
     # <strong>Arguments</strong>
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
     **
     = (boolean) `false` if given function already assigned as event handler to given name, `true` otherwise
    \*/
    eve.on = function (name, f) {
        var names = name.split(separator),
            e = events;
        for (var i = 0, ii = names.length; i < ii; i++) {
            e = e.n;
            !e[names[i]] && (e[names[i]] = {n: {}});
            e = e[names[i]];
        }
        e.f = e.f || [];
        for (i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
            return !1;
        }
        e.f.push(f);
        return !0;
    };
    /*\
     * eve.nt
     [ method ]
     **
     * Could be used inside event handler to figure out actual name of the event.
     **
     # <strong>Arguments</strong>
     **
     - subname (string) #optional subname of the event
     **
     = (string) name of the event, if `subname` is not specified
     * or
     = (boolean) `true`, if current event’s name contains `subname`
    \*/
    eve.nt = function (subname) {
        if (subname) {
            return new RegExp("(?:\\.|\\/|^)" + subname + "(?:\\.|\\/|$)").test(current_event);
        }
        return current_event;
    };
    /*\
     * eve.unbind
     [ method ]
     **
     * Removes given function from the list of event listeners assigned to given name.
     **
     # <strong>Arguments</strong>
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
    \*/
    eve.unbind = function (name, f) {
        var names = name.split(separator),
            e,
            key,
            splice,
            cur = [events];
        for (var i = 0, ii = names.length; i < ii; i++) {
            for (var j = 0; j < cur.length; j += splice.length - 2) {
                splice = [j, 1];
                e = cur[j].n;
                if (names[i] != wildcard) {
                    if (e[names[i]]) {
                        splice.push(e[names[i]]);
                    }
                } else {
                    for (key in e) if (e[has](key)) {
                        splice.push(e[key]);
                    }
                }
                cur.splice.apply(cur, splice);
            }
        }
        for (i = 0, ii = cur.length; i < ii; i++) {
            e = cur[i];
            while (e.n) {
                if (f) {
                    if (e.f) {
                        for (i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
                            e.f.splice(i, 1);
                            break;
                        }
                        !e.f.length && delete e.f;
                    }
                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
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
        }
    };
    /*\
     * eve.version
     [ property (string) ]
     **
     * Current version of the library.
    \*/
    eve.version = version;
    eve.toString = function () {
        return "You are running Eve " + version;
    };
    return eve;
})();
typeof exports != "undefined" && exports != null && (exports.eve = eve);