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

    init.temp = {};

    init.temp.images = function(name, item){

        _dom.map[name] = {
            "p" : "img-box",
            "a" : {
                "class" : "sub img-item"
            },
            "s" : {
                "background-color" : "#" + item.color
            },
            "init" : "images"
        };

        _dom.map[name + "-img"] = {
            "p" : name,
            "a" : {
                "class" : "img"
            },
            "s" : {
                "background-image" : "url(" + item.image + ")",
                "background-position" : "center",
                "background-repeat" : "no-repeat",
                "background-size" : "auto 100%",

                "opacity" : 0
            },
            "r" : {
                "opacity" : 1
            }
        }
    };


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

        ".sub" : {
            "position" : "absolute",
            "width" : "100%", "height" : "100%",
            "top" : 0, "left" : 0
        },

        ".box" : {

            "font-family" : "sans-serif",
            "text-size-adjust" : "100%",
            "border-radius" : "22px",
            "text-decoration" : "none",

            "cursor" : "pointer",

            "user-select" : "none",
            "-webkit-touch-callout" : "none",

            "overflow" : "hidden"
        },

        ".img-box" : {
            "position" : "absolute",
            "height" : "100%",
            "left" : 0, "bottom" : 0,
            "overflow" : "hidden",

            "transition" : "width .6s"
        },

        ".img" : {
            "position" : "absolute",
            "width" : "auto", "height" : "auto",
            "max-width" : "100%", "max-height" : "100%",
            "margin" : "auto",

            "top" : 0, "bottom" : 0,
            "left" : 0, "right" : 0,

            "transition" : "opacity .6s"
        },

        ".img-item" : {
            "transition" : "opacity .5s, transform .5s"
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



        /* main ------- */

        "main" : {
            "a" : {
                "class" : "box sub",
                "onclick" : "_trigger();"
            },
        },

        "img-box" : {
            "p" : "main",
            "a" : {
                "class" : "img-box"
            },
            "s" : {
                "width" : 0
            },
            "r" : {
                "width" : "100%"
            }
        }

    };

    engine.data.loop(data.images)
        .run(function(img, i){
            init.temp.images("image-" + i, img);
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

        init.images.r();

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