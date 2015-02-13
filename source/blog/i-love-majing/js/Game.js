(function() {

    var tickID,
        currentTime = Date.now(),
        frame = 0,stagePos;

    function onPos(e) {
        var type;

        if (e.type == "mousedown" || e.type == "touchstart")
            type = "Down";
        else if (e.type == "mouseup" || e.type == "touchend")
            type = "Up";
        else
            type = "Click";

        e.point = {
            x: e.pageX,
            y: e.pageY
        };

        Game._input(type, e);
    }
    
    var Game = {
        _cb: {
            tick: [],
            render: [],
            input: []
        },

        extend: function(obj) {
            for (var key in obj) {
                if (!obj.hasOwnProperty(key)) continue;
                this[key] = obj[key];
            }
        },


        init: function(canvas, cb) {
            this.canvas = canvas;
            this.context = canvas.getContext("2d");
            this.width = canvas.width;
            this.height = canvas.height;
            stagePos = Game.DOM.inner(canvas);
            if (cb) {
                cb(canvas);
            }
        },

        start: function() {
            var Me = this;
            tickID = setInterval(function() {
                Me.step();
            }, 1000 / Config.FPS);

            $('#canvas').on('touchend mouseup', function(event) {
                event.preventDefault();
                onPos(event);
            });

            $(window).on('resize', function(event) {
                event.preventDefault();
                stagePos = Game.DOM.inner(Me.canvas);
            });
        },


        step: function() {
            var now = Date.now();
            var dt = now - currentTime;
            currentTime = now;
            Game._tick(dt, frame++);
            Game._render(this.context);
        },

        stop: function() {

        },

        _tick: function(dt, frame) {
            var cbs = this._cb.tick,
                i = 0,
                l = cbs.length;

            for (; i < l; ++i) {
                cbs[i](dt, frame);
            }
        },

        tick: function(cb) {
            this._cb.tick.push(cb);
        },

        _render: function(context) {
            var cbs = this._cb.render,
                i = 0,
                l = cbs.length;

            for (; i < l; ++i) {
                cbs[i](context);
            }
        },

        render: function(cb) {
            this._cb.render.push(cb);
        },

        _input: function(type, e) {
            var cbs = this._cb.input,
                i = 0,
                l = cbs.length;

            for (; i < l; ++i) {
                cbs[i](type, e);
            }
        },

        input: function(cb) {
            this._cb.input.push(cb);
        }
    };


    Game.extend({
        DOM: {
            inner: function(obj) {
                var rect = obj.getBoundingClientRect(),
                    x = rect.left + (window.pageXOffset ? window.pageXOffset : document.body.scrollTop),
                    y = rect.top + (window.pageYOffset ? window.pageYOffset : document.body.scrollLeft),

                    //border left
                    borderX = parseInt(this.getStyle(obj, 'border-left-width') || 0, 10) ||
                    parseInt(this.getStyle(obj, 'borderLeftWidth') || 0, 10) || 0,

                    borderY = parseInt(this.getStyle(obj, 'border-top-width') || 0, 10) ||
                    parseInt(this.getStyle(obj, 'borderTopWidth') || 0, 10) || 0;

                x += borderX;
                y += borderY;

                return {
                    x: x,
                    y: y
                };
            },

            getStyle: function(obj, prop) {
                var result;
                if (obj.currentStyle)
                    result = obj.currentStyle[this.camelize(prop)];
                else if (window.getComputedStyle)
                    result = document.defaultView.getComputedStyle(obj, null).getPropertyValue(this.csselize(prop));
                return result;
            },

            camelize: function(str) {
                return str.replace(/-+(.)?/g, function(match, chr) {
                    return chr ? chr.toUpperCase() : ''
                });
            },

            csselize: function(str) {
                return str.replace(/[A-Z]/g, function(chr) {
                    return chr ? '-' + chr.toLowerCase() : ''
                });
            }
        }
    });

    window.Game = Game;

}());
