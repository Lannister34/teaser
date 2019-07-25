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

        var obj = _dom.map[name];

        obj && (function(){

            "style-init" in obj &&
                engine.css.style(obj.src, obj["style-init"](item));

            "content-init" in obj &&
                (obj.src.innerHTML = obj["content-init"](item));

            "attr-init" in obj &&
                obj["attr-init"](item);

            "chain-parent" in obj &&
                engine.data.loop(obj["chain-parent"])
                    .run(function(child){
                        "style-init" in child &&
                            engine.css
                                .style(child.src, child["style-init"](item));
                    });

        })();
    };

    inject.all = function(){
        engine.data.loop(data)
            .run(function(row, name){
                Array.isArray(row) ?
                    engine.data.loop(row)
                        .run(function(item, index){
                            Array.isArray(item) ?
                                engine.data.loop(item)
                                    .run(function(in_item, in_index){
                                        inject.obj(name + "#" + index + "#" + in_index, in_item);
                                })
                                : inject.obj(name + "#" + index, item);
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
        _dom.map[name] = {
            "p" : "img-in",
            "a" : {
                "class" : "--prm--img-item",
            },
            "style-init" : function(e){
                return {
                    "background-image" : "url(" + e + ")",
                    "background-repeat" : "no-repeat",
                    "background-position" : "center",
                    "background-size" : "cover"
                }
            },
            "init" : "images"
        };
    };

    init.temp.texts = function(name, item){
        
        _dom.map[name + "-box"] = {
            "p" : "message-box",
            "a" : {
                "class" : "--prm--message-item"
            },
            "init" : "texts"
        };

        _dom.map[name + "-box-in"] = {
            "n" : "div",
            "p" : name + "-box",
        };

        engine.data.loop(item)
            .run(function(txt, i, arr){
                _dom.map[name + "#" + i] = {

                    "n" : "span",
                    "p" : name + "-box-in",

                    "s" : {
                        "margin-bottom" : i === arr.length - 1 ? 0 : "2px"
                    },

                    "content-init" : function(e){
                        return e.content;
                    },

                    "style-init" : function(e){
                        return {
                            "color" : "#" + e.color,
                            "font-size" : e.size + "em",
                            "font-weight" : e.weight,
                        };
                    }
                };
            });

    };

    _set.inits = function(){

        init.texts = new init.create(data["text-duration"], {
            "opacity" : 1, 
            "transform" : "translateX(0)"
        }, {
            "opacity" : 0, 
            "transform" : "translateX(30%)"
        });

        init.images = new init.create(data["image-duration"], {
            "opacity" : 1, 
            "transform" : "scale(1)"
        }, {
            "opacity" : 0, 
            "transform" : "scale(1.2)"
        });

    };





    /* ------- css ------- */

    _set.css = function(){

        _css.rules = {

            ".--prm--sub" : {
                "position" : "absolute",
                "width" : "100%", "height" : "100%",
                "top" : 0, "left" : 0,
                "transform" : "translateZ(0)",
                "overflow" : "hidden"
            },

            ".--prm--box" : {

                "font-family" : "sans-serif",
                "font-size" : "16px",
                "text-size-adjust" : "100%",
                "border-radius" : "22px",
                "text-decoration" : "none",

                "user-select" : "none",
                "-webkit-touch-callout" : "none"
            },

            ".--prm--img" : {
                 "position" : "absolute",
                 "width" : "43%", "height" : "100%",
                 "top" : 0, "right" : "20%",
                 "transition" : "opacity .6s .5s, transform .6s .5s"
            },

            ".--prm--img > div" : {
                 "position" : "absolute",
                 "width" : "100%", "height" : "100%",
                 "top" : 0, "left" : 0,
                 "transition" : "transform .5s"
            },

            ".--prm--box:hover > .--prm--sub > .--prm--img > div" : {
                "transform" : "scale(1.1)"
            },

            ".--prm--img-item" : {
                "position" : "absolute",
                "width" : "100%", "height" : "100%",
                "top" : 0, "left" : 0,

                "transition" : "opacity .4s, transform .4s"
            },

            ".--prm--right, .--prm--left" : {
                "position" : "absolute",
                "height" : "100%",
                "top" : 0
            },

            ".--prm--left" : {
                "width" : "40%",
                "left" : 0
            },

            ".--prm--right" : {
                "width" : "25%",
                "right" : 0
            },

            ".--prm--shape-in" : {
                "position" : "absolute",
                "width": "120%", "height" : "100%",
                "top" : 0,
                "transform": "skewX(-15deg)"
            },

            ".--prm--message" : {
                "position" : "absolute",
                "width" : "35%", "height" : "100%",
                "top" : 0, "left" : 0,

                "transition" : "opacity .6s .4s, transform .6s .4s"
            },

            ".--prm--message-item" : {
                "position" : "absolute",
                "display" : "table",
                "width" : "100%", "height" : "100%",
                "top" : 0, "left" : 0,

                "transition" : "opacity .4s, transform .4s"
            },

            ".--prm--message-item > div" : {
                "display" : "table-cell",
                "vertical-align" : "middle",
                "padding-left" : "40px"
            },

            ".--prm--message-item > div > span" : {
                "display" : "block"
            },

            ".--prm--button-box" : {
                "position" : "absolute",
                "display" : "table",
                "height" : "100%",
                "bottom" : 0, "right" : 0,
                "transform" : "translateZ(0)"
            },

            ".--prm--button-box > div" : {
                "max-width" : "100%",
                "display" : "table-cell",
                "vertical-align" : "middle"
            },

            ".--prm--button-sign" : {
                "white-space" : "nowrap",
                "margin-right" : "30px",
                "padding" : "15px 25px",
                "border-radius" : "26px",
                "cursor" : "pointer",

                "transition" : "opacity .6s .4s, color .3s, background-color .3s"
            },

            ".--prm--button-circles" : {
                "position" : "absolute",
                "width" : "62px", "height" : "16px",
                "right" : "20px"
            },

            ".--prm--button-circle" : {
                "position" : "absolute",
                "transition" : "opacity .5s, transform .5s, background-color 0.3s"
            },

            ".--prm--circle-1" : {
                "width": "16px", "height": "16px",
                "right": "0px", "top": "0px",
                "border-radius": "8px",
                "transition-delay": ".3s"
            },

            ".--prm--circle-2" : {
                "width": "12px", "height": "12px",
                "right": "0px", "left": "0px",
                "top": "0px", "bottom": "0px",
                "margin": "auto",
                "border-radius": "6px",
                "transition-delay": ".2s"
            },

            ".--prm--circle-3" : {
                "width": "8px", "height": "8px",
                "left": "6px", "top": "0px",
                "bottom": "0px",
                "margin": "auto 0px",
                "border-radius": "4px",
                "transition-delay": ".1s"
            },

        };

        _css.media = {

            "(max-width : 850px)" : {
                ".--prm--message-item > div" : {
                    "padding-left" : "20px"
                },
                ".--prm--button-sign" : {
                    "margin-right" : "20px",
                }
            },
            
            "(max-width : 780px)" : {
                ".--prm--box" : {
                    "font-size" : "14px"
                },
                ".--prm--button-circles" : {
                    "display" : "none"
                },
                ".--prm--right" : {
                    "display" : "none"
                },
                ".--prm--left" : {
                    "width" : "55%",
                },
                ".--prm--message" : {
                    "width" : "45%",
                },
                ".--prm--message-item > div" : {
                    "padding-left" : "40px"
                },
                ".--prm--img" : {
                    "width" : "50%",
                    "right" : "0"
                },
                ".--prm--button-sign" : {
                    "margin-right" : "15px",
                    "padding" : "12px 20px",
                    "box-shadow" : "0px 10px 20px 0px rgba(0,0,0,.3)"
                },
                ".--prm--button-box" : {
                    "height" : "48%",
                },
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

            "media" : {
                "p" : preview_box,
                "a" : {
                    "data-media" : ""
                },
                "set-css" : function(){
                    engine.css
                        .media(this.src, _css.media);
                }
            },
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



             /* img ------- */

             "img-box" : {
                "p" :"main",
                "a" : {
                    "class" : "--prm--sub"
                },
                "s" : {
                    "z-index" : 1
                }
             },

             "img" : {
                "p" : "img-box",
                "a" : {
                    "class" : "--prm--img"
                },
                "s" : {
                    "opacity" : 0,
                    "transform" : "scale(1.4)"
                },
                "r" : {
                    "opacity" : 1,
                    "transform" : "scale(1)"
                }
             },

             "img-in" : {
                "p" :"img"
             },



             /* background ------- */

             "background-box" : {
                "p" :"main",
                "a" : {
                    "class" : "--prm--sub"
                },
                "s" : {
                    "z-index" : 2
                }
             },

             "background-right" : {
                "p" :"background-box",
                "a" : {
                    "class" : "--prm--right"
                },
                "chain-parent" : {}
             },

             "background-left" : {
                "p" :"background-box",
                "a" : {
                    "class" : "--prm--left"
                },
                "chain-parent" : {}
             },

             /* content ------- */

             "content-box" : {
                "p" :"main",
                "a" : {
                    "class" : "--prm--sub"
                },
                "s" : {
                    "z-index" : 3
                }
             },

             "message-box" : {
                "p" : "content-box",
                "a" : {
                    "class" : "--prm--message"
                },
                "s" : {
                    "opacity" : 0,
                    "transform" : "translateX(30%)"
                },
                "r" : {
                    "opacity" : 1,
                    "transform" : "translateX(0)"
                }
             },

             "button-box" : {
                "p" : "content-box",
                "a" : {
                    "class" : "--prm--button-box"
                }
             },

             "button-box-in" : {
                "p" : "button-box",
             },

             "button" : {
                "n" : "span",
                "p" : "button-box-in",
                "a" : {
                    "class" : "--prm--button-sign",
                    "data-color" : "#ffffff"
                },
                "s" : {
                    "opacity" : 0
                },
                "r" : {
                    "opacity" : 1
                },

                "chain-parent" : {},

                "content-init" : function(e){
                    return e.content
                },

                "style-init" : function(e){
                    return {
                        "font-size" : e.size + "em",
                        "font-weight" : e.weight,
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

                    this.src.chain = this["chain-parent"];

                    this.src.onmouseover = function(){

                        var _this = this;

                        engine.css.style(this, {
                            "background-color" : _this.init["hover-background"],
                            "color" : _this.init["hover-color"],
                        });

                        engine.data.loop(this.chain)
                            .run(function(item){
                                engine.css.style(item.src, {
                                    "background-color" : _this.init["hover-background"],
                                })
                            });
                    };

                    this.src.onmouseout = function(){

                        var _this = this;

                        engine.css.style(this, {
                            "background-color" : _this.init["background"],
                            "color" : _this.init["color"],
                        });

                        engine.data.loop(this.chain)
                            .run(function(item){
                                engine.css.style(item.src, {
                                    "background-color" : _this.init["background"],
                                })
                            });
                    };

                }
             }
        };

        engine.data.loop([

            ["b", "m", "t"],
            ["b", "t"],
            ["top", "bottom"],
            ["images", "texts"]

        ]).run(function(arr, i){

                switch(i){

                    /* background left */

                    case 0 :
                        engine.data.loop(arr)
                            .run(function(id, index){
                                _dom.map["bg-left--" + id] = {

                                    "p" : "background-left",
                                    "a" : {
                                        "class" : "--prm--shape-in"
                                    },

                                    "s" : {
                                        "z-index" : index + 1,
                                        "right" : 112 + (index * 4) + "%",
                                        "opacity" : .33 * (index + 1),
                                        "transition" : "right .6s ." + (1 * index) + "s ease"
                                    },

                                    "style-init" : function(e){
                                        return {
                                            "background-color" : "#" + e,
                                        }
                                    },

                                    "r" : {
                                        "right" : -8 + (index * 4) + "%"
                                    },
                                    "chain-init" : "background-left"
                                };
                            });

                        break;


                    /* background right */

                    case 1 : 
                        engine.data.loop(arr)
                            .run(function(id, index){
                                _dom.map["bg-right--" + id] = {

                                    "p" : "background-right",
                                    "a" : {
                                        "class" : "--prm--shape-in"
                                    },

                                    "s" : {
                                        "z-index" : index + 1,
                                        "left" : 115 + (index * 5) + "%",
                                        "opacity" : .5 * (index + 1),
                                        "background-color" : "#" + data["background-right"],
                                        "transition" : "left .6s ." + (1 * index) + "s ease"
                                    },

                                    "style-init" : function(e){
                                        return {
                                            "background-color" : "#" + e,
                                        }
                                    },

                                    "r" : {
                                        "left" : -5 + (index * 5) + "%"
                                    },
                                    "chain-init" : "background-right"
                                };
                            });

                        break;


                    /* button-circles */

                    case 2 :
                        engine.data.loop(arr)
                            .run(function(pos){

                                var _name = "button-circles-" + pos;
                                var _pos = {};
                                _pos[pos] = "25px";

                                _dom.map[_name] = {
                                    "p" : "button-box-in",
                                    "a" : {
                                        "class" : "--prm--button-circles"
                                    },
                                    "s" : _pos
                                };

                                engine.data.loop([1, 2, 3])
                                    .run(function(circ, i){
                                        var __name = pos + "-circle-" + i;
                                        _dom.map[__name] = {
                                            "p" : _name,
                                            "a" : {
                                                "class" : "--prm--button-circle --prm--circle-" + circ
                                            },

                                            "s" : {
                                                "opacity" : 0,
                                                "transform" : "scale(2)"
                                            },

                                            "r" : {
                                                "opacity" : 1,
                                                "transform" : "scale(1)"
                                            },

                                            "style-init" : function(e){
                                                return {
                                                    "background-color" : "#" + e.background
                                                }
                                            },

                                            "chain-init" : "button"
                                        }

                                    });
                                });

                        break;


                    /* images & texts */

                    case 3 :
                        engine.data.loop(arr)
                            .run(function(list){
                                engine.data.loop(data[list])
                                    .run(function(item, i){
                                        var name = list + "#" + i;
                                        init.temp[list](name, item);
                                    });
                            });
                }

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
                    node.src.appendChild(document.createTextNode(node.i));

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

                /* init */
                "init" in node &&
                    init[node.init].n.push(node.src);

                /* css sheet inject */
                "set-css" in node &&
                    node["set-css"]();

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
                    engine.data.loop(["images", "texts"])
                            .run(function(prop){
                                init[prop].toggle();
                            });
                });

        preview_box
            .appendChild(_dom.map.main.src);

        engine.data.loop(["images", "texts"])
            .run(function(prop){
                init[prop].r();
            });

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
            (preview_box.innerHTML = "");

        inject
            .data(config.maker.output());

        engine.data.loop(_set)
            .run(function(func){
                func();
            });
    };

    re_set(true);
};