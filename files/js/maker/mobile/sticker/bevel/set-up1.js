
;window.promo_set_up = function(engine, config){

  /* ------------------- Global Scope ------------------- */

  var preview_box = document
      .querySelector(form_config.preview);

  var data;

  var re_init = function(init){
      data = init;
  };

  re_init(config.maker.output());

  var run_reset = function(data){
      data ? re_init(data) : re_init(config.maker.output());
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
          "transform" : "translateX(0)",
          "position" : ""
      }, {
          "opacity" : 0,
          "transform" : "translateY(-100%)",
          "top" : "30%",
          "position" : "absolute"
      });

      inits_config.title = new create_init(data.text_duration, {
          "opacity" : 1,
          "transform" : "translateX(0)",
          "position" : ""
      }, {
          "opacity" : 0,
          "transform" : "translateY(-100%)",
          "top" : "0",
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
            "a" : { "class" : "—prx—image-item"},
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

    init_proto.title_content = function(name, item, order){
        var id = name + "title";
        node_tree[id] = {
            "n" : "span",
            "p" : name + "_title_in",
            "order" : order,
            "content-init" : function(init){
                return init.title;
            },
            "style-init" : function(init){
                return {
                    "color" : "#" + init.title_color,
                    "font-size" : init.title_size + "em",
                    "font-weight" : init.title_weight
                };
            },
        };
    };

    init_proto.text_content = function(name, item, order){
      var id = name + "content";
        node_tree[id] = {
            "n" : "span",
            "p" : name + "_in",
            "order" : order,
            "content-init" : function(init){
                return init.content;
            },
            "style-init" : function(init){
                return {
                    "color" : "#" + init.content_color,
                    "font-size" : init.content_size + "em",
                    "font-weight" : init.content_weight,
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

    init_proto.text_in = function(name, item, order){
        var id = name + "_in";
        node_tree[id] = {
            "p" : "text-box",
            "a" : {
              "class" : "—prx—text"
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
        init_proto["text_content"](name, item, order);
    };

    init_proto.title_in = function(name, item, order){
        var id = name + "_title_in";
        node_tree[id] = {
            "p" : "text-box",
            "a" : {
              "class" : "—prx—title"
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
        init_proto["title_content"](name, item, order);
    };

    init_proto.texts = function(name, item, order){
       init_proto["title_in"](name, item, order);
        init_proto["text_in"](name, item, order);
    };


    /* ------------------------ BOX ------------------------ */



    var box = {
      get "width"() {
        var sizeBlock = document.querySelector('.—prx—size');
        return sizeBlock.clientWidth
      },

      get "height"() {
        var sizeBlock = document.querySelector('.—prx—size');
        return sizeBlock.clientHeight
      }
    };

    /* ------------------------ CSS ------------------------ */
    var css_rules = {
        ".—prx—size" : {
          "opacity" : "0",
          "position" : "absolute",
          "left" : "0",
          "right" : "0",
          "top" : "0",
          "bottom" : "0",
          "z-index" : "-1",
        },

        ".—prx—img-box" : {
            "position" : "absolute",
            "top" : 0,
            "left" : 0,
            "box-sizing" : "border-box",
            "transition" : "opacity .5s .4s",
            "border-style" : "solid",
            "border-color" : "rgba(255, 255, 255, 0)",
            "max-height" : "100%",
            "overflow" : "hidden"
        },

        ".—prx—img-box, .—prx—text-box" : {
            "position" : "absolute"
        },

        ".—prx—image-item,.—prx—main-box,.—prx—message-box,.—prx—sub-box" : {
            "position" : "absolute",
            "width" : "100%",
            "height" : "100%",
            "top" : 0,
            "left": 0
        },

        ".—prx—image-item" : {
            "transition" : "opacity .4s,transform .4s",
            "box-shadow" : "10px 0px 25px 0px rgba(0, 0, 0, 0.4)",
        },

        ".—prx—main-box" : {
            "text-decoration" : "none",
            "cursor" : "pointer",
            "user-select" : "none",
            "-webkit-touch-callout" : "none",
            "overflow" : "hidden"

        },

        ".—prx—message-box" : {
            "transition" : "opacity .4s,transform .4s",
            "display" : "table"
        },

        ".—prx—button" : {
            "display" : "table-footer-group",
            "vertical-align" : "bottom",
            "right" : "0",
            "bottom" : "50%",
            "box-sizing" : "border-box",
            "border-style" : "solid",
            "border-color" : "rgba(0, 0, 0, 0)",
            "border-width" : "0"
        },

        ".—prx—button span" : {
            "white-space" : "nowrap",
            "text-overflow" : "ellipsis",
            "display" : "block",
            "margin" : "0 auto",
            "animation-duration" : "1s",
            "animation-iteration-count" : "infinite",
            "font-family" : "sans-serif"
        },

        ".—prx—shape-box" : {
            "transition" : "right .5s ease-in-out",
        },

        ".—prx—title, .—prx—text" : {
          "width" : "100%",
          "display" : "table",
          "transition" : "opacity .4s,transform .4s"
        },

        ".—prx—title" : {
          "display" : "table-header-group",
          "text-align" : "center",
          "vertical-align" : "top"
        },

        ".—prx—text" : {
          "display" : "table-row",
          "vertical-align" : "middle"
        },

        ".—prx—text-box" : {
            "z-index" : 1,
            "transition" : "opacity .5s .4s, transform .5s .4s",
            "text-align" : "center",
            "max-height" : "100%",
            "display" : "table",
            "display" : "flex",
            "display" : "-ms-flex",
            "display" : "-webkit-flex",
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

        ".—prx—text span" : {
          "vertical-align" : "middle",
          "display" : "table-cell",
          "text-align" : "center"
        }
    };

    var css_animations = {
      "—prx—color-red" : {
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
      "—prx—color-green" : {
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

    var node_tree, main_node, style_node;

    var set_node_tree = function(){

        main_node = (function(){
          var box = document.createElement("div");
          box.classList.add("—prx—main-box");
          return box;
        })();

        style_node = {
          "css_rules" : {
              "n" : "style",
              "p" : preview_box,
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
              "p" :preview_box,
              "a" : {
                  "data-style-type" : "css-animation"
              },
              "css" : function(){
                  engine.css
                      .animation(this.src, css_animations);
              }
          },
        };

        node_tree = {

          "size" : {
            "p" : main_node,
            "a" : {
              "class" : "—prx—size"
            },
          },

          "img-box" : {
              "p" : main_node,
              "a" : {
                  "class" : "—prx—sub-box"
              },
              "s" : {
                  "z-index" : 1,
              },

              "style-init" : function(init){
                  var ini = init.background ? init.background : init;
                  return {
                      "background-color" : "#" + ini
                  };
              }

          },

          "img" : {
              "p" : "img-box",
              "a" : {
                  "class" : "—prx—img-box"
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
                  "class" : '—prx—sub-box'
              },
              "s" : {
                  "z-index" : 3
              }
          },

          "text-box" : {
              "p" : "content-box",
              "a" : {
                  "class" : '—prx—text-box'
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

        engine.data.loop(["texts", "images"])
            .run(function(list){
                engine.data.loop(data[list])
                    .run(function(item, i){
                        var name = list + "#" + i;
                        init_proto[list](name, item, i);
                    });
            });

        if (data.button.display) {
          node_tree["button"] = {
              "p" : "text-box",
              "a" : {
                  "class" : '—prx—button'
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
            "content-init" : function(init){
              var ini = init.button ? init.button : init;
                return ini.content;
            },
            "style-init" : function(init){
                var ini = init.button ? init.button : init;
                return {
                    "animation-name" : ini.animation,
                    "color" : "#" + ini.color,
                    "font-size" : ini.size + "em",
                    "font-weight" : ini.weight,
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
    };

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
                        })() : init_proto.data(i, data);
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
                    engine.data.loop(["images", "text", "title"])
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
