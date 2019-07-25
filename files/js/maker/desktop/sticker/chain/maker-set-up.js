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
            inject.edit(props.name, props.data);
        });

    config.maker
        .init(function(){
            re_set(false);
        });




    /* --------------------------- */

    inject.data = function(_data){
        data = _data;
    };

    inject.obj = function(obj, item){

        "style-init" in obj &&
            engine.css.style(obj.src, obj["style-init"](item));

        "content-init" in obj &&
            (obj.src.innerHTML = obj["content-init"](item));

        "attr-init" in obj &&
                obj["attr-init"](item);

    };

    inject.edit = function(name, props){

        "chain-parent" in _dom.map[name] ?

            engine.data.loop(_dom.map[name]["chain-parent"])
                .run(function(obj){
                    inject.obj(obj, props);
                })

            : inject.obj(_dom.map[name], props);

    };

    inject.all = function(){

        engine.data.loop(data)
            .run(function(row, name){

                Array.isArray(row) ?

                    engine.data.loop(row)
                        .run(function(item, index){

                            engine.data.loop(_dom.map[name + "#" + index]["chain-parent"])
                                .run(function(obj){

                                    inject.obj(obj, item);

                                });

                        })

                    : name in _dom.map &&
                        inject.obj(_dom.map[name], row);
            });
    };




    /* --------------------------- */

    init.create = function(){

        this.items = [];
        this.init = null;
        this.timer = null;
        this.step = 0;

        this.stop = false;
        this.run = null;

        this.change = function(){

            var _this = this;

            this.stop ?
                this.stop = false
                    : this.stop = true;

            !this.stop &&
                this.run &&
                    (function(){
                        _this.run();
                        _this.run = null;
                    })()

        };

        this.check = function(callback){

            !this.stop ?
                callback()
                    : this.run = callback;

        };

        this.reinit = function(){
            this.init = this.items[this.step].init;
        };

        this.update = function(){
            this.step = this.step === this.items.length - 1 ? 0
                : this.step + 1;
        };

        this.toggle = function(obj, callback){
            var _this = this,
                _callback = callback || null;

            this.check(function(){
                var item = _this.items[_this.step],
                    items = item.init.chain;

                engine.data.loop(obj)
                    .run(function(state, name){
                        engine.css
                            .style(items[name], items[name].chain[state]);
                    });

                _callback &&
                    _callback();
            });
        }

        this.wait = function(delay, callback){
            this.timer =
                setTimeout(callback, delay * 1000);
        };

        this.next = function(){

            var _this = this;
            this.reinit();

            this.toggle({

                "txt"   :   "end",
                "bg"    :   "end"

            });

            this.wait(this.init.text, function(){

                _this.toggle({

                    "txt"   :   "start",
                    "bg"    :   "start",
                    "img"   :   "end"

                });

                _this.wait(_this.init.image, function(){

                    _this.toggle({

                        "img"   :   "start"

                    }, function(){
                        _this.update();
                        _this.next();
                    });

                });

            });
        };
    };

    init.temp = {};

    init.temp.chain = function(name, item, index){

        _dom.map[name] = {
            "p" : "box",
            "a" : {
                "class" : "--prm--sub"
            },
            "s" : {
                "z-index" : index
            },
            "init" : {
                "text" : item["txt-duration"],
                "image" : item["img-duration"]
            },
            "chain-parent" : {}
        };

        /* txt */

        _dom.map[name + "-txt"] = {
            "p" : name,
            "a" : {
                "class" : "--prm--item-txt"
            },
        };

        _dom.map[name + "-txt-in"] = {
            "p" : name + "-txt",
            "a" : {
                "class" : "--prm--txt-in"
            },
            "chain" : {
                "class" : "txt",
                "parent" : name,

                "start" : {
                    "opacity" : 0,
                    "transform" : "translateY(20%)"
                },

                "end" : {
                    "opacity" : 1,
                    "transform" : "translateY(0)"
                },
            }
        };

        _dom.map[name + "-txt-content"] = {
            "n" : "span",
            "p" : name + "-txt-in",

            "content-init" : function(e){
                return e.txt;
            },

            "style-init" : function(e){
                return {
                    "font-size" : e["txt-size"] + "em",
                    "font-weight" : e["txt-weight"],
                    "color" : "#" + e["txt-color"]
                }
            },

            "chain-init" : name
        };

        /* bg */

        _dom.map[name + "-txt-bg"] = {
            "p" : name,
            "a" : {
                "class" : "--prm--item-bg"
            },
            "style-init" : function(e){
                return {
                    "background-color" : "#" + e["txt-background"]
                }
            },
            "chain" : {
                "class" : "bg",
                "parent" : name,

                "start" : {
                    "width" : 0,
                    "opacity" : 0
                },

                "end" : {
                    "width" : "100%",
                    "opacity" : 1
                },
            },
            "chain-init" : name
        };

        /* img */

        _dom.map[name + "-txt-img"] = {
            "p" : name,
            "a" : {
                "class" : "--prm--item-img --prm--sub"
            },
            "style-init" : function(e){
                return {
                    "background-color" : "#" + e["img-background"]
                }
            },

            "chain" : {
                "class" : "img",
                "parent" : name,

                "start" : {
                    "opacity" : 0,
                    "transform" : "scale(1.2)"
                },

                "end" : {
                    "opacity" : 1,
                    "transform" : "scale(1)"
                },
            },
            "chain-init" : name
        };

        _dom.map[name + "-txt-img-src"] = {
            "p" : name + "-txt-img",
            "a" : {
                "class" : "--prm--item-img-src --prm--sub"
            },
            "style-init" : function(e){
                return {
                    "background-image" : "url(" + e.img + ")",
                    "background-position" : "center",
                    "background-repeat" : "no-repeat",
                    "background-size" : "auto 100%",
                }
            },
            "chain-init" : name
        };

    };

    _set.init = function(){
        init.chain = null;
        init.chain = new init.create();
    };

    /* ------- css ------- */

    _set.css = function(){

        _css.rules = {

            ".--prm--sub" : {
                "position" : "absolute",
                "width" : "100%", "height" : "100%",
                "top" : 0, "left" : 0
            },

            ".--prm--box" : {

                "font-family" : "sans-serif",
                "font-size" : "17px",
                "text-size-adjust" : "100%",

                "border-radius" : "22px",
                "text-decoration" : "none",

                "cursor" : "pointer",

                "user-select" : "none",
                "-webkit-touch-callout" : "none",

                "overflow" : "hidden"
            },

            ".--prm--anim" : {
                "transition" : "opacity .7s .4s",
            },

            ".--prm--item-txt" : {
                "display" : "table",
                "position" : "absolute",
                "width" : "540px", "height" : "100%",
                "margin" : "0 auto",
                "right" : 0, "left" : 0,
                "text-align" : "center",
                "z-index" : 3,
                "animation" : "--prm--scale 3s infinite alternate"
            },

            ".--prm--txt-in" : {
                "display" : "table-cell",
                "vertical-align" : "middle",
                "transition" : "opacity .5s, transform .5s"
            },

            ".--prm--txt-in > span" : {
                "display" : "block"
            },

            ".--prm--item-bg" : {
                "position" : "absolute",
                "right" : 0, "left" : 0,
                "top" : 0, "bottom" : 0,
                "margin" : "auto",
                "z-index" : 2,

                "transition" : "width .6s, height .6s, opacity .6s, transform .6s"
            },

            ".--prm--item-img" : {
                "z-index" : 1,
                "transition" : "opacity .6s, transform .6s",
                "will-change" : "opacity, transform"
            },

            ".--prm--item-img-src" : {
                "animation" : "--prm--scale 3s infinite alternate"
            },

            ".--prm--square" : {

                "position" : "absolute",
                "box-shadow" : "0px 0px 30px 0px rgba(0,0,0,.05)",
                "background-color" : "rgba(255,255,255,.07)",

                "animation" : "--prm--rotate ease-in-out infinite"
            },

            ".--prm--small-top, .--prm--small-bottom" : {
                "width" : "150px", "height" : "150px"
            },

            ".--prm--big-top, .--prm--big-bottom" : {
                "width" : "300px", "height" : "300px"
            },


            ".--prm--small-top" : {
                "left" : "-75px",
                "top" : "-75px",
                "z-index" : 1,
                "animation-duration" : "4s"
            },

            ".--prm--small-bottom" : {
                "right" : "-75px",
                "bottom" : "-75px",
                "z-index" : 1,
                "animation-duration" : "6s"
            },

            ".--prm--big-top" : {
                "right" : "-150px",
                "top" : "-150px",
                "z-index" : 2,
                "animation-duration" : "8s"
            },

            ".--prm--big-bottom" : {
                "left" : "-150px",
                "bottom" : "-150px",
                "z-index" : 2,
                "animation-duration" : "10s"
            }
        };

        data.button.condition &&
            engine.data.assign({

                ".--prm--button-box" : {
                    "display" : "table",
                    "text-align" : "center",
                    "background-color" : "rgba(0,0,0,0)",

                    "transition" : "background-color .4s"
                },

                ".--prm--button-box-in" : {
                    "display" : "table-cell",
                    "vertical-align" : "middle",

                    "opacity" : 0,
                    "transform" : "scale(1.3)",

                    "transition" : "opacity .4s, transform .4s"
                },

                ".--prm--button" : {
                    "padding" : "15px 25px",
                    "border-radius" : "4px",
                    "box-shadow" : "0px 10px 30px 0px rgba(0,0,0,.2)",
                    "transition" : "color .5s, background-color .5s"
                },

                ".--prm--box:hover > .--prm--button-box" : {
                    "background-color" : "rgba(0,0,0,.5)"
                },

                ".--prm--box:hover > .--prm--button-box > .--prm--button-box-in" : {
                    "opacity" : 1,
                    "transform" : "scale(1)"
                }

            }, _css.rules);

        _css.animations = {
            "--prm--scale" : {
                "from" : {
                    "transform" : "scale(1)"
                },
                "to" : {
                    "transform" : "scale(1.1)"
                }
            },

            "--prm--rotate" : {
                "from" : {
                    "transform" : "rotate(45deg)"
                },
                "to" : {
                    "transform" : "rotate(225deg)"
                }
            }
        };

        _css.media = {
            "(max-width : 750px)" : {
                ".--prm--box" : {
                    "font-size" : "15px"
                }
            }
        };

        _css.map = {

            "rules" : {
                "p" : preview_box,
                "a" : {
                    "data-rules" : ""
                },
                "set-css" : function(){
                    engine.css
                        .rule(this.src, _css.rules);
                }
            },

            "animations" : {
                "p" : preview_box,
                "a" : {
                    "data-animations" : ""
                },
                "set-css" : function(){
                    engine.css
                        .animation(this.src, _css.animations);
                }
            },

            "media" : {
                "p" : preview_box,
                "a" : {
                    "data-media" : ""
                },
                "set-css" : function(){
                    engine.css
                        .media(this.src, _css.media);
                }
            }

        };

        engine.data.loop(_css.map)
            .run(function(node){

                /* node src */
                node.src = document.createElement("style");

                /* attributes */
                "a" in node &&
                    engine.data.loop(node.a)
                        .run(function(property, attr){
                            node.src.setAttribute(attr, property);
                        });

                "p" in node &&
                    (function(){
                        typeof node.p === "string" ?
                            map[node.p].src.appendChild(node.src)
                                : node.p.appendChild(node.src);
                    })();

                /* css sheet inject */
                "set-css" in node &&
                    node["set-css"]();
            });

    };

    /* ------- dom ------- */

    _set.dom = function(){

        _dom.map = {

            /* main ------- */

            "main" : {
                "a" : {
                    "class" : "--prm--box --prm--sub"
                },
            },

            "box" : {
                "p" : "main",
                "a" : {
                    "class" : "--prm--sub"
                },
                "s" : {
                    "z-index" : 1
                }
            },

            "anim" : {
                "p" : "main",
                "a" : {
                    "class" : "--prm--anim --prm--sub"
                },
                "s" : {
                    "z-index" : 2,
                    "opacity" : 0
                },
                "r" : {
                    "opacity" : 1
                }
            }

        };

        data.button.condition &&
            engine.data.assign({

                "button-box" : {
                    "p" : "main",

                    "a" : {
                        "class" : "--prm--button-box --prm--sub"
                    },

                    "s" : {
                        "z-index" : 3,
                    }
                },

                "button-box-in" : {
                    "p" : "button-box",

                    "a" : {
                        "class" : "--prm--button-box-in"
                    }
                },

                "button" : {
                    "n" : "span",
                    "p" : "button-box-in",

                    "a" : {
                        "class" : "--prm--button"
                    },

                    "content-init" : function(e){
                        return e.content;
                    },

                    "style-init" : function(e){
                        return {
                            "font-weight" :  e.weight,
                            "font-size" : e.size + "em",
                            "background-color" : "#" + e["background"],
                            "color" : "#" + e["color"]
                        }
                    },

                    "attr-init" : function(e){

                        this.src.init = {
                            "background" : "#" + e.background,
                            "color" : "#" + e.color,
                            "hover-background" : "#" + e["hover-background"],
                            "hover-color" : "#" + e["hover-color"]
                        };
                    },

                    "func" : function(){

                        this.src.onmouseover = function(){
                            var _this = this;
                            engine.css.style(this, {
                                "background-color" : _this.init["hover-background"],
                                "color" : _this.init["hover-color"],
                            });
                        };

                        this.src.onmouseout = function(){
                            var _this = this;
                            engine.css.style(this, {
                                "background-color" : _this.init["background"],
                                "color" : _this.init["color"],
                            });
                        };

                    }
                }

            }, _dom.map);

        engine.data.loop([

            "top" , "bottom"

        ]).run(function(item){

            _dom.map["square-small-" + item] = {
                "p" : "anim",
                "a" : {
                    "class" : "--prm--square --prm--small-" + item
                }
            },

            _dom.map["square-big-" + item] = {
                "p" : "anim",
                "a" : {
                    "class" : "--prm--square --prm--big-" + item
                }
            }

        });

        engine.data.loop(data.chain)
            .run(function(item, index, arr){
                init.temp.chain("chain#" + index, item, arr.length - index);
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

                /* content */
                "i" in node &&
                    (node.src.innerHTML = node.i)

                /* init */
                "init" in node &&
                    (function(){
                        node.init.chain = {};
                        init.chain.items.push(node);
                    })();

                /* chain */
                "chain" in node &&
                    (function(){
                        node.src.chain = node.chain;
                        map[node.chain.parent].init.chain[node.chain.class] = node.src;
                        engine.css
                            .style(node.src, node.chain.start);
                    })();

                /* chain-init */
                "chain-init" in node &&
                    (map[node["chain-init"]]["chain-parent"][name] = node);


                /* func */
                "func" in node &&
                    node.func();

                /* node parent */
                "p" in node &&
                    (function(){
                        typeof node.p === "string" ?
                            map[node.p].src.appendChild(node.src)
                                : node.p.appendChild(node.src);
                    })();

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
                    init.chain.change();
                });

        preview_box
            .appendChild(_dom.map.main.src);

        setTimeout(function(){

            engine.data.loop(_dom.map)
                .run(function(node){
                    "r" in node &&
                        engine.css.style(node.src, node.r);
                });

            init.chain.next();

        }, 200);

    };

    re_set = function(condition){

        !condition &&
            (preview_box.innerHTML = "");

        inject
            .data(config.maker.output());

        engine.data.loop(_set)
            .run(function(func){
                func(condition);
            });
    };

    re_set(true);

};