;window.promo_set_up = function(engine, config){

    /* ------------------- Global Scope ------------------- */

    var preview_box = document
        .querySelector(form_config.preview);

    var data;

    var re_init = function(init){
        data = init;
    };

    re_init(config.maker.output());

    var run_reset = function(){
        re_init(config.maker.output());
        re_set(false);
    }; 

    var run_chnage = function(init){
        init_proto.data(init.name, init.data);
    };

    config.maker
        .change(run_chnage);

    config.maker
        .init(run_reset);




    /* -------------------- Preferences -------------------- */

    var create_init = function(d, a, r){

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





    /* ----------------------- Inits ----------------------- */

    var inits_config = {};

    var set_inits = function(){
        inits_config.text = new create_init(data.text_duration, {
            "opacity" : 1, 
            "transform" : "translateX(0)"
        }, {
            "opacity" : 0, 
            "transform" : "translateX(30%)"
        });

        inits_config.images = new create_init(data.image_duration, {
            "opacity" : 1, 
            "transform" : "scale(1)"
        }, {
            "opacity" : 0, 
            "transform" : "scale(1.2)"
        });
    };


    var init_proto = {};

    init_proto.page = function(){
        var params = {};
        engine.data.loop(["device", "scale", "size"])
            .run(function(option){
                params[option] =
                    engine.page[option]();
            });
        return params;
    };

    init_proto.data = function(name, init){

        "style-init" in node_tree[name] &&
            engine.css
                .style(node_tree[name].src,
                       node_tree[name]["style-init"](init));

        "content-init" in node_tree[name] &&
                (node_tree[name].src.innerHTML = node_tree[name]["content-init"](init));
    };

    init_proto.images = function(parent, item, order){
        node_tree[parent] = {
            "p" : "img",
            "order" : order,
            "a" : { "class" : "--prm--image-item"},
            "style-init" : function(){
                return { 
                    "background-image" : "url(" + item + ")",
                    "background-size" : "cover",
                    "background-position" : "center",
                    "background-repeat" : "no-repeat"
                };
            },
            "init" : "images"
        };
    };

    init_proto.text_content = function(name, item, order){
        node_tree[name] = {
            "n" : "span",
            "p" : name + "-box",
            "order" : order,
            "content-init" : function(init){
                return init.content;
            },
            "style-init" : function(init){
                return { 
                    "color" : "#" + init.color,
                    "font-size" : init.size + "em",
                    "font-weight" : init.weight
                };
            },
        };
    };

    init_proto.text_in = function(name, item, order){
        var id = name + "-box";
        node_tree[id] = {
            "p" : name + "-wrapper",
            "r" : function(e){

                var o = e.device.orientation,
                    t = e.device.type,
                    p = t.mobile ? 15 * e.scale
                        : 30 * e.scale;

                return {
                    "padding" : "0px "
                            + (o.portrait ? p : 0) 
                            + "px 0px "
                            + (o.landscape ? p : 0) 
                            + "px"
                }
            }
        };
        init_proto["text_content"](name, item, order);
    };

    init_proto.texts = function(name, item, order){
        var id = name + "-wrapper";
        node_tree[id] = {
            "p" : "text-box",
            "a" : {
                "class" : "--prm--message-box"
            },
            "init" : "text"
        };
        init_proto["text_in"](name, item, order);
    };





    /* ------------------------ CSS ------------------------ */

    var css_rules = {

        ".--prm--img-box, .--prm--main-box" : {
            "overflow" : "hidden"
        },

        ".--prm--img-box, .--prm--shape, .--prm--shape-box" : {
            "position" : "absolute",
            "height" : "100%",
            "top" : 0
        },

        ".--prm--button-box, .--prm--img-box, .--prm--shape, .--prm--shape-box, .--prm--text-box" : {
            "position" : "absolute"
        },

        ".--prm--image-item, .--prm--main-box, .--prm--message-box, .--prm--sub-box" : {
            "position" : "absolute",
            "width" : "100%",
            "height" : "100%",
            "top" : 0,
            "left": 0
        },

        ".--prm--image-item" : {
            "transition" : "opacity .4s,transform .4s"
        },

        ".--prm--main-box" : {
            "font-family" : "sans-serif",
            "text-size-adjust" : "100%",
            "text-decoration" : "none",
            "user-select" : "none",
            "-webkit-touch-callout" : "none"

        },

        ".--prm--message-box" : {
            "display" : "table",
            "transition" : "opacity .4s,transform .4s"
        },

        ".--prm--button, .--prm--message-box>div" : {
            "display" : "table-cell",
            "vertical-align" : "middle"
        },

        ".--prm--message-box>div>span" : {
            "display" : "block"
        },

        ".--prm--shape" : {
            "transform" : "skewX(-12deg)",
            "width" : "130%",
            "right" : "-36%"
        },

        ".--prm--button-box" : {
            "display" : "table",
            "text-align" : "center",
            "z-index" : 2,
            "transition" : "opacity .5s .6s, transform .25s .6s ease-out"
        },

        ".--prm--button-box>div>span" : {
            "white-space" : "nowrap",
            "text-overflow" : "ellipsis"
        },

        ".--prm--shape-box" : {
            "transition" : "right .5s ease-in-out",
            "animation" : "--prm--scale-back 3s .7s infinite alternate"
        },

        ".--prm--img-box" : {
            "left" : 0,
            "transition" : "opacity .5s .4s",
            "animation" : "--prm--scale-back 5s .6s infinite alternate"
        },

        ".--prm--text-box" : {
            "z-index" : 1,
            "transition" : "opacity .5s .4s, transform .5s .4s"
        }
    };

    var css_animations = {

        "--prm--scale-back" : {
            "from" : {
                "transform" : "scale(1)" 
            },
            "to" : {
                "transform" : "scale(1.1)" 
            },
        }
    };





    /* ----------------------- NODES ----------------------- */

    var node_tree, main_node, style_node;

    var set_node_tree = function(){

        main_node = (function(){
            var box = document.createElement("div");
            box.classList.add("--prm--main-box");
            return box;
        })();

        style_node = {
            "css_rules" : {
                "n" : "style",
                "p" : preview_box,
                "a" : {
                    "data-style-type" : "--prm--css-rules"
                },
                "css" : function(){
                    engine.css
                        .rule(this.src, css_rules);
                }
            },

            "css_animations" : {
                "n" : "style",
                "p" : preview_box,
                "a" : {
                    "data-style-type" : "--prm--css-animations"
                },
                "css" : function(){
                    engine.css
                        .animation(this.src, css_animations);
                }
            }
        };

        node_tree = {

            "img-box" : {
                "p" : main_node,
                "a" : {
                    "class" : '--prm--sub-box'
                },
                "s" : {
                    "z-index" : 1
                }
            },

            "img" : {
                "p" : "img-box",
                "a" : {
                    "class" : "--prm--img-box"
                },
                "s" : {
                    "opacity" : 0
                },
                "g" : {
                    "opacity" : 1
                },
                "r" : function(e){
                    return {
                        "width" : e.device
                                    .orientation.portrait ? "60%"
                                        : "30%"
                    };
                }
            },



            "bg-box" : {
                "p" : main_node,
                "a" : {
                    "class" : '--prm--sub-box'
                },
                "s" : {
                    "z-index" : 2
                }
            },

            "shape-box" : {
                "p" : "bg-box",
                "a" : {
                    "class" : "--prm--shape-box"
                },
                "s" : {
                    "right" : "-100%"
                },
                "g" : {
                    "right" : 0
                },
                "r" : function(e){
                    return {
                        "width" : e.device
                                    .orientation.portrait ? "60%"
                                        : "80%"
                    };
                }
            },

            "background" : {
                "p" : "shape-box",
                "a" : {
                    "class" : "--prm--shape"
                },
                "style-init" : function(init){
                    return {
                        "background-color" : "#" + init
                    };
                }
            },



            "content-box" : {
                "p" : main_node,
                "a" : {
                    "class" : '--prm--sub-box'
                },
                "s" : {
                    "z-index" : 3
                }
            },

            "text-box" : {
                "p" : "content-box",
                "a" : {
                    "class" : '--prm--text-box'
                },
                "s" : {
                    "opacity" : 0,
                    "transform" : "translateX(-15%)"
                },
                "g" : {
                    "opacity" : 1,
                    "transform" : "translateX(0)"
                },
                "r" : function(e){
                    var o = e.device.orientation;
                    return {
                        "width" : o.portrait ? "48%" : "40%",
                        "text-align" : o.portrait ? "right" : "left",
                        "height" : o.portrait ? "60%" : "100%",
                        "right" : o.portrait ? 0 : "32%",
                        "top" : o.portrait ? "5%" : 0
                    }
                }
            },



            "button-box" : {
                "p" : "content-box",
                "a" : {
                    "class" : '--prm--button-box'
                },
                "s" : {
                    "opacity" : 0,
                    "transform" : "scale(2)"
                },
                "g" : {
                    "opacity" : 1,
                    "transform" : "scale(1)"
                },
                "r" : function(e){
                    
                    return {

                        "height" : e.device.orientation
                                        .portrait ? "30%" : "100%",

                        "right" : e.device.type
                                    .mobile ? 15 * e.scale + "px"
                                        : 30 * e.scale + "px",

                        "bottom" : e.device.orientation
                                        .portrait ? "5%" : 0
                    };
                }
            },

            "button-in" : {
                "p" : "button-box",
                "a" : {
                    "class" : '--prm--button'
                }
            },

            "button" : {
                "n" : "span",
                "p" : "button-in",
                "content-init" : function(init){
                    return init.content;
                },
                "style-init" : function(init){
                    return {
                        "color" : "#" + init.color,
                        "font-size" : init.size + "em",
                        "font-weight" : init.weight,
                        "background-color" : "#" + init.background
                    };
                },
                "r" : function(e){
                    return {
                        "padding" : e.device.type.mobile ?
                                        8 * e.scale + "px " + 14 * e.scale + "px"
                                            : 15 * e.scale + "px " + 25 * e.scale + "px",

                        "border-radius" : 3 * e.scale + "px"
                    }
                }
            }
        };

        engine.data.loop(["texts", "images"])
            .run(function(list){
                engine.data.loop(data[list])
                    .run(function(item, i){
                        var name = list + "#" + i;
                        init_proto[list](name, item, i);
                    });
            });

    };

    /* ----------------------- BUILD ----------------------- */

    var build_styles = function() {

        engine.data.loop(style_node).run(function(node) {

            /* node src */
            "n" in node ? node.src = document.createElement(node.n)
                : node.src = document.createElement("div");


            /* attributes */
            "a" in node && engine.data.loop(node.a).run(function (property, attr) {
                node.src.setAttribute(attr, property);
            });


            /* node parent */
            "p" in node && (function () {
                typeof node.p === "string" ?
                    node_tree[node.p].src.appendChild(node.src)
                    : node.p.appendChild(node.src);
            })();

            /* css sheet inject */
            "css" in node && node.css();
        });
    }

    var build_node_tree = function(condition){

        engine.data.loop(node_tree).run(function(node, i){

            /* node src */
            "n" in node ? node.src = document.createElement(node.n)
                : node.src = document.createElement("div");


            /* attributes */
            "a" in node && engine.data.loop(node.a).run(function(property, attr){
                node.src.setAttribute(attr, property);
            });


            /* inline styles */
            condition && "s" in node && engine.css.style(node.src, node.s);
            !condition && "g" in node && engine.css.style(node.src, node.g);


            /* inner content */
            "i" in node && (node.src.innerHTML = node.i());


            /* init setup */
            "init" in node && inits_config[node["init"]].n.push(node.src);

            ("style-init" in node || "content-init" in node) &&
                (function(){
                    "order" in node ?
                        (function(){
                            var row = i.split("#");
                            init_proto.data(i, data[row[0]][node.order]);
                        })() : init_proto.data(i, data[i]);
                })();

            /* node parent */
            "p" in node && (function(){
                typeof node.p === "string" ?
                    node_tree[node.p].src.appendChild(node.src)
                        : node.p.appendChild(node.src);
            })();

            /* css sheet inject */
            "css" in node && node.css();
        });

        engine.data.loop({
            "resize" : {
                "font-size" : function(){
                    var page = init_proto.page();

                    var k = page.device.type.mobile ?
                                page.device.orientation.portrait ?
                                    0.116 : 0.2
                                        : page.device.orientation.portrait ?
                                            0.12 : 0.14;

                    engine.css.style(main_node, {
                        "font-size" : Math.floor(page.size.in_height * k) + "px"
                    });
                },
                "node-resize" : function(){
                    engine.data.loop(node_tree)
                        .run(function(node){
                            "r" in node &&
                                engine.css
                                    .style(node.src, node.r(init_proto.page()));
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

    var set_promo = function(condition){

        config.maker.promo
            = main_node;

        "options" in config &&
            "controls" in config.options &&
                engine.maker.controls(config.options.controls, function(){
                    engine.data.loop(["images", "text"])
                            .run(function(prop){
                                inits_config[prop].toggle();
                            });
                });

        preview_box
            .appendChild(main_node);

        engine.events
            .run("resize");

        engine.data.loop(inits_config)
            .run(function(init){
                init.r();
            });

        condition && engine.data.loop(node_tree)
            .run(function(node){
                "g" in node && engine.css.style(node.src, node.g);
            });
    };

    var re_set = function(condition){

        !condition && (function(){
            preview_box.removeChild(main_node);
            engine.events.remove.evt("resize");
        })();

        set_inits();
        set_node_tree();

        condition &&
            build_styles();

        build_node_tree(condition);
        set_promo(condition);
    };

    re_set(true);
};