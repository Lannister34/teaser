window.promo_set_up = function(engine, config){

    /* ------- preferences ------- */

    var init = {},
        inject = {},

        _css = {},
        _dom = {},

        _set = {},
        re_set,

        preview_box = document
            .querySelector(form_config.preview),

        data;

    config.maker
        .change(function(props){
            inject.obj(props.name, props.data)
        });

    config.maker
        .init(function(){
            re_set(false);
        });



    /* --------------------------- */

    inject.data = function(_data){
        data = _data;
    };

    inject.obj = function(name, item){
        _dom.map[name] && (function(){
            "style-init" in  _dom.map[name] &&
                engine.css
                    .style(_dom.map[name].src, _dom.map[name]["style-init"](item));
        })();
    };

    inject.all = function(){
        engine.data.loop(data)
            .run(function(row, name){
                Array.isArray(row) ?
                    engine.data.loop(row)
                        .run(function(item, i){
                            inject.obj(name + "#" + i, item);
                        })
                    : inject.obj(name, row);
            });
    };


    /* --------------------------- */

    init.create = function(d, a, r){

        this.n = [];
        this.d = d * 1000;
        this.s = 1;
        this.timer = null;
        this.stop = false;

        this.toggle = function(){

            if(!this.callback){
                return false;
            };

            var _this = this;

            this.stop ?
                this.stop = false
                    : this.stop = true;

            this.stop &&
                clearTimeout(this.timer);

            !this.stop &&
                _this.start(true);
        };

        this.f = function(list, index){
            engine.data.loop(list)
                .run(function(node, i){
                    i === index ? 
                        engine.css.style(node, a)
                            : engine.css.style(node, r);
                });
        };

        this.callback = null;

        this.start = function(condition){

            var _this = this,
                _state = condition || false;

            _state &&
                this.callback();

            !this.stop &&

                (function(){
                    _this.timer = setTimeout(function(){
                        _this.callback();
                        _this.start();
                    }, _this.d);
                })();
        };

        this.r = function(){
            var _this = this;
            _this.n.length > 0 && (function(){
                _this.f(_this.n, 0);
                _this.n.length > 1 && (function(){

                    _this.callback = function(){
                        _this.f(_this.n, _this.s);
                        _this.s = _this.s === _this.n.length - 1 ? 0 : _this.s + 1;
                    };

                    _this.start();

                })();
            })();
        };
    };

    init.temp = {};

    init.temp.images = function(name, item){

        _dom.map[name + "-box"] = {
            "p" : "img-box",
            "a" : {
                "class" : "--prm--sub --prm--img-item"
            },
            "init" : "images",
        };

        _dom.map[name] = {
            "p" : name + "-box",
            "a" : {
                "class" : "--prm--img"
            },
            "s" : {
                "opacity" : 0
            },
            "r" : {
                "opacity" : 1
            },
            "style-init" : function(e){
                return {
                    "background-image" : "url(" + e.image + ")",
                    "background-position" : "center",
                    "background-repeat" : "no-repeat",
                    "background-size" : "auto 100%",
                    "background-color" : "#" + e.color
                };
            },
        }
    };

    _set.inits = function(){
        init.images = new init.create(data["image-duration"], {
            "opacity" : 1, 
            "transform" : "scale(1)"
        }, {
            "opacity" : 0, 
            "transform" : "scale(1.2)"
        });
    }


    /* ------- css ------- */

    _css.rules = {

        ".--prm--sub" : {
            "position" : "absolute",
            "width" : "100%", "height" : "100%",
            "top" : 0, "left" : 0,
        },

        ".--prm--box" : {
            "cursor" : "pointer",
            "user-select" : "none",
            "-webkit-touch-callout" : "none"
        },

        ".--prm--img-box" : {
            "position" : "absolute",
            "height" : "100%",
            "left" : 0, "bottom" : 0,
            "transition" : "width .6s"
        },

        ".--prm--img" : {
            "position" : "absolute",
            "width" : "auto", "height" : "auto",
            "max-width" : "100%", "max-height" : "100%",
            "margin" : "auto",

            "top" : 0, "bottom" : 0,
            "left" : 0, "right" : 0,

            "transition" : "opacity .6s"
        },

        ".--prm--img-item" : {
            "overflow": "hidden",
            "border-radius" : "22px",
            "transition" : "opacity .5s, transform .5s"
        }

    };

    var style = document.createElement("style");
    style.setAttribute("data-rules", "");
    preview_box.appendChild(style);
    engine.css.rule(style, _css.rules);

    /* ------- dom ------- */

    _set.dom = function(){
        _dom.map = {

            /* main ------- */

            "main" : {
                "a" : {
                    "class" : "--prm--box --prm--sub"
                },
            },

            "img-box" : {
                "p" : "main",
                "a" : {
                    "class" : "--prm--img-box"
                },
                "s" : {
                    "width" : 0
                },
                "r" : {
                    "width" : "100%"
                }
            }

        };

        engine.data.loop(data.images)
            .run(function(img, i){
                init.temp.images("images#" + i, img);
            });
    };

    /* ------- build ------- */

    _set.nodes = function(){

        engine.data.loop(_dom.map)
        .run(function(node, name, map){

            /* node src */
            "n" in node ? node.src = document.createElement(node.n)
                : node.src = document.createElement("div");

            /* attributes */
            "a" in node &&
                engine.data.loop(node.a)
                    .run(function(property, attr){
                        node.src.setAttribute(attr, property);
                    });

            /* inline styles */
            "s" in node &&
                engine.css
                    .style(node.src, node.s);

            /* node parent */
            "p" in node &&
                (function(){
                    typeof node.p === "string" ?
                        map[node.p].src.appendChild(node.src)
                            : node.p.appendChild(node.src);
                })();

            /* init */
            "init" in node &&
                init[node.init].n.push(node.src);

        });

    };

    /* ------- set ------- */

    _set.inject = inject.all;

    _set.start = function(){

        config.maker.promo
            = _dom.map.main.src;

        "options" in config &&
            "controls" in config.options &&
                engine.maker.controls(config.options.controls, function(){
                    init.images.toggle();
                });

        preview_box
            .appendChild(_dom.map.main.src);

        init.images.r();

        setTimeout(function(){
            engine.data.loop(_dom.map)
                .run(function(node){
                    "r" in node &&
                        engine.css.style(node.src, node.r);
                });
        }, 200);

    };

    re_set = function(condition){

        !condition &&
            preview_box
                .removeChild(_dom.map.main.src);

        inject
            .data(config.maker.output());

        engine.data.loop(_set)
            .run(function(func){
                func();
            });
    };

    re_set(true);
};