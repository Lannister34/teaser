;window.promo_set_up = function(engine, config){

    /* ------------------- Global Scope ------------------- */

    var engine = engine;

    var preview_box = document
        .querySelector(config.preview);

    var data =
        config.maker
            .output();

    config.maker
        .change(function(init){
            init_proto
                .data(init.name, init.data);
        });

    config.maker
        .init(function(){
            data = config.maker.output();
            re_set(false);
        });


    /* ----------------------- Inits ----------------------- */

    var init_proto = {};

    init_proto.data = function(name, init){

        "style-init" in node_tree[name] &&
            engine.css
                .style(node_tree[name].src,
                       node_tree[name]["style-init"](init));

        "content-init" in node_tree[name] &&
                (node_tree[name].src.innerHTML
                    = node_tree[name]["content-init"](init));
    };

    /* ------------------------ CSS ------------------------ */

    var css_rules = {

        ".--prm--main-box, .--prm--sub-box, .--prm--img" : {
            "position" : "absolute",
            "width" : "100%", "height" : "100%",
            "top" : 0, "left": 0,
        },

        ".--prm--box" : {
            "position" : "absolute",
            "width" : "100%",
            "bottom" : 0, "left": 0,

            "transition" : "height .4s"
        },

        ".--prm--main-box" : {
            
            "font-family" : "sans-serif",
            "text-size-adjust" : "100%",
            "text-decoration" : "none",

            "user-select" : "none",
            "-webkit-touch-callout" : "none",
            "overflow" : "hidden"
        },

        ".--prm--img" : {
            "transition" : "opacity .4s .3s"
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
            }
        };

        node_tree = {

            "box" : {
                "p" : main_node,
                "a" : {
                    "class" : "--prm--box"
                },
                "s" : {
                    "height" : 0
                },
                "g" : {
                    "height" : "100%"
                }
            },

            "portrait" : {
                "p" : "box",
                "a" : {
                    "class" : "--prm--sub-box"
                },
                "r" : function(e){
                    return {
                        "display" : e.orientation.portrait ?
                            "block" : "none"
                    }
                },
                "style-init" : function(init){
                    return { 
                        "background-color" : "#" + init
                    };
                }
            },

            "portrait-image" : {
                "p" : "portrait",
                "a" : {
                    "class" : "--prm--img"
                },
                "s" : {
                    "opacity" : 0
                },
                "g" : {
                    "opacity" : 1
                },
                "style-init" : function(init){
                    return { 
                        "background-image" : "url(" + init[0] + ")",
                        "background-size" : "contain",
                        "background-position" : "center",
                        "background-repeat" : "no-repeat"
                    };
                }
             },

             "landscape" : {
                "p" : "box",
                "a" : {
                    "class" : "--prm--sub-box"
                },
                "r" : function(e){
                    return {
                        "display" : e.orientation.landscape ?
                            "block" : "none"
                    }
                },
                "style-init" : function(init){
                    return { 
                        "background-color" : "#" + init
                    };
                }
             },

             "landscape-image" : {
                "p" : "landscape",
                "a" : {
                    "class" : "--prm--img"
                },
                "s" : {
                    "opacity" : 0
                },
                "g" : {
                    "opacity" : 1
                },
                "style-init" : function(init){
                    return { 
                        "background-image" : "url(" + init[0] + ")",
                        "background-size" : "contain",
                        "background-position" : "center",
                        "background-repeat" : "no-repeat"
                    };
                }
             }
        };
    };

    /* ----------------------- BUILD ----------------------- */

    var build_styles = function() {

        engine.data.loop(style_node).run(function (node) {

            /* node src */
            node.src = document
                .createElement("style");


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
            "n" in node ?
                node.src = document.createElement(node.n)
                    : node.src = document.createElement("div");


            /* attributes */
            "a" in node && engine.data.loop(node.a)
                .run(function(property, attr){
                    node.src.setAttribute(attr, property);
                });


            /* inline styles */
            condition && "s" in node &&
                engine.css.style(node.src, node.s);

            !condition && "g" in node &&
                engine.css.style(node.src, node.g);


            ("style-init" in node || "content-init" in node) &&
                init_proto.data(i, data[i])

            /* node parent */
            "p" in node && (function(){
                typeof node.p === "string" ?
                    node_tree[node.p].src.appendChild(node.src)
                        : node.p.appendChild(node.src);
            })();
        });

        engine.data.loop({
            "resize" : {

                "node-resize" : function(){
                    engine.data.loop(node_tree)
                        .run(function(node){
                            "r" in node &&
                                engine.css
                                    .style(node.src, node.r(engine.page.device()));
                        });

                },
            }
        }).run(function(type, name){
            engine.data.loop(type)
                .run(function(func, id){
                    engine.events.add.func(name, id, func);
                });
        });

        engine.events
            .set(config.maker);

    };

    var set_promo = function(condition){

        config.maker.promo
            = main_node;

        preview_box
            .appendChild(main_node);

        engine.events
            .run("resize");

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

        set_node_tree();
        condition && build_styles();
        build_node_tree(condition);
        set_promo(condition);
    };

    re_set(true);
};