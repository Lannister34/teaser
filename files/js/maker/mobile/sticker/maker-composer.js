window.promo_composer = function(){

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
            var box = document
                .querySelector(form_config.preview);

            return {

                "in_width"    :   parseInt(window.getComputedStyle(box).width),
                "in_height"   :   parseInt(window.getComputedStyle(box).height),

                "av_width"    :   parseInt(window.getComputedStyle(box).width),
                "av_height"   :   parseInt(window.getComputedStyle(box).height) / _type
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

        var run_evt = function(type){
            type in evt_list ?

                _data.loop(evt_list[type])
                    .run(function(func){
                        func();
                    })

                : console.warn('there is no ' + type + " event in window");
        };

        var set_evt = function(holder){
            holder["resize"] = function(){
                _data.loop(evt_list)
                    .run(function(e, type){
                        run_evt(type);
                    });
            };
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

    var _maker = (function(){

        var _controls = function(holder, callback){

            "src" in holder ||
                (holder.src = document
                    .querySelector(holder.button));

            holder.src
                .classList
                    .remove(holder.play);

            holder.src
                .classList
                    .add(holder.pause);

            holder.src.onclick = function(){
                _data.loop(["play", "pause"])
                    .run(function(state){
                        holder.src
                            .classList
                                .toggle(holder[state]);
                    });

                callback();
            };
        };

        return {
            "controls"     :   _controls
        };

    })();

    return {
        "data"      :    _data,
        "css"       :    _css,
        "page"      :    _page,
        "events"    :    _events,
        "maker"     :    _maker
    };

};
