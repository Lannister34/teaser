
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

    var run_change = function(init){
        init_proto.data(init.name, init.data);
    };

    config.maker
        .change(run_change);

    config.maker
        .init(run_reset);


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

    var set_inits = function(){

        inits_config.text = new create_init(data.text_duration, {
            "opacity" : 1,
            "transform" : "translateX(0)",
            "position" : ""
        }, {
            "opacity" : 0,
            "transform" : "translateX(30%)",
            "position" : "absolute"
        });

        inits_config.title = new create_init(data.text_duration, {
            "opacity" : 1,
            "transform" : "translateX(0)",
            "position" : ""
        }, {
            "opacity" : 0,
            "transform" : "translateX(30%)",
            "position" : "absolute"

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
        var name = parent + "_title_content";
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
                    "font-weight" : item.weight,
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
                "display" : o.portrait ? "table-row" : "block"
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
                "display" : o.portrait ? "table-header-group" : "block",
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
          "position" : "fixed",
          "height" : "100%",
          "width" : "100%",
          "z-index" : "-1",
        },

        ".main-box,body" : {
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
            "transition" : "opacity .4s,transform .4s",
            "box-shadow" : "10px 0px 25px 0px rgba(0, 0, 0, 0.4)",
        },

        ".main-box" : {
            "text-decoration" : "none",
            "cursor" : "pointer",
            "user-select" : "none",
            "-webkit-touch-callout" : "none"

        },

        ".message-box" : {
            "transition" : "opacity .4s,transform .4s",
            "display" : "table"
        },

        ".button" : {
            "display" : "table-footer-group",
            "vertical-align" : "bottom",
            "right" : "0",
            "bottom" : "50%",
            "box-sizing" : "border-box",
            "border-style" : "solid",
            "border-color" : "rgba(0, 0, 0, 0)",
            "border-width" : "0"
        },


        ".shape" : {
            "width" : "100%",
        },

        ".button span" : {
            "white-space" : "nowrap",
            "text-overflow" : "ellipsis",
            "display" : "block",
            "margin" : "0 auto",
            "animation" : "color 1s infinite"
        },

        ".shape-box" : {
            "transition" : "right .5s ease-in-out",
        },

        ".title, .text" : {
          "width" : "100%",
          "display" : "table",
          "transition" : "opacity .4s,transform .4s"
        },

        ".title" : {
          "display" : "table-header-group",
          "text-align" : "center",
          "vertical-align" : "top"
        },

        ".text" : {
          "display" : "table-row",
          "vertical-align" : "middle"
        },

        ".img-box" : {
            "left" : 0,
            "box-sizing" : "border-box",
            "transition" : "opacity .5s .4s",
            "border-style" : "solid",
            "border-color" : "#fff",
            "max-height" : "100%"
        },

        ".text-box" : {
            "z-index" : 1,
            "transition" : "opacity .5s .4s, transform .5s .4s",
            "text-align" : "center",
            "max-height" : "100%",
            "display" : "table",
            "display" : "-webkit-flex",
            "display" : "-ms-flex",
            "display" : "flex",
            "-webkit-flex-direction" : "column",
            "-ms-flex-direction" : "column",
            "flex-direction" : "column",
            "-webkit-justify-content" : "space-between",
            "justify-content" : "space-between",
            "height" : "100%",
            "box-sizing" : "border-box",
            "border-left" : "none",
            "right" : "0"
        },

        ".text span" : {
          "vertical-align" : "middle",
          "display" : "table-cell",
          "text-align" : "center"
        }
    };

    var css_animations = {
      "color" : {
        "from" : {
          "background-color" : "#ff0000"
        },
        "50%" : {
          "background-color" : "#a70505"
        },
        "to" : {
          "background-color" : "#ff0000"
        }
      }
    };



    /* ----------------------- NODES ----------------------- */

    var node_tree, main_node;

    var set_node_tree = function(){

        main_node = (function(){
            var box = document.createElement("div");
            box.classList.add("main-box");
            return box;
        })();

        node_tree = {

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

            "size" : {
              "p" : main_node,
              "a" : {
                "class" : "size"
              },
            },

            "img-box" : {
                "p" : main_node,
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
                "p" : main_node,
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
                  "display" : o.portrait ? "table-footer-group" : "block",
                  "position" : o.portrait ? "static" : "absolute",
                  "border-left-width" : o.landscape ? "20px" : "",
                  "width" : o.landscape ? "35%" : "",
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
    };



    /* ----------------------- BUILD ----------------------- */

    var build_node_tree = function(condition){

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

        engine.events.set(config.maker);
    };

    var appear = function(){

        engine.events.run("resize");
        window.setTimeout(function(){
            engine.data.loop(node_tree).run(function(node){
                "g" in node && engine.css.style(node.src, node.g);
            });
            engine.config && engine.tracker.show();
        }, 50);

        /*var t = setInterval(function(){
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
        }, 50)*/
    };

    var set_promo = function(condition){

        config.maker.promo = 
            main_node;

        preview_box
            .appendChild(main_node);

        engine.events.run("resize");

        engine.data.loop(inits_config).run(function(init){
            init.r();
        });
    };

    var re_set = function(condition){

        !condition && (function(){
            preview_box.removeChild(main_node);
            engine.events.remove.evt("resize");
        })();

        set_inits();
        set_node_tree();

        /*condition &&
            build_styles();*/

        condition &&
            appear();

        build_node_tree(condition);
        set_promo(condition);
    };

    re_set(true);

    /*engine.cmnd.pull.show = appear;
    engine.cmnd       .gain    ();
    engine.cmnd.send  .bounce  ();
    engine.cmnd.send  .ready   ();*/

};
