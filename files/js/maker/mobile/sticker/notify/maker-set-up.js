;window.promo_set_up = function(engine, config){

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
            inject.obj(props.name, props.data);
        });

    config.maker
        .init(function(){
            re_set(false);
        });

    /* --------------------------------------------- */

    inject.data = function(_data){
        data = _data;
    };

    inject.obj = function(name, item){

        var obj = _dom.map[name];
        obj && (function(){

            "style-init" in obj &&
                engine.css
                    .style(obj.src, obj["style-init"](item));

            "content-init" in obj &&
                (obj.src.innerHTML = obj["content-init"](item));

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
            })
    };

    /* --------------------------------------------- */

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
                    "class" : "--prm--title-item"
                },
                "init" : "title"
            };

            _dom.map[name + "-box-in"] = {
                "p" : name + "-box",
            };

            _dom.map[name] = {
                "n" : "span",
                "p" : name + "-box-in",
                "content-init" : function(e){
                    return e.content
                },
                "style-init" : function(e){
                    return {
                        "font-weight" : e.weight,
                        "font-size" : e.size + "em",
                        "color" : "#" + e.color
                    }
                }
            };
        },

        "description"    :    function(name, item){

            _dom.map[name + "-box"] = {
                "p" : "description-box",
                "a" : {
                    "class" : "--prm--description-item"
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
                "content-init" : function(e){
                    return e.content
                },
                "style-init" : function(e){
                    return {
                        "font-weight" : e.weight,
                        "font-size" : e.size + "em",
                        "color" : "#" + e.color
                    }
                }
            };
        }
    };

    _set.inits = function(){

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

    };

    /* --------------------------------------------- */

    engine.css.prx
        .set("perspective");

    _set.css = function(){

        _css.rules = {

            ".--prm--main, .--prm--wrapper" : {
                "position" : "absolute",
                "width" : "100%", "height" : "100%",
                "top" : 0, "left" : 0,
                "overflow" : "hidden"
            },

            ".--prm--wrapper" : {
                "font-family" : "sans-serif",
                "text-decoration" : "none",

                "user-select" : "none",
                "-webkit-touch-callout" : "none",
                "text-size-adjust" : "100%"
            },

            ".--prm--main" : {
                "z-index" : 2
            },

            ".--prm--main > div" : {
                "width" : "100%", "height" : "100%",
                "box-sizing" : "border-box",
                "perspective" : "800px"
            },

            ".--prm--main > div > div" : {
                "position": "relative",
                "width" : "100%", "height": "100%",
                "left" : 0, "top" : 0,
                "overflow" : "hidden",

                "transition" : "transform 1s, opacity 1s .1s",
                "transform-style" : "preserve-3d"
            },

            ".--prm--background" : {
                "position" : "absolute",
                "width" : "100%", "height" : "100%",
                "top" : 0, "left" : 0,
                "z-index" : 1, "opacity" : .95
            },

            ".--prm--top" : {
                "position" : "absolute",
                "top" : 0, "left" : 0,
                "z-index" : 3,
                "transition" : "transform .6s .4s, opacity .6s .4s"
            },

            ".--prm--bottom" : {
                "position" : "absolute",
                "bottom" : 0, "right" : 0,
                "z-index" : 2,
                "transition" : "opacity .6s .8s"
            },

            ".--prm--in > div" : {
                "width" : "100%", "height" : "100%",
                "box-sizing" : "border-box",
            },

            ".--prm--in > div > div" : {
                "position": "relative",
                "width" : "100%", "height": "100%",
                "left" : 0, "top" : 0
            },

            ".--prm--title-box, .--prm--description-box" : {
                "position" : "absolute",
                "height" : "100%",
                "top" : 0,
                "transform" : "translateZ(0)"
            },

            ".--prm--title-item, .--prm--description-item" : {
                "position" : "absolute",
                "display" : "table",
                "width" : "100%", "height" : "100%",
                "left" : 0, "top" : 0,

                "transition" : "opacity .6s, transform .6s"
            },

            ".--prm--title-item > div, .--prm--description-item > div" : {
                "display" : "table-cell",
                "vertical-align" : "middle"
            },

            ".--prm--title-item > div > span, .--prm--description-item > div > span" : {
                "display" : "block"
            }

        };

         _css.animations = {

        };

    }

    /* --------------------------------------------- */

    _set.dom = function(){

        _dom.map = {

            /* css */

            "rules" : {
                "n" : "style",
                "p" : preview_box,
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
                    "class" : "--prm--wrapper",
                    "onclick" : "trigger_target();"
                }
            },

            "main" : {
                "p" : "wrapper",
                "a" : {
                    "class" : "--prm--main",
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
                    "class" : "--prm--background"
                },
                "style-init" : function(e){
                    return {
                        "background-color" : "#" + e
                    }
                }
            },

            /* top */

            "title-background" : {
                "p" : "box-in",
                "a" : {
                    "class" : "--prm--top --prm--in"
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
                },
                "style-init" : function(e){
                    return {
                        "background-color" : "#" + e
                    };
                }
            },

            "top-in" : {
                "p" : "title-background",
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
                    "class" : "--prm--title-box"
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
                    "class" : "--prm--bottom --prm--in"
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
                    "class" : "--prm--description-box"
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

                    "--prm--button" : {
                        "from" : {
                            "opacity" : 1
                        },
                        "to" : {
                            "opacity" : .7
                        }
                    }

                }, _css.animations);

                engine.data.assign({

                    ".--prm--button-box" : {
                        "position" : "absolute",
                        "display" : "table",
                        "height" : "100%",
                        "right" : 0, "top" : 0,
                        "box-sizing" : "border-box",
                        "transform" : "translateZ(0)"
                    },

                    ".--prm--button-box > div" : {
                        "display" : "table-cell",
                        "vertical-align" : "middle",
                        "text-align" : "center"
                    },

                    ".--prm--button-box > div > span" : {
                        "animation" : "--prm--button .6s infinite alternate",
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
                        "p" : preview_box,
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
                            "class" : "--prm--button-box"
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
                            "class" : "--prm--button"
                        },
                        "content-init" : function(e){
                            return e.content;
                        },
                        "style-init" : function(e){
                            return {
                                "font-size" : e.size  + "em",
                                "font-weight" : e.weight,
                                "color" : "#" + e.color
                            }
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

                    ".--prm--icon" : {
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

                        "--prm--icon" : {
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

                        ".--prm--icon-animation" : {
                            "animation" : "--prm--icon 1.8s infinite",
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
                            "class" : "--prm--icon" + (data.icon.animation ? " --prm--icon-animation" : "")
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

    };

    /* --------------------------------------------- */

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

        engine.events.set(config.maker);

    };

    /* --------------------------------------------- */

    _set.inject = inject.all;

    _set.start = function(){

        config.maker.promo
            = _dom.map.main.src;

        "options" in config &&
            "controls" in config.options &&
                engine.maker.controls(config.options.controls, function(){
                    engine.data.loop(["title", "description"])
                            .run(function(prop){
                                init.config[prop].toggle();
                            });
                });

        preview_box
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

    re_set = function(condition){

        !condition &&
            (function(){
                preview_box.innerHTML = ""
                engine.events.remove.evt("resize");
            })();

        inject
            .data(config.maker.output());

        engine.data.loop(_set)
            .run(function(func){
                func();
            });
    };

    re_set(true);
};