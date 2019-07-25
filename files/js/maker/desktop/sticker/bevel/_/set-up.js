window.promo_set_up = function(engine, data){

    /* ------- preferences ------- */

    var _target = null;

    window._trigger = function(){
        window.open(_target, "_blank");
        engine.cmnd.set("traget_close");
    };

    var init = {};

    init.create = function(d, a, r){

        this.n = [];
        this.d = d * 1000;
        this.s = 1;

        this.f = function(list, index){
            engine.data.loop(list)
                .run(function(node, i){
                    i === index ? 
                        engine.css.style(node, a)
                            : engine.css.style(node, r);
                });
        };

        this.r = function(){
            var m = this;
            m.n.length > 0 && (function(){
                m.f(m.n, 0);
                m.n.length > 1 && (function(){
                    m.i = setInterval(function(){
                        m.f(m.n, m.s);
                        m.s = m.s === m.n.length - 1 ? 0 : m.s + 1;
                    }, m.d);
                })();
            })();
        };
    };

    init.page = function(){
        var params = {};
        engine.data.loop(["device", "scale", "size"])
            .run(function(option){
                params[option] =
                    engine.page[option]();
            });
        return params;
    };

    init.temp = {};

    init.temp.images = function(name, item){
        _dom.map[name] = {
            "p" : "img-in",
            "a" : {
                "class" : "img-item",
            },
            "s" : {
                "background-image" : "url(" + item + ")",
                "background-repeat" : "no-repeat",
                "background-position" : "center",
                "background-size" : "cover"
            },
            "init" : "images"
        };
    };

    init.temp.texts = function(name, item){
        
        _dom.map[name] = {
            "p" : "message-box",
            "a" : {
                "class" : "message-item"
            },
            "init" : "texts"
        };

        _dom.map[name + "--in"] = {
            "n" : "div",
            "p" : name,
        };

        engine.data.loop(item)
            .run(function(txt, i, arr){
                _dom.map[name + "--in" + "#" + i] = {
                    "n" : "span",
                    "p" : name + "--in",
                    "i" : txt.content,
                    "s" : {
                        "color" : "#" + txt.color,
                        "font-size" : txt.size + "em",
                        "font-weight" : txt.weight,
                        "margin-bottom" : i === arr.length - 1 ? 0 : "2px"
                    }
                };
            });

    };

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





    /* ------- css ------- */

    var _css = {};

    _css.rules = {

        "body" : {
            "margin" : 0,
            "padding" : 0,
            "overflow" : "hidden"
        },

        "*" : {
          "-webkit-font-smoothing" : "antialiased",
          "-moz-osx-font-smoothing" : "grayscale"
        },

        ".sub" : {
            "position" : "absolute",
            "width" : "100%", "height" : "100%",
            "top" : 0, "left" : 0,
            "transform" : "translateZ(0)",
            "overflow" : "hidden"
        },

        ".box" : {

            "font-family" : "sans-serif",
            "text-size-adjust" : "100%",
            "border-radius" : "22px",
            "text-decoration" : "none",

            "user-select" : "none",
            "-webkit-touch-callout" : "none"
        },

        ".img" : {
             "position" : "absolute",
             "width" : "43%", "height" : "100%",
             "top" : 0, "right" : "20%",
             "transition" : "opacity .6s .5s, transform .6s .5s"
        },

        ".img > div" : {
             "position" : "absolute",
             "width" : "100%", "height" : "100%",
             "top" : 0, "left" : 0,
             "transition" : "transform .5s"
        },

        ".box:hover > .sub > .img > div" : {
            "transform" : "scale(1.1)"
        },

        ".img-item" : {
            "position" : "absolute",
            "width" : "100%", "height" : "100%",
            "top" : 0, "left" : 0,

            "transition" : "opacity .4s, transform .4s"
        },

        ".right, .left" : {
            "position" : "absolute",
            "height" : "100%",
            "top" : 0
        },

        ".left" : {
            "width" : "40%",
            "left" : 0
        },

        ".right" : {
            "width" : "25%",
            "right" : 0
        },

        ".shape-in" : {
            "position" : "absolute",
            "width": "120%", "height" : "100%",
            "top" : 0,
            "transform": "skewX(-15deg)"
        },

        ".message" : {
            "position" : "absolute",
            "width" : "35%", "height" : "100%",
            "top" : 0, "left" : 0,

            "transition" : "opacity .6s .4s, transform .6s .4s"
        },

        ".message-item" : {
            "position" : "absolute",
            "display" : "table",
            "width" : "100%", "height" : "100%",
            "top" : 0, "left" : 0,

            "transition" : "opacity .4s, transform .4s"
        },

        ".message-item > div" : {
            "display" : "table-cell",
            "vertical-align" : "middle",
            "padding-left" : "40px"
        },

        ".message-item > div > span" : {
            "display" : "block"
        },

        ".button-box" : {
            "position" : "absolute",
            "display" : "table",
            "height" : "100%",
            "bottom" : 0, "right" : 0,
            "transform" : "translateZ(0)"
        },

        ".button-box > div" : {
            "max-width" : "100%",
            "display" : "table-cell",
            "vertical-align" : "middle"
        },

        ".button-sign" : {
            "white-space" : "nowrap",
            "margin-right" : "30px",
            "color" : "#" + data.button.color,
            "background-color" : "#" + data.button.background,
            "padding" : "15px 25px",
            "border-radius" : "26px",
            "cursor" : "pointer",

            "transition" : "opacity .6s .4s, color .3s, background-color .3s"
        },

        ".button-circles" : {
            "position" : "absolute",
            "width" : "62px", "height" : "16px",
            "right" : "20px"
        },

        ".button-circle" : {
            "position" : "absolute",
            "background-color" : "#" + data.button.background,
            "transition" : "opacity .5s, transform .5s, background-color 0.3s"
        },

        ".button-sign:hover" : {
            "color" : "#" + data.button["hover-color"],
            "background-color" : "#" + data.button["hover-background"]
        },

        ".button-sign:hover + .button-circles > .button-circle, .button-sign:hover + .button-circles + .button-circles > .button-circle" : {
            "background-color" : "#" + data.button["hover-background"]
        },

        ".circle-1" : {
            "width": "16px", "height": "16px",
            "right": "0px", "top": "0px",
            "border-radius": "8px",
            "transition-delay": ".3s"
        },

        ".circle-2" : {
            "width": "12px", "height": "12px",
            "right": "0px", "left": "0px",
            "top": "0px", "bottom": "0px",
            "margin": "auto",
            "border-radius": "6px",
            "transition-delay": ".2s"
        },

        ".circle-3" : {
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
            ".message-item > div" : {
                "padding-left" : "20px"
            },
            ".button-sign" : {
                "margin-right" : "20px",
            }
        },
        
        "(max-width : 780px)" : {
            "body" : {
                "font-size" : "14px"
            },
            ".button-circles" : {
                "display" : "none"
            },
            ".right" : {
                "display" : "none"
            },
            ".left" : {
                "width" : "55%",
            },
            ".message" : {
                "width" : "45%",
            },
            ".message-item > div" : {
                "padding-left" : "40px"
            },
            ".img" : {
                "width" : "50%",
                "right" : "0"
            },
            ".button-sign" : {
                "margin-right" : "15px",
                "padding" : "12px 20px",
                "box-shadow" : "0px 10px 20px 0px rgba(0,0,0,.3)"
            },
            ".button-box" : {
                "height" : "48%",
            },
        }
    };



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



         /* img ------- */

         "img-box" : {
            "p" :"main",
            "a" : {
                "class" : "sub"
            },
            "s" : {
                "z-index" : 1
            }
         },

         "img" : {
            "p" : "img-box",
            "a" : {
                "class" : "img"
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
                "class" : "sub"
            },
            "s" : {
                "z-index" : 2
            }
         },

         "right" : {
            "p" :"background-box",
            "a" : {
                "class" : "right"
            }
         },

         "left" : {
            "p" :"background-box",
            "a" : {
                "class" : "left"
            }
         },

         /* content ------- */

         "content-box" : {
            "p" :"main",
            "a" : {
                "class" : "sub"
            },
            "s" : {
                "z-index" : 3
            }
         },

         "message-box" : {
            "p" : "content-box",
            "a" : {
                "class" : "message"
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
                "class" : "button-box"
            }
         },

         "button-box-in" : {
            "p" : "button-box",
         },

         "button-sign" : {
            "n" : "span",
            "p" : "button-box-in",
            "a" : {
                "class" : "button-sign btn-color",
                "data-color" : "#ffffff"
            },
            "i" : data.button.content,
            "s" : {
                "font-size" : data.button.size + "em",
                "font-weight" : data.button.weight,
                "opacity" : 0
            },
            "r" : {
                "opacity" : 1
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

                                "p" : "left",
                                "a" : {
                                    "class" : "shape-in left-color"
                                },

                                "s" : {
                                    "z-index" : index + 1,
                                    "right" : 112 + (index * 4) + "%",
                                    "opacity" : .33 * (index + 1),
                                    "background-color" : "#" + data["background-left"],
                                    "transition" : "right .6s ." + (1 * index) + "s ease"
                                },

                                "r" : {
                                    "right" : -8 + (index * 4) + "%"
                                }
                            };
                        });

                    break;


                /* background right */

                case 1 : 
                    engine.data.loop(arr)
                        .run(function(id, index){
                            _dom.map["bg-right--" + id] = {

                                "p" : "right",
                                "a" : {
                                    "class" : "shape-in right-color"
                                },

                                "s" : {
                                    "z-index" : index + 1,
                                    "left" : 115 + (index * 5) + "%",
                                    "opacity" : .5 * (index + 1),
                                    "background-color" : "#" + data["background-right"],
                                    "transition" : "left .6s ." + (1 * index) + "s ease"
                                },

                                "r" : {
                                    "left" : -5 + (index * 5) + "%"
                                }
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
                                    "class" : "button-circles"
                                },
                                "s" : _pos
                            };

                            engine.data.loop([1, 2, 3])
                                .run(function(circ, i){
                                    var __name = pos + "-circle-" + i;
                                    _dom.map[__name] = {
                                        "p" : _name,
                                        "a" : {
                                            "class" : "button-circle circle-" + circ
                                        },

                                        "s" : {
                                            "opacity" : 0,
                                            "transform" : "scale(2)"
                                        },

                                        "r" : {
                                            "opacity" : 1,
                                            "transform" : "scale(1)"
                                        }
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
                                    var name = list + "-init-" + i;
                                    init.temp[list](name, item);
                                });
                        });
            }

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
                node.src.appendChild(document.createTextNode(node.i));

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

    /* ------- set ------- */

    _set = function(url){
        _target = url;

        document.body
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

    _set("target-works");

    /*

    engine.cmnd.get("url", _set);
    engine.cmnd.send("ready");

    */

};