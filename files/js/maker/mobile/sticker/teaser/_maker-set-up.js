
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

    init_proto.data = function(name, init, f){
      var nd = name;
       if (~nd.indexOf('texts') && !isNaN(parseInt(nd.substr(-1))) && !f) {
         nd += 'title';
         init_proto.data(nd, init, true);
         nd = name + 'content';
       } else if (nd === 'button') {
         if (!data.button.display) {
           return;
         };
         nd += '-in';
       } else if (nd === 'background') {
         nd = 'img-box';
       };
        "style-init" in node_tree[nd] &&
            engine.css
                .style(node_tree[nd].src,
                       node_tree[nd]["style-init"](init));

        "content-init" in node_tree[nd] &&
                (node_tree[nd].src.innerHTML = node_tree[nd]["content-init"](init));
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
            "-webkit-transition" : "opacity .5s .4s",
            "-o-transition" : "opacity .5s .4s",
            "transition" : "opacity .5s .4s",
            "border-style" : "solid",
            "border-color" : "rgba(255, 255, 255, 0)",
            "max-height" : "100%",
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
            "-webkit-transition" : "opacity .4s,-webkit-transform .4s",
            "transition" : "opacity .4s,-webkit-transform .4s",
            "-o-transition" : "opacity .4s,transform .4s",
            "transition" : "opacity .4s,transform .4s",
            "transition" : "opacity .4s,transform .4s,-webkit-transform .4s",
            "box-shadow" : "10px 0px 25px 0px rgba(0, 0, 0, 0.4)",
        },

        ".—prx—main-box" : {
            "text-decoration" : "none",
            "cursor" : "pointer",
            "user-select" : "none",
            "-webkit-touch-callout" : "none",
            "overflow" : "hidden"

        },


        ".—prx—button" : {
            "display" : "block",
            "vertical-align" : "bottom",
            "right" : "0",
            "bottom" : "50%",
            "box-sizing" : "border-box",
            "border-style" : "solid",
            "border-color" : "rgba(0, 0, 0, 0)",
            "border-width" : "0",
            "overflow" : 'hidden'
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

        ".—prx—title, .—prx—text" : {
          "width" : "100%",
          "display" : "table",
          "-webkit-transition" : "opacity .4s,-webkit-transform .4s",
          "transition" : "opacity .4s,-webkit-transform .4s",
          "-o-transition" : "opacity .4s,transform .4s",
          "transition" : "opacity .4s,transform .4s",
          "transition" : "opacity .4s,transform .4s,-webkit-transform .4s",
        },

        ".—prx—title" : {
          "display" : "block",
          "text-align" : "center",
          "vertical-align" : "top"
        },

        ".—prx—text" : {
          "display" : "block",
          "vertical-align" : "middle"
        },

        ".—prx—text-box" : {
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

        ".—prx—text-box-1" : {
              "display" : "-webkit-flex",
          },

          ".—prx—text-box-2" : {
              "display" : "-moz-box",
          },

          ".—prx—text-box-3" : {
              "display" : "-ms-flexbox",
          },

          ".—prx—text-box-4" : {
              "display" : "flex",
          },

        ".—prx—text span" : {
          "vertical-align" : "middle",
          "display" : "table-cell",
          "text-align" : "center"
        }
    };

    var css_animations = {
      "—prx—button-color" : {
        "from" : {
          "filter" : "grayscale(60%)"
        },
        "50%" : {
          "filter" : "grayscale(0%)"
        },
        "to" : {
          "filter" : "grayscale(60%)"
        }
      },
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
                  "class" : '—prx—text-box —prx—text-box-1 —prx—text-box-2 —prx—text-box-3 —prx—text-box-4'
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
            "content-init" : function(init){
              var ini = init.button ? init.button : init;
                return ini.content;
            },
            "style-init" : function(init){
                var ini = init.button ? init.button : init;
                return {
                    "background-color" : "#" + ini.bg_color,
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
