
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
        "-webkit-transform" : "translateX(0)",
        "-ms-transform" : "translateX(0)",
        "transform" : "translateX(0)",
        "position" : ""
    }, {
      "opacity" : 0,
      "-webkit-transform" : "translateX(-100%)",
      "-ms-transform" : "translateX(-100%)",
      "transform" : "translateY(-100%)",
      "top" : "30%",
      "position" : "absolute"
    });

    inits_config.title = new create_init(data.text_duration, {
        "opacity" : 1,
        "-webkit-transform" : "translateX(0)",
        "-ms-transform" : "translateX(0)",
        "transform" : "translateX(0)",
        "position" : ""
    }, {
        "opacity" : 0,
        "-webkit-transform" : "translateX(-100%)",
        "-ms-transform" : "translateX(-100%)",
        "transform" : "translateY(-100%)",
        "top" : "0",
        "position" : "absolute"

    });

    inits_config.images = new create_init(data.image_duration, {
        "opacity" : 1,
        "-webkit-transform" : "scale(1)",
        "-ms-transform" : "scale(1)",
        "transform" : "scale(1)"
    }, {
        "opacity" : 0,
        "-webkit-transform" : "scale(1.2)",
        "-ms-transform" : "scale(1.2)",
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

    init_proto.title_content = function(parent, item){
        var name = parent + "title";
        node_tree[name] = {
            "n" : "span",
            "p" : parent,
            "content-init" : function(){
                return item.title;
            },
            "style-init" : function(){
                return {
                    "color" : "#" + item.title_color,
                    "font-size" : item.title_size + "em",
                    "font-weight" : item.title_weight
                };
            },
        };
    };

    init_proto.text_content = function(parent, item){
        var name = parent + "content";
        node_tree[name] = {
            "n" : "span",
            "p" : parent,
            "content-init" : function(){
                return item.content;
            },
            "style-init" : function(){
                return {
                    "color" : "#" + item.content_color,
                    "font-size" : item.content_size + "em",
                    "font-weight" : item.content_weight,
                };
            },
            "r" : function(e) {
              var o = e.device.orientation;
              return {
                "display" : o.portrait ? "inline-flex" : "block",
                "margin" : o.portrait ? "0 auto" : ""
              };
            }
        };
    };

    init_proto.text_in = function(parent, item){
        var name = parent + "_in";
        node_tree[name] = {
            "p" : "text-box",
            "a" : {
              "class" : "text"
            },
            "init" : "text",
            "r" : function(e) {
              var o = e.device.orientation;
              var d = e.device.type.mobile;
              return {
                "width" : o.portrait ? "" : data.button.display ? "65%" : "100%",
              }
            }
        };
        init_proto["text_content"](name, item);
    };

    init_proto.title_in = function(parent, item){
        var name = parent + "_title_in";
        node_tree[name] = {
            "p" : "text-box",
            "a" : {
              "class" : "title"
            },
            "init" : "title",
            "r" : function(e) {
              var o = e.device.orientation;
              var d = e.device.type.mobile;
              return {
                "width" : o.portrait ? "" : data.button.display ? "65%" : "100%",
                "padding-top" : o.portrait ? d ? "10px" : "20px" : ""
              }
            }
        };
        init_proto["title_content"](name, item);
    };

    init_proto.texts = function(parent, item){
       init_proto["title_in"](parent, item);
        init_proto["text_in"](parent, item);
    };


    /* ------------------------ BOX ------------------------ */



    var box = {
      get "width"() {
        var sizeBlock = document.querySelector('.size');
        return sizeBlock.clientWidth
      },

      get "height"() {
        var sizeBlock = document.querySelector('.size');
        return sizeBlock.clientHeight
      }
    }

    /* ------------------------ CSS ------------------------ */
    var css_rules = {
        ".size" : {
          "opacity" : "0",
          "position" : "absolute",
          "left" : "0",
          "right" : "0",
          "top" : "0",
          "bottom" : "0",
          "z-index" : "-1",
        },

        ".img-box" : {
            "position" : "absolute",
            "top" : 0,
            "left" : 0,
            "box-sizing" : "border-box",
            "-webkit-transition" : "opacity .5s .4s",
            "-o-transition" : "opacity .5s .4s",
            "transition" : "opacity .5s .4s",
            "border-style" : "solid",
            "border-color" : "rgba(255, 255, 255, 0)",
            "max-height" : "100%",
        },

        "body" : {
            "margin" : 0,
            "padding" : 0,
            "font-family" : "sans-serif",
            "text-size-adjust" : "100%"
        },

        ".img-box, .text-box" : {
            "position" : "absolute"
        },

        ".image-item,.main-box,.sub-box" : {
            "position" : "absolute",
            "width" : "100%",
            "height" : "100%",
            "top" : 0,
            "left": 0
        },

        ".image-item" : {
            "-webkit-transition" : "opacity .4s,-webkit-transform .4s",
            "transition" : "opacity .4s,-webkit-transform .4s",
            "-o-transition" : "opacity .4s,transform .4s",
            "transition" : "opacity .4s,transform .4s",
            "transition" : "opacity .4s,transform .4s,-webkit-transform .4s",
            "box-shadow" : "10px 0px 25px 0px rgba(0, 0, 0, 0.4)",
        },

        ".main-box" : {
            "text-decoration" : "none",
            "cursor" : "pointer",
            "user-select" : "none",
            "-webkit-touch-callout" : "none",
            "overflow" : "hidden"

        },

        ".button" : {
            "display" : "block",
            "vertical-align" : "bottom",
            "right" : "0",
            "bottom" : "50%",
            "box-sizing" : "border-box",
            "border-style" : "solid",
            "border-color" : "rgba(0, 0, 0, 0)",
            "border-width" : "0",
            "overflow" : "hidden"
        },

        ".button span" : {
            "white-space" : "nowrap",
            "text-overflow" : "ellipsis",
            "display" : "block",
            "margin" : "0 auto",
            "animation-duration" : "1s",
            "animation-iteration-count" : "infinite",
            "font-family" : "sans-serif"
        },

        ".title, .text" : {
          "width" : "100%",
          "display" : "table",
          "-webkit-transition" : "opacity .4s,-webkit-transform .4s",
          "transition" : "opacity .4s,-webkit-transform .4s",
          "-o-transition" : "opacity .4s,transform .4s",
          "transition" : "opacity .4s,transform .4s",
          "transition" : "opacity .4s,transform .4s,-webkit-transform .4s",
        },

        ".title" : {
          "display" : "block",
          "text-align" : "center",
          "vertical-align" : "top"
        },

        ".text" : {
          "display" : "block",
          "vertical-align" : "middle"
        },

        ".text-box" : {
          "z-index" : 1,
          "-webkit-transition" : "opacity .5s .4s, -webkit-transform .5s .4s",
          "transition" : "opacity .5s .4s, -webkit-transform .5s .4s",
          "-o-transition" : "opacity .5s .4s, transform .5s .4s",
          "transition" : "opacity .5s .4s, transform .5s .4s",
          "transition" : "opacity .5s .4s, transform .5s .4s, -webkit-transform .5s .4s",
          "text-align" : "center",
          "max-height" : "100%",
          "display" : "-webkit-box",
          "-webkit-flex-direction" : "column",
          "-ms-flex-direction" : "column",
          "flex-direction" : "column",
          "-webkit-box-orient" : "vertical",
          "-webkit-box-pack" : "justify",
          "-webkit-justify-content" : "space-between",
          "justify-content" : "space-between",
          "height" : "100%",
          "box-sizing" : "border-box",
          "border-left" : "none",
          "right" : "0"
        },

        ".text-box-1" : {
            "display" : "-webkit-flex",
        },

        ".text-box-2" : {
            "display" : "-moz-box",
        },

        ".—prx—text-box-3" : {
            "display" : "-ms-flexbox",
        },

        ".—prx—text-box-4" : {
            "display" : "flex",
        },

        ".text span" : {
          "vertical-align" : "middle",
          "display" : "table-cell",
          "text-align" : "center"
        }
    };

    var css_animations = {
      "color-red" : {
        "from" : {
          "background-color" : "#ff0000"
        },
        "50%" : {
          "background-color" : "#a70505"
        },
        "to" : {
          "background-color" : "#ff0000"
        }
      },
      "color-green" : {
        "from" : {
          "background-color" : "#37c500"
        },
        "50%" : {
          "background-color" : "#268700"
        },
        "to" : {
          "background-color" : "#37c500"
        }
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
                "data-style-type" : "css-animation"
            },
            "css" : function(){
                engine.css
                    .animation(this.src, css_animations);
            }
        },

        "size" : {
          "p" : engine.box,
          "a" : {
            "class" : "size"
          },
        },

        "img-box" : {
            "p" : engine.box,
            "a" : {
                "class" : "sub-box"
            },
            "s" : {
                "z-index" : 1,
            },

            "style-init" : function(){
                return {
                    "background-color" : "#" + data.background
                };
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
              var o = e.device.orientation.landscape;
              var d = e.device.type.mobile;
              var width = o ? box.height : box.width / 2 > box.height ? box.height : box.width / 2;
                return {
                    "width" : width + "px",
                    "height" : width + "px",
                    "border-width" : o ? "0" : d ? 10 * e.scale + "px" : 20 * e.scale + "px",
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
                "class" : 'text-box text-box-1 text-box-2 text-box-3 text-box-4'
            },
            "s" : {
                "opacity" : 0,
                "-webkit-transform" : "translateX(-15%)",
                "-ms-transform" : "translateX(-15%)",
                "transform" : "translateX(-15%)"
            },
            "g" : {
                "opacity" : 1,
                "-webkit-transform" : "translateX(0)",
                "-ms-transform" : "translateX(0)",
                "transform" : "translateX(0)"
            },
            "r" : function(e){
                var o = e.device.orientation,
                    d = e.device.type.mobile,
                    marg = o.portrait ? d ? 10 : 15 : 20,
                    width = o.portrait ? box.height : box.width / 2 > box.height ? box.height : box.width / 2;
                width = width > screen.width / 2 ? screen.width / 2 : width;

                return {
                    "width" : box.width - width + "px",
                    "border" : marg + "px solid rgba(0, 0, 0, 0)",
                    "-webkit-justify-content" : (o.portrait && data.button.display) ? "space-between" : "center",
                    "justify-content" : (o.portrait && data.button.display) ? "space-between" : "center",
                    "-webkit-box-pack" : (o.portrait && data.button.display) ? "justify" : "center"
                }
            }
        },
    };

    engine.data.loop(["images", "texts"]).run(function(list){
        engine.data.loop(data[list]).run(function(item, i){
            var name = list + "_init_" + i;
            init_proto[list](name, item);
        });
    });

    if (data.button.display) {
      node_tree["button"] = {
          "p" : "text-box",
          "a" : {
              "class" : 'button'
          },
          "r" : function(e) {
            var d = e.device.type.mobile;
            var o = e.device.orientation;
            return {
              "position" : o.portrait ? "static" : "absolute",
              "border-left-width" : o.landscape ? "20px" : "",
              "width" : o.landscape ? "35%" : "",
              "-webkit-transform" : o.landscape ? "translateY(50%)" : "",
              "-ms-transform" : o.landscape ? "translateY(50%)" : "",
              "transform" : o.landscape ? "translateY(50%)" : "",
            }
          }
    };

    node_tree["button-in"] = {
        "n" : "span",
        "p" : "button",
        "content-init" : function(){
            return data.button.content;
        },
        "style-init" : function(){
            return {
                "animation-name" : data.button.animation,
                "color" : "#" + data.button.color,
                "font-size" : data.button.size + "em",
                "font-weight" : data.button.weight,
            };
        },
        "r" : function(e){
          var d = e.device.type.mobile;
          var o = e.device.orientation;
            return {
                "padding" : e.device.type.mobile && o.portrait ?
                                6 * e.scale + "px " + 12 * e.scale + "px"
                                    : !e.device.type.mobile && o.portrait ?
                                      12 * e.scale + "px " + 14 * e.scale + "px"
                                        : e.device.type.mobile ?
                                          8 * e.scale + "px " + "0px"
                                            :  12 * e.scale + "px " + "0px",
                "border-radius" : d ? 7 * e.scale + "px" : 15 * e.scale + "px",
                "width" : o.landscape ? "" : d ? "66%" : "50%"
            }
        }
    };
    };



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

    engine.embeded ? appear() : (
        engine.cmnd.pull.show = appear,
        engine.cmnd       .gain    (),
        engine.cmnd.send  .bounce  (),
        engine.cmnd.send  .ready   ()
    );

};
