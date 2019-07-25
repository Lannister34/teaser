;window.promo_set_up = function(engine, data){

    engine.cmnd
        .option("shadow", "true");

    /* --------------------------------------------- */

    window.trigger_target = function(){
        window.open(_target, "_blank");
        engine.cmnd.send("target_close");
    };

    /* --------------------------------------------- */

    var init = {},

        _css = {},
        _dom = {},

        _set,

        _target;

    /* --------------------------------------------- */

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
            m.n.length > 0 &&

                (function(){
                    m.f(m.n, 0);
                    m.n.length > 1 &&

                        (function(){
                            m.i = setInterval(function(){
                                m.f(m.n, m.s);
                                m.s = m.s === m.n.length - 1 ? 0 : m.s + 1;
                            }, m.d);
                        })();
                })();
        };
    };

    init.page = function(){

        var params = {
            "bounds" : function(item){
                return item.parentNode.getBoundingClientRect();
            }
        };

        engine.data.loop(["device", "scale", "size"])
            .run(function(option){
                params[option] =
                    engine.page[option]();
            });

        params.gutter = {
            "box"     :    params.device.type.mobile ? 6 : 14,
            "side"    :    params.device.type.mobile ? 8 : 12
        };

        return params;
    };

    init.temp = {

        "title"          :    function(name, item){

            _dom.map[name + "-box"] = {
                "p" : "title-box",
                "a" : {
                    "class" : "title-item"
                },
                "init" : "title"
            };

            _dom.map[name + "-box-in"] = {
                "p" : name + "-box",
            };

            _dom.map[name] = {
                "n" : "span",
                "p" : name + "-box-in",
                "i" : item.content,
                "s" : {
                    "font-weight" : item.weight,
                    "font-size" : item.size + "em",
                    "color" : "#" + item.color
                }
            };
        },

        "description"    :    function(name, item){

            _dom.map[name + "-box"] = {
                "p" : "description-box",
                "a" : {
                    "class" : "description-item"
                },
                "init" : "description"
            };

            _dom.map[name + "-box-in"] = {
                "p" : name + "-box",
                "resize" : function(page){
                    return {
                        "padding-right" : page.gutter.side * page.scale + "px",
                    }
                }
            };

            _dom.map[name] = {
                "n" : "span",
                "p" : name + "-box-in",
                "i" : item.content,
                "s" : {
                    "font-weight" : item.weight,
                    "font-size" : item.size + "em",
                    "color" : "#" + item.color
                }
            };
        }
    };

    init.config = {


        /* title ----------- */

        "title" : new init.create(data["title-duration"], {
            "opacity" : 1, 
            "transform" : "translateX(0)"
        }, {
            "opacity" : 0, 
            "transform" : "translateX(-5%)"
        }),


        /* description ------ */

        "description" : new init.create(data["description-duration"], {
            "opacity" : 1, 
            "transform" : "translateX(0)"
        }, {
            "opacity" : 0, 
            "transform" : "translateX(-5%)"
        })

    };

    /* --------------------------------------------- */

    engine.css.prx
        .set("perspective");

    _css.rules = {

        "body" : {
            "margin" : 0,
            "padding" : 0,
            "overflow" : "hidden"

        },

        ".main, .wrapper" : {
            "position" : "absolute",
            "width" : "100%", "height" : "100%",
            "top" : 0, "left" : 0,
            "overflow" : "hidden"
        },

        ".wrapper" : {
            "font-family" : "sans-serif",
            "text-decoration" : "none",

            "user-select" : "none",
            "-webkit-touch-callout" : "none",
            "text-size-adjust" : "100%"
        },

        ".main" : {
            "z-index" : 2
        },

        ".back" : {
            "position" : "absolute",
            "width" : "100%", "height" : "100%",
            "bottom" : 0, "left" : 0,
            "z-index" : 1,

            "transition" : "opacity .8s"
        },

        ".main > div" : {
            "width" : "100%", "height" : "100%",
            "box-sizing" : "border-box",
            "perspective" : "800px"
        },

        ".main > div > div" : {
            "position": "relative",
            "width" : "100%", "height": "100%",
            "left" : 0, "top" : 0,
            "overflow" : "hidden",

            "transition" : "transform 1s, opacity 1s .1s",
            "transform-style" : "preserve-3d"
        },

        ".background" : {
            "position" : "absolute",
            "width" : "100%", "height" : "100%",
            "top" : 0, "left" : 0,
            "z-index" : 1, "opacity" : .95,
            "background-color" : "#" + data.background
        },

        ".top" : {
            "position" : "absolute",
            "top" : 0, "left" : 0,
            "z-index" : 3,
            "background-color" : "#" + data["title-background"],
            "transition" : "transform .6s .4s, opacity .6s .4s"
        },

        ".bottom" : {
            "position" : "absolute",
            "bottom" : 0, "right" : 0,
            "z-index" : 2,
            "transition" : "opacity .6s .8s"
        },

        ".in > div" : {
            "width" : "100%", "height" : "100%",
            "box-sizing" : "border-box",
        },

        ".in > div > div" : {
            "position": "relative",
            "width" : "100%", "height": "100%",
            "left" : 0, "top" : 0
        },

        ".title-box, .description-box" : {
            "position" : "absolute",
            "height" : "100%",
            "top" : 0,
            "transform" : "translateZ(0)"
        },

        ".title-item, .description-item" : {
            "position" : "absolute",
            "display" : "table",
            "width" : "100%", "height" : "100%",
            "left" : 0, "top" : 0,

            "transition" : "opacity .6s, transform .6s"
        },

        ".title-item > div, .description-item > div" : {
            "display" : "table-cell",
            "vertical-align" : "middle"
        },

        ".title-item > div > span, .description-item > div > span" : {
            "display" : "block"
        }

    };

     _css.animations = {

    };

    /* --------------------------------------------- */


    _dom.map = {

        /* css */

        "rules" : {
            "n" : "style",
            "p" : document.head,
            "a" : {
                "data-rules" : ""
            },
            "css" : function(){
                engine.css
                    .rule(this.src, _css.rules);
            }
        },

        /* main */

        "wrapper" : {
            "a" : {
                "class" : "wrapper",
                "onclick" : "trigger_target();"
            }
        },

        "main" : {
            "p" : "wrapper",
            "a" : {
                "class" : "main",
            }
        },

        "back" : {
            "p" : "wrapper",
            "a" : {
                "class" : "back",
                "style" : "background-image : -webkit-linear-gradient(bottom, rgba(0,0,0,.2) 0%, rgba(0,0,0,0) 70%);"
                        + "background-image : -moz-linear-gradient(bottom, rgba(0,0,0,.2) 0%, rgba(0,0,0,0) 70%);"
                        + "background-image : -ms-linear-gradient(bottom, rgba(0,0,0,.2) 0%, rgba(0,0,0,0) 70%);"
                        + "background-image : -o-linear-gradient(bottom, rgba(0,0,0,.2) 0%, rgba(0,0,0,0) 70%);"
                        + "background-image : linear-gradient(to top, rgba(0,0,0,.2) 0%, rgba(0,0,0,0) 70%);"
            },
            "s" : {
                "opacity" : 0,
            },
            "r" : {
                "opacity" : 1,
            }
        },

        "box" : {
            "p" : "main",

            "resize" : function(page){
                return {
                    "padding" : "0px " + page.gutter.box * page.scale + "px " + page.gutter.box * page.scale + "px"
                };
            }
        },

        "box-in" : {
            "p" : "box",

            "s" : {
                "opacity" : 0,
                "transform" : "rotateX(-360deg)"
            },

            "r" : {
                "opacity" : 1,
                "transform" : "rotateX(0deg)"
            },

            "resize" : function(page){
                var radius = page.device.type.mobile ? 12 : 18
                return {
                    "border-radius" : radius * page.scale + "px"
                };
            }
        },

        /* background */

        "background" : {
            "p" : "box-in",
            "a" : {
                "class" : "background"
            }
        },

        /* top */

        "top" : {
            "p" : "box-in",
            "a" : {
                "class" : "top in"
            },
            "s" : {
                "opacity" : 0,
                "transform" : "translateY(120%)"
            },
            "r" : {
                "opacity" : 1,
                "transform" : "translateY(0)"
            },
            "resize" : function(page){
                return {
                    "width" : page.device.orientation.portrait ?
                                "100%" : "40%",

                    "height" : page.device.orientation.portrait ?
                                "50%" : "100%",

                    "box-shadow" : "0px " + 4 * page.scale + "px " + 4 * page.scale  + "px 0px rgba(0,0,0,.05)"
                }
            }
        },

        "top-in" : {
            "p" : "top",
            "resize" : function(page){
                return {
                    "padding" : page.gutter.side * page.scale + "px"
                };
            }
        },

        "top-content" : {
            "p" : "top-in"
        },

        "title-box" : {
            "p" : "top-content",
            "a" : {
                "class" : "title-box"
            },
            "s" : {
                "opacity" : 0
            },
            "r" : {
                "opacity" : 1
            }
        },

        /* bottom */

        "bottom" : {
            "p" : "box-in",
            "a" : {
                "class" : "bottom in"
            },
            "s" : {
                "opacity" : 0,
            },
            "r" : {
                "opacity" : 1,
            },
            "resize" : function(page){
                return {
                    "width" : page.device.orientation.portrait ?
                                "100%" : "60%",

                    "height" : page.device.orientation.portrait ?
                                "50%" : "100%"
                }
            }
        },

        "bottom-in" : {
            "p" : "bottom",
            "resize" : function(page){
                return {
                    "padding" : page.gutter.side * page.scale + "px"
                };
            }
        },

        "bottom-content" : {
            "p" : "bottom-in"
        },

        "description-box" : {
            "p" : "bottom-content",
            "a" : {
                "class" : "description-box"
            },
            "s" : {
                "opacity" : 0
            },
            "r" : {
                "opacity" : 1
            }
        }

    };

    /* conditions */

    data.button.condition ?

        (function(){

            engine.data.assign({

                "button" : {
                    "from" : {
                        "opacity" : 1
                    },
                    "to" : {
                        "opacity" : .7
                    }
                }

            }, _css.animations);

            engine.data.assign({

                ".button-box" : {
                    "position" : "absolute",
                    "display" : "table",
                    "height" : "100%",
                    "right" : 0, "top" : 0,
                    "box-sizing" : "border-box",
                    "transform" : "translateZ(0)"
                },

                ".button-box > div" : {
                    "display" : "table-cell",
                    "vertical-align" : "middle",
                    "text-align" : "center"
                },

                ".button-box > div > span" : {
                    "animation" : "button .6s infinite alternate",
                    "animation-timing-function" : "linear",
                    "animation-delay" : ".5s"
                }

            }, _css.rules);

            /* dom */

            _dom.map["description-box"].resize = function(page){
                var _parent = page.bounds(this.src);
                return {
                    "width" : (_parent.width * .6) - (page.gutter.side * page.scale) + "px",
                    "left" : page.gutter.side * page.scale + "px",
                    "border-right" : "solid " + 1 * page.scale + "px rgba(0,0,0,.1)"
                }
            };

            engine.data.assign({

                "animations" : {
                    "n" : "style",
                    "p" : document.head,
                    "a" : {
                        "data-animations" : ""
                    },
                    "css" : function(){
                        engine.css
                            .animation(this.src, _css.animations);
                    }
                },

                "button-box" : {
                    "p" : "bottom-content",
                    "a" : {
                        "class" : "button-box"
                    },
                    "resize" : function(page){
                        var _parent = page.bounds(this.src);
                        return {
                            "width" : (_parent.width * .4) - (page.gutter.side * page.scale) + "px",
                        }
                    }
                },

                "button-box-in" : {
                    "p" : "button-box"
                },

                "button" : {
                    "n" : "span",
                    "p" : "button-box-in",
                    "a" : {
                        "class" : "button"
                    },
                    "i" : data.button.content,
                    "s" : {
                        "font-size" : data.button.size  + "em",
                        "font-weight" : data.button.weight,
                        "color" : "#" + data.button.color
                    }
                }

            }, _dom.map);

        })()

        : _dom.map["description-box"].resize = function(page){
            var _parent = page.bounds(this.src);
            return {
                "width" : _parent.width - ((page.gutter.side * page.scale) * 2) + "px",
                "left" : page.gutter.side * page.scale + "px"
            }
        };

    data.icon.condition ?

        (function(){

            engine.data.assign({

                ".icon" : {
                    "position" : "absolute",
                    "height" : "100%",
                    "top" : 0, "left" : 0,

                    "background-image" : "url(" + data.icon.image + ")",
                    "background-repeat" : "no-repeat",
                    "background-position" : "center",
                    "background-size" : "cover",

                    "transition" : "transform .6s .6s, opacity .5s .5s"
                }

            }, _css.rules);

            data.icon.animation &&
                engine.data.assign({

                    "icon" : {
                        "0%,100%,30%" : {
                            "transform" : "scale(1) rotate(0)"
                        },
                        "50%,70%" : {
                            "transform" :"scale(1.1) rotate(0)"
                        },
                        "55%,65%" : {
                            "transform" : "scale(1.1) rotate(12deg)"
                        },
                        "60%" : {
                            "transform" : "scale(1.1) rotate(-12deg)"
                        }
                    },

                }, _css.animations) &&

                engine.data.assign({

                    ".icon-animation" : {
                        "animation" : "icon 1.8s infinite",
                        "animation-delay" : ".5s"
                    }

                }, _css.rules) &&

                ("animations" in _dom.map || engine.data.assign({

                    "animations" : {
                        "n" : "style",
                        "p" : document.head,
                        "a" : {
                            "data-animations" : ""
                        },
                        "css" : function(){
                            engine.css
                                .animation(this.src, _css.animations);
                        }
                    },

                }, _dom.map))

            /* dom */

            _dom.map["title-box"].resize = function(page){
                var _parent = page.bounds(this.src);
                return {
                    "width" : _parent.width - _parent.height - (page.gutter.side * page.scale) + "px",
                    "right" : 0
                }
            }

            engine.data.assign({

                "icon" : {
                    "p" : "top-content",
                    "a" : {
                        "class" : "icon" + (data.icon.animation ? " icon-animation" : "")
                    },
                    "s" : {
                        "opacity" : 0,
                        "transform" : "scale(.5)"
                    },
                    "r" : {
                        "opacity" : 1,
                        "transform" : "scale(1)"
                    },
                    "resize" : function(page){
                        var _parent = page.bounds(this.src);
                        return {
                            "width" : _parent.height + "px"
                        };
                    }
                }

            }, _dom.map);

        })()

        : _dom.map["title-box"].resize = function(page){
            var _parent = page.bounds(this.src);
            return {
                "width" : _parent.width - ((page.gutter.side * page.scale) * 2) + "px",
                "left" : page.gutter.side * page.scale + "px"
            }
        };

    engine.data.loop(["title", "description"])
        .run(function(list){
            engine.data.loop(data[list]).run(function(item, i){
                var name = list + "#" + i;
                init.temp[list](name, item);
            });
        });

    /* --------------------------------------------- */

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
                engine.css.style(node.src, node.s);

            /* content */
            "i" in node &&
                (node.src.innerHTML = node.i);

            /* init */
            "init" in node &&
                init.config[node["init"]].n
                    .push(node.src);

            /* parent */
            "p" in node &&
                (function(){
                    typeof node.p === "string" ?
                        map[node.p].src.appendChild(node.src)
                            : node.p.appendChild(node.src);
                })();

            /* css */
            "css" in node &&
                node.css();

        });

    engine.data.loop({

        "resize" : {

            "font-size" : function(){
                var page = init.page();

                var k = page.device.type.mobile ?
                            page.device.orientation.portrait ?
                                0.116 : 0.2 
                                    : page.device.orientation.portrait ?
                                        0.12 : 0.14;

                engine.css.style(document.body, {
                    "font-size" : Math.floor(page.size.in_height * k) + "px"
                });
            },

            "node-resize" : function(){
                engine.data.loop(_dom.map)
                    .run(function(node){
                        "resize" in node && engine.css
                                .style(node.src, node.resize(init.page()));
                    });
            },
        }

    }).run(function(type, name){
            engine.data.loop(type)
                .run(function(func, id){
                    engine.events.add.func(name, id, func);
                });
        });

    engine.events.set();

    /* --------------------------------------------- */

    _set = function(url){

        _target = url;

        document.body
            .appendChild(_dom.map.wrapper.src);

        engine.events
            .run("resize");

        engine.data.loop(init.config)
            .run(function(init){
                init.r();
            });

        engine.data.loop(_dom.map)
            .run(function(node){
                "r" in node &&
                    engine.css
                        .style(node.src, node.r);
            });
    };

    engine.cmnd.get("url", _set);
    engine.cmnd.send("ready");
};