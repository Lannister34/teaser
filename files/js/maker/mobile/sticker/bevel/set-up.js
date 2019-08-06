;window.promo_set_up = function(engine, data){

    /* -------------------- Preferences -------------------- */

    var create_init = function(d, a, r){

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





    /* ----------------------- Inits ----------------------- */

    var inits_config = {};


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

    init_proto.images = function(parent, item){
        node_tree[parent] = {
            "p" : "img",
            "a" : { "class" : "image-item"},
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

    init_proto.text_content = function(parent, item){
        var name = parent + "_content";
        node_tree[name] = {
            "n" : "span",
            "p" : parent,
            "content-init" : function(){
                return item.content;
            },
            "style-init" : function(){
                return { 
                    "color" : "#" + item.color,
                    "font-size" : item.size + "em",
                    "font-weight" : item.weight
                };
            },
        };
    };

    init_proto.text_in = function(parent, item){
        var name = parent + "_in";
        node_tree[name] = {
            "p" : parent,
            "r" : function(e){
                var p = e.device.type.mobile ?
                        15 * e.scale
                            : 30 * e.scale;
                return {
                    "padding" : "0px "
                            + (e.device.orientation.portrait ? p : 0) 
                            + "px 0px "
                            + (e.device.orientation.landscape ? p : 0) 
                            + "px"
                }
            }
        };
        init_proto["text_content"](name, item);
    };

    init_proto.texts = function(parent, item){
        node_tree[parent] = {
            "p" : "text-box",
            "a" : {
                "class" : "message-box"
            },
            "init" : "text"
        };
        init_proto["text_in"](parent, item);
    };





    /* ------------------------ CSS ------------------------ */

    var css_rules = {

        ".img-box,.main-box,body" : {
            "overflow" : "hidden"
        },

        ".img-box,.shape,.shape-box" : {
            "position" : "absolute",
            "height" : "100%",
            "top" : 0
        },

        ".button-box,.img-box,.shape,.shape-box,.text-box" : {
            "position" : "absolute"
        },

        "body" : {
            "margin" : 0,
            "padding" : 0,
            "font-family" : "sans-serif",
            "text-size-adjust" : "100%"
        },

        ".image-item,.main-box,.message-box,.sub-box" : {
            "position" : "absolute",
            "width" : "100%",
            "height" : "100%",
            "top" : 0,
            "left": 0
        },

        ".image-item" : {
            "transition" : "opacity .4s,transform .4s"
        },

        ".main-box" : {
            "text-decoration" : "none",
            "cursor" : "pointer",
            "user-select" : "none",
            "-webkit-touch-callout" : "none"

        },

        ".message-box" : {
            "display" : "table",
            "transition" : "opacity .4s,transform .4s"
        },

        ".button,.message-box>div" : {
            "display" : "table-cell",
            "vertical-align" : "middle"
        },

        ".message-box>div>span" : {
            "display" : "block"
        },

        ".shape" : {
            "transform" : "skewX(-12deg)",
            "width" : "130%",
            "right" : "-36%"
        },

        ".button-box" : {
            "display" : "table",
            "text-align" : "center",
            "z-index" : 2,
            "transition" : "opacity .5s .6s, transform .25s .6s ease-out"
        },

        ".button-box>div>span" : {
            "white-space" : "nowrap",
            "text-overflow" : "ellipsis"
        },

        ".shape-box" : {
            "transition" : "right .5s ease-in-out",
            "animation" : "scale-back 3s .7s infinite alternate"
        },

        ".img-box" : {
            "left" : 0,
            "transition" : "opacity .5s .4s",
            "animation" : "scale-back 5s .6s infinite alternate"
        },

        ".text-box" : {
            "z-index" : 1,
            "transition" : "opacity .5s .4s, transform .5s .4s"
        }
    };

    var css_animations = {
        "scale-back" : {
            "from" : {
                "transform" : "scale(1)" 
            },
            "to" : {
                "transform" : "scale(1.1)" 
            },
        }
    };



    /* ----------------------- NODES ----------------------- */

    var node_tree = {

        "css_rules" : {
            "n" : "style",
            "p" : document.head,
            "a" : {
                "data-style-type" : "css-rules"
            },
            "css" : function(){
                engine.css
                    .rule(this.src, css_rules);
            }
        },

        "css_animations" : {
            "n" : "style",
            "p" : document.head,
            "a" : {
                "data-style-type" : "css-animations"
            },
            "css" : function(){
                engine.css
                    .animation(this.src, css_animations);
            }
        },



        "img-box" : {
            "p" : engine.box,
            "a" : {
                "class" : 'sub-box'
            },
            "s" : {
                "z-index" : 1,
            }
        },

        "img" : {
            "p" : "img-box",
            "a" : {
                "class" : "img-box"
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
            "p" : engine.box,
            "a" : {
                "class" : 'sub-box'
            },
            "s" : {
                "z-index" : 2
            }
        },

        "shape-box" : {
            "p" : "bg-box",
            "a" : {
                "class" : "shape-box"
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

        "shape" : {
            "p" : "shape-box",
            "a" : {
                "class" : "shape"
            },
            "style-init" : function(){
                return {
                    "background-color" : "#" + data.background
                };
            }
        },



        "content-box" : {
            "p" : engine.box,
            "a" : {
                "class" : 'sub-box'
            },
            "s" : {
                "z-index" : 3
            }
        },

        "text-box" : {
            "p" : "content-box",
            "a" : {
                "class" : 'text-box'
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
                "class" : 'button-box'
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

        "button" : {
            "p" : "button-box",
            "a" : {
                "class" : 'button'
            }
        },

        "button-in" : {
            "n" : "span",
            "p" : "button",
            "content-init" : function(){
                return data.button.content;
            },
            "style-init" : function(){
                return {
                    "color" : "#" + data.button.color,
                    "font-size" : data.button.size + "em",
                    "font-weight" : data.button.weight,
                    "background-color" : "#" + data.button.background
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

    engine.data.loop(["images", "texts"]).run(function(list){
        engine.data.loop(data[list]).run(function(item, i){
            var name = list + "_init_" + i;
            init_proto[list](name, item);
        });
    });

    /* ----------------------- BUILD ----------------------- */

    engine.data.loop(node_tree).run(function(node){

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


        /* inner content */
        "i" in node && (node.src.innerHTML = node.i());


        /* init setup */
        "init" in node && inits_config[node["init"]].n.push(node.src);
        "style-init" in node && engine.css.style(node.src, node["style-init"]());
        "content-init" in node && (node.src.innerHTML = node["content-init"]());


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

                engine.css.style(document.body, {
                    "font-size" : Math.floor(page.size.in_height * k) + "px"
                });
            },
            "node-resize" : function(){
                engine.data.loop(node_tree)
                    .run(function(node){
                        "r" in node && engine.css
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

    engine.events.set();

    var appear = function(){
        var t = setInterval(function(){
            var size = engine.page.size();
            size.in_width > 0 && size.in_height > 0 && (
                clearInterval(t),
                engine.events.run("resize"),
                window.setTimeout(function(){
                    engine.data.loop(node_tree).run(function(node){
                        "g" in node && engine.css.style(node.src, node.g);
                    });
                    engine.config && engine.tracker.show();
                }, 50)
            );
        }, 50)
    };

    document.body
        .appendChild(engine.box);

    engine.events.run("resize");

    engine.data.loop(inits_config).run(function(init){
        init.r();
    });

    engine.cmnd.pull.show = appear;
    engine.cmnd       .gain    ();
    engine.cmnd.send  .bounce  ();
    engine.cmnd.send  .ready   ();

};