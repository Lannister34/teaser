;(function(){

    /* -------------------- OPTIONS -------------------- */

    var _data = (function(){

        var _loop = function(data){

            var arr = function(callback){
                var step = 0;
                for(step; step < data.length; step++){
                    callback(data[step], step, data);
                };
            };

            var obj = function(callback){
                var prop;
                for(prop in data){
                    data.hasOwnProperty(prop) && callback(data[prop], prop, data);
                };
            };

            return {
                "run" : Array.isArray(data) ? arr : obj
            };
        };

        var _assign = function(init, target){

            _loop(init)
                .run(function(property, key){
                    target[key] = property;
                });

            return target;
        };

        var _pull = function(name, fallback){

            var r = new RegExp('[\\?&]' + name.replace(/[\[]/, '\\[')
                        .replace(/[\]]/, '\\]') + '=([^&#]*)')
                            .exec(location.search);

            return !r ? fallback : 
                    decodeURIComponent(r[1].replace(/\+/g, ' '))
                        .replace(/-/g, '/');
        }

        return {
            "loop"     :   _loop,
            "assign"   :   _assign,
            "pull"   :     _pull
        };

    })();

    var _css = (function(){

        var _prx = {
            "properties"   :   new RegExp("text-size-adjust|user-select|transform|transition|box-shadow|animation|filter", "i"),
            "prefix"       :   ["", "webkit", "moz", "ms", "o", "ie", "wap", "khtml"],
            "set"          :   function(property){

                var properties =
                    this.properties.source
                        .split("|");

                properties
                    .push(property);

                properties =
                    properties
                        .toString()
                            .replace(/,/g, "|");

                this.properties =
                        new RegExp(properties, this.properties.flags);
            }
        };

        var _fix = function(element, param, obj){
            _data.loop(_prx.prefix).run(function(item, i){
                var p = i ? "-" + item + "-" : "";
                element.style[p + param] = obj[param];
            });
        };

        var _style = function(element, obj){
            _data.loop(obj).run(function(param, key){
                key.match(_prx.properties) ? 
                    _fix(element, key, obj) : element.style[key] = param;
            });
        };

        var _properties = function(obj){
                var result = "";
                _data.loop(obj).run(function(property, key){
                    key.match(_prx.properties) ? _data.loop(_prx.prefix).run(function(prefix, i){
                        var new_prefix = i ? "-" + prefix + "-" : "";
                        result += new_prefix + key + ":" + property + ";";
                    }) : result += key + ":" + property + ";"
                });
                return result;
        };

        var _rule = function(parent, obj){

            var init = "sheet" in parent ? 
               "insertRule" in parent["sheet"] ? 
                    ["sheet", "insertRule"] : "addRule" in parent["sheet"] ? 
                        ["sheet", "addRule"] : null : null;

            var inject_style = function(parent, selector, rules, index){
                var index = index || null;
                !init ? 
                    parent.innerHTML += selector + "{" + rules + "}" : init[1] === "addRule" ? 
                        parent[init[0]][init[1]](selector, rules, index) :
                            parent[init[0]][init[1]](selector + "{" + rules + "}", index);

                init && parent.sheet.init_count++;
            };

            init ? 
                parent.sheet.init_count ?
                    false : parent.sheet.init_count = 0 : false;

            _data.loop(obj)
                .run(function(selector, key){
                    inject_style(parent, key, _properties(selector), parent.sheet.init_count);
                });
        };

        var _animation = function(parent, obj){
            _data.loop(obj).run(function(animation, name){
                var sign =  "/" + "* " + name + " *" + "/\n\n";
                var animation_box = (function(){
                    var result = "";
                    _data.loop(_prx.prefix).run(function(fix, i){
                        var prefix = i ? "-" + fix + "-" : "";
                        result += "@" + prefix + "keyframes " + name + " {\n" + (function(){
                            var step = "";
                            _data.loop(animation).run(function(anim, s){
                                step += s + "{" + _properties(anim) + "}\n";
                            });
                            return step;
                        })() + "}\n\n";
                    });
                    return result;
                })();

                parent.innerHTML +=
                    sign + animation_box;
            });
        };

        var _media = function(parent, obj){
            _data.loop(obj).run(function(statement, name){
                var state_case = "@media " + name + " {\n" + (function(){
                    var result = "";
                    _data.loop(statement).run(function(selector, key){
                        result += key + "{" + _properties(selector) + "}";
                    });
                    return result;
                })() + "\n}\n\n";
                parent.innerHTML += state_case; 
            });
        };

        return {
            "prx"          :   _prx,
            "fix"          :   _fix,
            "style"        :   _style,
            "rule"         :   _rule,
            "animation"    :   _animation,
            "media"        :   _media,
            "properties"   :   _properties
        }

    })();

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    var _embeded = false;
    var _config = null;

    window.GLOBAL_CONFIG && (
        _config = window.GLOBAL_CONFIG
    ) || (
        _config = /global_config=([^\&]+)(\&|$)/.exec(document.location.search),
        _config && (
            _config = JSON.parse(
                decodeURIComponent(
                    atob(_config[1])
                )
            ),
            _embeded = true
        )
    );

    if(!_config){
        return;
    }


    //var _config = window.GLOBAL_CONFIG
    var _cmnd   = {};

    _cmnd.fetch  = function(cmnd){
        cmnd && window.top.postMessage({
            'hash' : _config.phash,
            'cmnd' : cmnd
        }, '*');
    };

    _cmnd.gain = function(){
        window.addEventListener('message', function(event){
            typeof event.data === 'object' &&
                event.data.hash === _config.phash &&
                    (
                        event.data.cmnd.name in _cmnd.pull &&
                            _cmnd.pull[event.data.cmnd.name](event.data.cmnd.data || null)
                    );
        });
    };

    _cmnd.send = {

        'ready'  : _cmnd.fetch.bind(null, {
            'name' : 'ready',
        }),
        
        'hide'   : _cmnd.fetch.bind(null, {
            'name' : 'hide',
        }),
        
        'close'  : _cmnd.fetch.bind(null, {
            'name' : 'close',
        }),

        'target' : _cmnd.fetch.bind(null, {
            'name' : 'target',
        }),

        'empty'  : _cmnd.fetch.bind(null, {
            'name' : 'empty',
        }),

        'bounce' : _cmnd.fetch.bind(null, {
            'name' : 'bounce',
            'data' : _config.close_url || null
        })

    };

    _cmnd.pull = {};

    var _tracker = new (function(){

        this.clickmap = _config.click_map ?
            _config.click_map + (/\?/.test(_config.click_map) ? '&' : '?') : null

        this.targeted = 0;

        this.internals = function(event){

            var size  = _page.size();
            var state = _page.device().orientation.portrait;

            return this.clickmap
                + 'c='   + (event.pageX + ';' + event.pageY)
                + '&co=' + (event.offsetX + ';' + event.offsetY)
                + '&fs=' + (size.in_width + ';' + size.in_height)
                + '&tc=' + (this.targeted)
                + '&so=' + (state ? 1 : 0)
                + '&it=' + ('isTrusted' in event ? event.isTrusted ? 1 : 0 : '-1')
                + '&'    +  Math.random();
        };

        this.request = {

            'list' : [],

            'make' : function(url){
                var index = this.list.length;
                this.list.push(new Image());
                this.list[index]._complete_ = false;
                this.list[index].onload = this.list[index].onerror = function(){
                    this._complete_ = true;
                };
                //document.body.appendChild(this.list[index]);
                this.list[index].src = url;
            },

            'complete' : function(){

                var r = true,
                    l = this.list.length,
                    i = 0;

                for(; i < l; i++){
                    if(!this.list[i]._complete_){
                        r = false;
                        break;
                    };
                };

                return r;
            }

        };

        this.show = function(){
            _config.pixel && this.request.make(_config.pixel);
        };

        this.event = function(event){

            this.clickmap && this.request
                .make(this.internals(event));

            this.targeted && (
                this.timer = setInterval(function(){
                    this.request.complete() && (
                        clearInterval(this.timer),
                        _cmnd.send.target()
                    );
                }.bind(this), 50)
            );
        };

        this.target = function(){
            this.targeted = 1;
            _config && _cmnd.send.hide();
        };

    })();

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    var _page = (function(){

        var _type = _data
            .pull("promosize", .25);

        var _agent = (function(){

            var an = window
                .navigator
                    .userAgent
                        .toLowerCase();

            var am = function(naming){
                return an.match(naming);
            };

            return {
                "android"  :  am(/android/i),
                "ios"      :  am(/iphone|ipad|ipod/i),
                "uc"       :  am(/ucbrowser/i)
            }

        })();

        var _size = function(){
            return {

                "in_width"    :   Math.min(document.documentElement.clientWidth, window.innerWidth || 0),
                "in_height"   :   Math.min(document.documentElement.clientHeight, window.innerHeight || 0),

                "av_width"    :   screen.availWidth,
                "av_height"   :   screen.availHeight
            }
        };

        var _scale = function(){
            var size = _size(),
                scale = size.in_width < size.in_height / _type && size.av_width < size.av_height ||
                        size.in_width > size.in_height / _type && size.av_width > size.av_height ? 
                            size.in_width / size.av_width 
                                : size.in_width / size.av_height;

            return scale > 1 ? scale : 1;
        };

        var _device = function(){
            var size = _size(), scale = _scale(),
                width = size.in_width,
                height = size.in_height / _type,

                mobile = width < height && width < 450 * scale && height < 850 * scale ||
                         width > height && width < 850 * scale && height < 450 * scale;

            return {

                "orientation" : {
                    "landscape"  :   width > height,
                    "portrait"   :   width < height
                },

                "type" : {
                    "mobile" : mobile,
                    "tablet" : mobile ? false : true
                }
            };
        };

        return {
            "agent"   :  _agent,
            "size"    :  _size,
            "scale"   :  _scale,
            "device"  :  _device,
            "type"    :  _type
        };

    })();

    var _events = (function(){

        var evt_list = {};

        var run_evt = function(type, evt){
            var evt = evt || null; 
            type in evt_list ? _data.loop(evt_list[type]).run(function(func){
                func(evt);
            }) : console.warn('there is no ' + type + " event in window"); 
        };

        var set_evt = function(){
            _data.loop(evt_list).run(function(e, type){
                "on" + type in window ? window["on" + type] = function(event){
                    run_evt(type, event);
                } : console.warn('there is no ' + type + " event in window");
            });
        };

        var add_evt = function(type){
            type in evt_list || (evt_list[type] = {});
        };

        var add_func = function(type, name, func){
            type in evt_list ?
                name in evt_list[type] ?
                    console.warn(type + " event already has " + name + " function")
                        : evt_list[type][name] = func
                            : (function(){
                                add_evt(type);
                                evt_list[type][name] = func;
                            })();
        };

        var remove_evt = function(type){
            type in evt_list && (delete evt_list[type]);
        };

        var remove_func = function(type, name){
            type in evt_list ?
                func in evt_list[type] && (delete evt_list[type][name])
                    : false;
        };

        return {
            "list"            :     evt_list,
            "set"             :     set_evt,
            "run"             :     run_evt,

            "add"    : {
                "evt"         :     add_evt,
                "func"        :     add_func
            },

            "remove" : {
                "evt"         :     remove_evt,
                "func"        :     remove_func
            }
        };

    })();

    var _box = (function(){

        var
        box   = document.createElement("a");
        box.classList.add("main-box");
        box.setAttribute('href', _config.click_url);
        box.setAttribute('target', '_blank');

        _page.agent.ios ? (
            box.style['cursor'] = 'pointer',
            box.setAttribute('onclick', 'void(0)'),
            box.addEventListener('click', function(event){_tracker.target();})
        ) : (
            box.onclick = _tracker.target.bind(_tracker)
        );

        /*var
        coeff = .3,
        clicker = function(sx, sy, cx, cy){
            var evt
            var e = {
                bubbles       : true,
                cancelable    : true,
                view          : window,
                detail        : 0,

                screenX       : sx,
                screenY       : sy,
                clientX       : cx,
                clientY       : cy,

                ctrlKey       : false,
                altKey        : false,
                shiftKey      : false,
                metaKey       : false,
                button        : 0,
                relatedTarget : undefined
            };

            if (typeof document.createEvent == 'function') {
                evt = document.createEvent('MouseEvents')
                evt.initMouseEvent(
                    'click',
                    e.bubbles,
                    e.cancelable,
                    e.view,
                    e.detail,
                    e.screenX,
                    e.screenY,
                    e.clientX,
                    e.clientY,
                    e.ctrlKey,
                    e.altKey,
                    e.shiftKey,
                    e.metaKey,
                    e.button,
                    document.body.parentNode
                );

            } else if (document.createEventObject) {
                evt = document.createEventObject()
                for (prop in e) {
                    evt[prop] = e[prop]
                }
                evt.button = {
                    0: 1,
                    1: 4,
                    2: 2,
                }[evt.button] || evt.button
            };

            return evt
        },

        caller = function(element, event){
            if (element.dispatchEvent) {
                element.dispatchEvent(event)
            } else if (event.fireEvent) {
                element.fireEvent('on' + type, event)
            }
            return event
        },

        setup = function(){
            box.setAttribute('href', _config.click_url);
            box.setAttribute('target', '_blank');
            box.onclick = _tracker.target.bind(_tracker);
        },

        bounds = function(event){

            var

            size  = _page.size(),
            x     = size.in_width  * coeff,
            y     = size.in_height * coeff;

            return {

                'origin' : {
                    'x' : event.pageX,
                    'y' : event.pageY
                },

                'top'    : Math.max(event.pageY - y, 0),
                'bottom' : Math.min(event.pageY + y, size.in_height),
                'left'   : Math.max(event.pageX - y, 0),
                'right'  : Math.min(event.pageX + y, size.in_width)
            };
        };

        if(_page.agent.ios){

            box.style['cursor'] = 'pointer';
            box._event = {
                'exit'  : false
            };

            box.ontouchmove = function(event){

                if(event.touches.length > 1){
                    this._event.exit = true;
                    return;
                };

                this._event.move = event.targetTouches[0];
                !this._event.exit && (this._event.exit = (
                    event.pageY >= this._event.bounds.top    &&
                    event.pageY <= this._event.bounds.bottom &&
                    event.pageX >= this._event.bounds.left   &&
                    event.pageX <= this._event.bounds.right
                ) ? false : true);
            };

            box.ontouchstart = function(event){

                if(event.touches.length > 1){
                    this._event.exit = true;
                    return;
                };

                delete this._event.move;
                this._event.exit   = false;
                this._event.start  = event.targetTouches[0];
                this._event.bounds = bounds(this._event.start);
            };

            box.ontouchend = function(){

                if(this._event.exit){
                    return;
                };

                var
                clicked   = false,
                event     = this._event.move || this._event.start || null;
                setup();

                try {
                    event && (
                        caller(
                            this, clicker(event.pageX, event.pageY, event.clientX, event.clientY)
                        ),
                        clicked = true
                    );
                } catch(e){};

                try {
                    clicked || (
                        this.click(),
                        clicked = true
                    )
                } catch(e){};

            };

        } else {
            setup();
        };*/

        document.body.onclick = _tracker.event.bind(_tracker);
        return box;

    })();

    var _engine = {
        "data"      :    _data,
        "css"       :    _css,
        "cmnd"      :    _cmnd,
        "tracker"   :    _tracker,
        "config"    :    _config,
        "embeded"   :    _embeded,
        "page"      :    _page,
        "events"    :    _events,
        "box"       :    _box
    };

    /* --------------------- INIT --------------------- */

    var
    script        = document.createElement("script");
    script.src    = "/files/js/constructor/mobile/sticker/" + data_config.options.template + "/set-up.js?" + Math.random();
    script.onload = function(){
        promo_set_up(_engine, data_config.data);
    };
    document.head.appendChild(script);

})();