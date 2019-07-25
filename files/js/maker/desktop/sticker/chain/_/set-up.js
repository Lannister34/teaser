window.promo_set_up = function(engine, data){

    /* ------- preferences ------- */

    var _target = null;

    window._trigger = function(){
        window.open(_target, "_blank");
        engine.cmnd.set("traget_close");
    };

    var init = {};

    init.create = function(){

        this.items = [];
        this.init = null;
        this.timer = null;
        this.step = 0;

        this.reinit = function(){
            this.init = this.items[this.step].init;
        };

        this.update = function(){
            this.step = this.step === this.items.length - 1 ? 0
                : this.step + 1;
        };

        this.toggle = function(obj){

            var item = this.items[this.step],
                items = item.init.chain;

            engine.data.loop(obj)
                .run(function(state, name){
                    engine.css
                        .style(items[name], items[name].chain[state]);
                });
        }

        this.wait = function(delay, callback){
            this.timer = setTimeout(callback, delay * 1000);
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

                    });

                    _this.update();
                    _this.next();

                });

            });
        };
    };

    init.temp = {};

    init.temp.chain = function(name, item, index){

        _dom.map[name] = {
            "p" : "box",
            "a" : {
                "class" : "sub"
            },
            "s" : {
                "z-index" : index
            },
            "init" : {
                "text" : item["txt-duration"],
                "image" : item["img-duration"]
            }
        };

        /* txt */

        _dom.map[name + "-txt"] = {
            "p" : name,
            "a" : {
                "class" : "item-txt"
            },
        };

        _dom.map[name + "-txt-in"] = {
            "p" : name + "-txt",
            "a" : {
                "class" : "txt-in"
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
            "i" : item.txt,
            "s" : {
                "font-size" : item["txt-size"] + "em",
                "font-weight" : item["txt-weight"],
                "color" : "#" + item["txt-color"]
            }
        };

        /* bg */

        _dom.map[name + "-txt-bg"] = {
            "p" : name,
            "a" : {
                "class" : "item-bg"
            },
            "s" : {
                "background-color" : "#" + item["txt-background"]
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
            }
        };

        /* img */

        _dom.map[name + "-txt-img"] = {
            "p" : name,
            "a" : {
                "class" : "item-img sub"
            },
            "s" : {
                "background-color" : "#" + item["img-background"]
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
            }
        };

        _dom.map[name + "-txt-img-src"] = {
            "p" : name + "-txt-img",
            "a" : {
                "class" : "item-img-src sub"
            },
            "s" : {
                "background-image" : "url(" + item.img + ")",
                "background-position" : "center",
                "background-repeat" : "no-repeat",
                "background-size" : "auto 100%",
            }
        };

    };

    init.chain = new init.create();





    /* ------- css ------- */

    var _css = {};

    _css.rules = {

        "body" : {
            "margin" : 0,
            "padding" : 0,
            "overflow" : "hidden"
        },

        ".sub" : {
            "position" : "absolute",
            "width" : "100%", "height" : "100%",
            "top" : 0, "left" : 0
        },

        ".box" : {

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

        ".anim" : {
            "transition" : "opacity .7s .4s",
        },

        ".item-txt" : {
            "display" : "table",
            "position" : "absolute",
            "width" : "540px", "height" : "100%",
            "margin" : "0 auto",
            "right" : 0, "left" : 0,
            "text-align" : "center",
            "z-index" : 3,
            "animation" : "scale 3s infinite alternate"
        },

        ".txt-in" : {
            "display" : "table-cell",
            "vertical-align" : "middle",
            "transition" : "opacity .5s, transform .5s"
        },

        ".item-bg" : {
            "position" : "absolute",
            "right" : 0, "left" : 0,
            "top" : 0, "bottom" : 0,
            "margin" : "auto",
            "z-index" : 2,

            "transition" : "width .6s, height .6s, opacity .6s, transform .6s"
        },

        ".item-img" : {
            "z-index" : 1,
            "transition" : "opacity .6s, transform .6s",
            "will-change" : "opacity, transform"
        },

        ".item-img-src" : {
            "animation" : "scale 3s infinite alternate"
        },

        ".square" : {

            "position" : "absolute",
            "box-shadow" : "0px 0px 30px 0px rgba(0,0,0,.05)",
            "background-color" : "rgba(255,255,255,.07)",

            "animation" : "rotate ease-in-out infinite"
        },

        ".small-top, .small-bottom" : {
            "width" : "150px", "height" : "150px"
        },

        ".big-top, .big-bottom" : {
            "width" : "300px", "height" : "300px"
        },


        ".small-top" : {
            "left" : "-75px",
            "top" : "-75px",
            "z-index" : 1,
            "animation-duration" : "4s"
        },

        ".small-bottom" : {
            "right" : "-75px",
            "bottom" : "-75px",
            "z-index" : 1,
            "animation-duration" : "6s"
        },

        ".big-top" : {
            "right" : "-150px",
            "top" : "-150px",
            "z-index" : 2,
            "animation-duration" : "8s"
        },

        ".big-bottom" : {
            "left" : "-150px",
            "bottom" : "-150px",
            "z-index" : 2,
            "animation-duration" : "10s"
        }
    };

    data.button.condition &&
        engine.data.assign({

            ".button-box" : {
                "display" : "table",
                "text-align" : "center",
                "background-color" : "rgba(0,0,0,0)",

                "transition" : "background-color .4s"
            },

            ".button-box-in" : {
                "display" : "table-cell",
                "vertical-align" : "middle",

                "opacity" : 0,
                "transform" : "scale(1.3)",

                "transition" : "opacity .4s, transform .4s"
            },

            ".button" : {
                "padding" : "15px 25px",
                "background-color" : "#" + data.button.background,
                "color" : "#" + data.button.color,
                "border-radius" : "4px",
                "box-shadow" : "0px 10px 30px 0px rgba(0,0,0,.2)",
                "transition" : "color .3s, background-color .3s"
            },

            ".box:hover > .button-box" : {
                "background-color" : "rgba(0,0,0,.5)"
            },

            ".box:hover > .button-box > .button-box-in" : {
                "opacity" : 1,
                "transform" : "scale(1)"
            },

            ".button:hover" : {
                "background-color" : "#" + data.button["hover-background"],
                "color" : "#" + data.button["hover-color"]
            }

        }, _css.rules);

    _css.animations = {
        "scale" : {
            "from" : {
                "transform" : "scale(1)"
            },
            "to" : {
                "transform" : "scale(1.1)"
            }
        },

        "rotate" : {
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
            ".box" : {
                "font-size" : "15px"
            }
        }
    }

    /* ------- dom ------- */


    var _dom = {};

    _dom.map = {

        /* css ------- */

        "rules" : {
            "n" : "style",
            "p" : document.head,
            "a" : {
                "data-rules" : ""
            },
            "set-css" : function(){
                engine.css
                    .rule(this.src, _css.rules);
            }
        },

        "animations" : {
            "n" : "style",
            "p" : document.head,
            "a" : {
                "data-animations" : ""
            },
            "set-css" : function(){
                engine.css
                    .animation(this.src, _css.animations);
            }
        },

        "media" : {
            "n" : "style",
            "p" : document.head,
            "a" : {
                "data-media" : ""
            },
            "set-css" : function(){
                engine.css
                    .media(this.src, _css.media);
            }
        },



        /* main ------- */

        "main" : {
            "a" : {
                "class" : "box sub",
                "onclick" : "_trigger();"
            },
        },

        "box" : {
            "p" : "main",
            "a" : {
                "class" : "sub"
            },
            "s" : {
                "z-index" : 1
            }
        },

        "anim" : {
            "p" : "main",
            "a" : {
                "class" : "anim sub"
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
                    "class" : "button-box sub"
                },
                "s" : {
                    "z-index" : 3,
                }
            },

            "button-box-in" : {
                "p" : "button-box",
                "a" : {
                    "class" : "button-box-in"
                }
            },

            "button" : {
                "n" : "span",
                "p" : "button-box-in",
                "a" : {
                    "class" : "button"
                },
                "i" : data.button.content,
                "s" : {
                    "font-weight" :  data.button.weight,
                    "font-size" : data.button.size + "em"
                }
            }

        }, _dom.map);

    engine.data.loop([

        "top" , "bottom"

    ]).run(function(item){

        _dom.map["square-small-" + item] = {
            "p" : "anim",
            "a" : {
                "class" : "square small-" + item
            }
        },

        _dom.map["square-big-" + item] = {
            "p" : "anim",
            "a" : {
                "class" : "square big-" + item
            }
        }

    });

    engine.data.loop(data.chain)
        .run(function(item, index, arr){
            init.temp.chain("chain-" + index, item, arr.length - index);
        });



    /* ------- build ------- */

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

            /* node parent */
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

    console.log(_dom.map);

    /* ------- set ------- */

    _set = function(url){

        _target = url;

        document.body
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

    _set("all-fine");

    /*engine.cmnd.get("url", _set);
    engine.cmnd.send("ready");*/
};