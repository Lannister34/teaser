;window.promo_set_up = function(engine, data){

    /* ------------------- Global Scope ------------------- */



    window.trigger_target_url = function(node){

        window
            .open(target_url, "_blank");

        engine.cmnd
            .send("target_close");
    };


    /* -------------------- Preferences -------------------- */

    var target_url = null;


    /* ------------------------ CSS ------------------------ */

    var css_rules = {

        ".main-box, .sub-box, .img" : {
            "position" : "absolute",
            "width" : "100%", "height" : "100%",
            "top" : 0, "left": 0,
        },

        ".box" : {
            "position" : "absolute",
            "width" : "100%",
            "bottom" : 0, "left": 0,

            "transition" : "height .4s"
        },

        ".main-box" : {
            
            "font-family" : "sans-serif",
            "text-size-adjust" : "100%",
            "text-decoration" : "none",

            "user-select" : "none",
            "-webkit-touch-callout" : "none",
            "overflow" : "hidden"
        },

        ".img" : {
            "transition" : "opacity .4s .3s"
        }
    };

    /* ----------------------- NODES ----------------------- */

    var main_node = (function(){
        var box = document.createElement("div");
        box.classList.add("main-box");
        box.setAttribute("onclick", "trigger_target_url();");
        return box;
    })();


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


        "box" : {
            "p" : main_node,
            "a" : {
                "class" : "box"
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
                "class" : "sub-box"
            },
            "r" : function(e){
                return {
                    "display" : e.orientation.portrait ?
                    "block" : "none"
                }
            },
            "style-init" : function(init){
                return { 
                    "background-color" : "#" + data.portrait
                };
            }
        },

        "portrait-image" : {
            "p" : "portrait",
            "a" : {
                "class" : "img"
            },
            "s" : {
                "opacity" : 0
            },
            "g" : {
                "opacity" : 1
            },
            "style-init" : function(init){
                return { 
                    "background-image" : "url(" + data["portrait-image"][0] + ")",
                    "background-size" : "contain",
                    "background-position" : "center",
                    "background-repeat" : "no-repeat"
                };
            }
        },

        "landscape" : {
            "p" : "box",
            "a" : {
                "class" : "sub-box"
            },
            "r" : function(e){
                return {
                    "display" : e.orientation.landscape ?
                    "block" : "none"
                }
            },
            "style-init" : function(init){
                return { 
                    "background-color" : "#" + data.landscape
                };
            }
        },

        "landscape-image" : {
            "p" : "landscape",
            "a" : {
                "class" : "img"
            },
            "s" : {
                "opacity" : 0
            },
            "g" : {
                "opacity" : 1
            },
            "style-init" : function(init){
                return { 
                    "background-image" : "url(" + data["landscape-image"][0] + ")",
                    "background-size" : "contain",
                    "background-position" : "center",
                    "background-repeat" : "no-repeat"
                };
            }
        }
    };

    /* ----------------------- BUILD ----------------------- */

    engine.data.loop(node_tree).run(function(node){

        /* node src */
        "n" in node ? node.src = document.createElement(node.n)
            : node.src = document.createElement("div");


        /* attributes */
        "a" in node && engine.data.loop(node.a).run(function(property, attr){
            node.src.setAttribute(attr, property);
        });


        /* inline styles */
        "s" in node &&
            engine.css.style(node.src, node.s);


        "style-init" in node &&
            engine.css.style(node.src, node["style-init"]());


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

    engine.events.set();

    engine.cmnd.get("url", function(url){

        target_url = url;

        document.body
            .appendChild(main_node);

        engine.events
            .run("resize");

        engine.data.loop(node_tree)
            .run(function(node){
                "g" in node &&
                    engine.css
                        .style(node.src, node.g);
            });
    });

    engine.cmnd.send("ready");
};