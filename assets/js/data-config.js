
window.data_config = function(form, config){

    this.form = document
            .querySelector(form);

    this.tools = {

        "init"        :   {},
        "config"      :   {},
        "form"        :   this.form,

        "loop"        :   function(data){
            var a = function(callback){
                var step = 0;
                for(step; step < data.length; step++){
                    callback(data[step], step, data);
                };
            };

            var o = function(callback){
                var prop;
                for(prop in data){
                    data.hasOwnProperty(prop) &&
                        callback(data[prop], prop, data);
                };
            };

            return {
                "run" : Array.isArray(data)
                            ? a : o
            };
        },

        "nodes"       :   function(node, selector){
            var result = [];

            this.loop(node.querySelectorAll(selector || "*"))
                .run(function(n){
                    n instanceof Node &&
                        result.push(n);
                });

            return result;
        },

        "data-set"    :   {
            "other" : function(e){
                e.onchange = function(){
                    this.maker.options
                        .change(this.maker.options["change-data"](this));
                };
            },

            "text" : function(e){
                e.onkeyup = function(){
                    this.maker.options
                        .change(this.maker.options["change-data"](this));
                };
            },

            "interval" : function(e){
                e.onkeyup = function(){
                    var _value = this[this.maker.value];
                    (_value >= 1 && _value <= 99) &&
                        this.maker.options
                            .re_init(this.maker.options.form.maker.output());
                };

            },

            "checkbox" : function(e){
                e.onchange = function(){
                var data = config.maker.output();
                data.button.display = this.checked ? true : false;
                    this.maker.options
                            .re_init(data);
                };
            },

            "range" : function(e){
                e.oninput = function(){
                    this.maker.options
                        .change(this.maker.options["change-data"](this));
                };

                e.onchange = function(){
                    this.maker.options
                        .change(this.maker.options["change-data"](this));
                };
            },

            "js-color" : function(e){

                new jscolor(e, {
                    onFineChange : function(){
                        var _this = this.targetElement;
                        _this.maker.options
                            .change(_this.maker.options["change-data"](_this))
                    }
                });

            },

            "drop-zone" : function(e){
                new Dropzone(e, config.options.gallery)

                .on("addedfile", function(e){
                    this.on("thumbnail", function(e){
                        var _this = this.element;
                        _this.maker.parent.maker.options
                        .re_init(_this.maker.parent.maker.options.form.maker.output());
                    });
                })

                .on("removedfile", function(){
                    var _this = this.element;
                    _this.maker.parent.maker.options
                        .re_init(_this.maker.parent.maker.options.form.maker.output());
                });
            },
        },

        "change-data" : function(e){
            var parent = e.maker.parent.maker.name;
            var name = ~parent.indexOf('texts') ? (~e.maker.name.indexOf('title') ? parent + 'title'
                       : ~e.maker.name.indexOf('content') ? parent + 'content'  : parent) :
                       ~parent.indexOf('button') ? parent + '-in' :  parent;
                name = name === 'background' ? 'img-box' : name;
            return {
                "name" : name,
                "data" : e.maker.parent.maker.output()
            };
        }
    };

    var init = this.tools.init;

    init.list = function(list){

        list.maker.setup = function(){

            var _this = this;

            this.lable = this.self
                .getAttribute("data-list");

            this.selector = this.lable ?
                "[data-item=" + this.lable + "]"
                    : "[data-item]";

            this.options.loop(this.options.nodes(this.self, this.selector))
                .run(function(item, i){

                    i === 0 &&
                        (function(){
                            _this.temp = item.cloneNode(true);
                        })();

                    _this.item(item, i);

                });
        };

        list.maker.set = function(){

            var _this = this;

            this.count = -1;
            this.list = [];

            this.options.loop(this.options.nodes(this.self, this.selector))
                .run(function(item){
                    _this.count++;
                    item.maker.name = _this.name + "#" + _this.count;
                    _this.list.push(item);
                });

        };

        list.maker.template = function(){
            return this.temp.cloneNode(true);
        }

        list.maker.item = function(item, index){

            var _this = this;

            item.maker = {

                "options"         :   this.options,

                "parent"          :   this.self,
                "parent-name"     :   this.name,
                "name"            :   this.name + "#" + index,

                "self"            :   item,
                "type"            :   item.getAttribute("data-type"),

                "add-button"      :   item.querySelector(this.lable ?
                                        "[data-list-add=" + this.lable + "]"
                                            : "[data-list-add]"),

                "remove-button"   :   item.querySelector(this.lable ?
                                        "[data-list-remove=" + this.lable + "]"
                                            : "[data-list-remove]")
            };

            item.maker["add-button"] && (function(button){

                button.maker = {
                    "parent" : item
                };

                button.onclick = function(){
                    return false;
                };

                button.onmousedown = function(){
                    this.maker.parent.maker
                        .parent.maker.add(this.maker.parent);
                };

            })(item.maker["add-button"]);

            item.maker["remove-button"] && (function(button){

                button.maker = {
                    "parent" : item
                };

                button.onclick = function(){
                    return false;
                };

                button.onmousedown = function(){
                    this.maker.parent.maker
                        .parent.maker.remove(this.maker.parent);
                };

            })(item.maker["remove-button"]);

            this.options
                .init[item.maker.type](item);
        };

        list.maker.add = function(item){

            var template = this.template();

            this.self
                .insertBefore(template, item.nextSibling);

            this.item(template, this.count + 1);

            this.set();

            this.options.re_init(this.options.form.maker.output());
        };

        list.maker.remove = function(item){

            var _this = this;

            this.list.length < 2 ?

                alert("Список не может быть пустым")

                    : (function(){
                        _this.self.removeChild(item);
                        _this.set();
                        _this.options.re_init(_this.options.form.maker.output());
                    })();
        };

        list.maker.output = function(){
            var result = [];
            this.options.loop(this.list)
                .run(function(item, i){
                    result[i] = item.maker.output();
                });
            return result;
        };

        list.maker.setup();
        list.maker.set();
    };


    init.gallery = function(item, options){

        item.maker.gallery = item
            .querySelector("[data-set=drop-zone]");

        item.maker.gallery.maker = {
            "options" :   options,
            "self"    :   item.maker.gallery,
            "parent"  :   item
        };

        item.maker.options["data-set"]
            ["drop-zone"](item.maker.gallery);

        item.maker.output = function(){
            var result = [];
            this.gallery.dropzone.files < 1 ?
                result.push(this.gallery.dropzone["def-image"])
                    : this.options.loop(this.gallery.dropzone.files)
                            .run(function(img){
                                result.push(img.dataURL);
                            });
            return result;
        };
    };

    init.value = function(item, options){

        var child = item.
            querySelector("[data-set]");

        child.maker = {
            "options" :   options,
            "self"    :   child,
            "parent"  :   item,
            "value"   :   child.hasAttribute("data-value") ?
                            child.getAttribute("data-value")
                                : "value"
        };

        child.getAttribute("data-set") ?
            child.maker.options["data-set"][child.getAttribute("data-set")](child)
                : child.maker.options["data-set"]["other"](child);

        item.maker
            .child = child;

        item.maker.output = function(){
            return this.child[this.child.maker.value];
        };
    };

    init.option = function(item, parent){

        item.maker = {
            "options"      :   parent.maker.options,
            "name"         :   item.getAttribute("data-name"),

            "value"        :   item.hasAttribute("data-value") ?
                                    item.getAttribute("data-value")
                                        : "value",
            "self"         :   item,
            "parent"       :   parent
        };

        item.hasAttribute("data-set") ?
            item.maker.options["data-set"][item.getAttribute("data-set")](item)
                : item.maker.options["data-set"]["other"](item);
    };

    init.options = function(item){

        item.maker.issues = [];

        item.maker.output = function(){
            var result = {};
            this.options.loop(this.issues)
                .run(function(option){

                    result[option.maker.name] =
                        option[option.maker.value];
                });

            return result;
        };

        item.maker.options.loop(item.maker.options.nodes(item, "[data-name]"))
            .run(function(option){

                item.maker
                    .issues.push(option);

                item.maker.options
                    .init.option(option, item);
            });

    }

    init.row = function(row, options){

        row.maker = {
            "options" :   options,
            "self"    :   row,
            "name"    :   row.getAttribute("data-row"),
            "type"    :   row.getAttribute("data-type"),
        };

        row.maker.options.config[row.maker.name] = row;
        row.maker.options.init[row.maker.type](row, options);
    };

    this.form.maker = {
        "options" :   this.tools,
        "self"    :   this.form,

        "output"  :   function(){
            var result = {};
            this.options.loop(this.options.config)
                .run(function(row){
                    result[row.maker.name] = row.maker.output();
                });
            return result;
        },

        "start"   :   function(){
            var _this = this;
            this.options.loop(this.options.nodes(this.self, "[data-row]"))
                .run(function(row){
                     _this.options.init.row(row, _this.options);
                });
        }
    };

    config.maker = {

        "form"      : this.form,
        "output"    : function(){
            return this.form.maker.output();
        },
        "change"    : function(callback){
            this.form.maker.options.change = callback;
        },
        "init"      : function(callback){
            this.form.maker.options.re_init = callback;
        }
    };

    this.form.maker.start();

};
