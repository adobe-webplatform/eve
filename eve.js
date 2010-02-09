/*!
 * Eve 0.1.2 - JavaScript Events Library
 *
 * Copyright (c) 2010 Dmitry Baranovskiy (http://dmitry.baranovskiy.com/eve/)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
 
eve = (function (oldEve, wasit, objectsMap, id, events) {
    var Eve = function (id, host) {
            this.id = id;
            this.host = host;
        },
        newEve = function (obj) {
            var oid;
            for (var i in objectsMap) {
                if (objectsMap.hasOwnProperty(i) && objectsMap[i] === obj) {
                    oid = i;
                    break;
                }
            }
            oid = oid || id++;
            objectsMap[oid] = obj;
            return new Eve(oid, obj);
        };

    function binder(command) {
        return function (name, handler) {
            if (name && handler) {
                var e = events[this.id] = events[this.id] || {};
                (e[name] = e[name] || [])[command](handler);
            }
            return this;
        };
    }

    Eve.prototype.bind = binder("push");

    Eve.prototype.bindOnTop = binder("unshift");

    Eve.prototype.unbind = function (name, handler) {
        if (name) {
            var e = events[this.id],
                handlers = e[name],
                i = handlers && handlers.length;
            if (handler) {
                while (i--) {
                    if (handlers[i] == handler) {
                        handlers.splice(i, 1);
                        break;
                    }
                }
            } else {
                handlers.length = 0;
            }
            if (!handlers.length) {
                delete e[name];
                i = 0;
                for (var j in e) {
                    if (e.hasOwnProperty(j)) {
                        i++;
                    }
                }
                !i && delete events[this.id] && delete objectsMap[this.id];
            }
        } else {
            delete events[this.id];
            delete objectsMap[this.id];
        }
        return this;
    };

    Eve.prototype.fire = function (name) {
        if (name) {
            var handlers = events[this.id] && events[this.id][name],
                length = handlers && handlers.length;
            if (length) {
                for (var i = 0; i < length; i++) {
                    var res = handlers[i].apply(this.host, Array.prototype.slice.call(arguments, 1)), u;
                    if (res !== u && !res) {
                        break;
                    }
                }
            } else {
                !events[this.id] && delete objectsMap[id--];
            }
        }
        return this;
    };

    newEve.version = "0.1.2";
    newEve.toString = function () {
        return "You are running Eve v." + this.version;
    };

    newEve.ninja = function () {
        wasit ? (eve = oldEve) : delete eve;
        return newEve;
    };

    function onunload() {
        for (var i in objectsMap) {
            delete objectsMap[i];
            delete events[i];
        }
    }

    window.addEventListener && window.addEventListener("unload", onunload, false);
    window.attachEvent && window.attachEvent("onunload", onunload);

    return newEve;
})(window.eve, window.hasOwnProperty("eve"), {}, 1, {});