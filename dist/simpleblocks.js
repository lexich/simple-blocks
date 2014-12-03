(function() {
  var ComponentsHolder,
    __slice = [].slice;

  ComponentsHolder = function($) {
    var ATTR, destroyItem, initializer, remove, resolve, scope;
    if (typeof String.prototype.trim !== "function") {
      String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "");
      };
    }
    ATTR = "data-sblock";
    destroyItem = function($el, name, c) {
      var names, val;
      c.destroy($el);
      $el.removeAttr("" + ATTR + "-" + name);
      if ($el.is("[" + ATTR + "]")) {
        val = $el.attr(ATTR);
        names = val.split(",");
        if (names.indexOf(name) < 0) {
          names.push(name);
          val = names.join(",");
        }
        return $el.attr(ATTR, val);
      } else {
        return $el.attr(ATTR, name);
      }
    };
    initializer = function() {
      var attr_prop, blocks, get_names, selectors, selectors_array;
      blocks = {};
      selectors = {};
      selectors_array = [];
      attr_prop = function() {
        return ["[" + ATTR + "]"].concat(selectors_array).join(",");
      };
      get_names = function($el) {
        var attr_val, name, names, selector;
        attr_val = $el.attr(ATTR);
        names = attr_val ? attr_val.split(" ") : [];
        for (name in selectors) {
          selector = selectors[name];
          if ($el.is(selector) && names.indexOf(name) < 0) {
            names.push(name);
          }
        }
        $el.attr(ATTR, names.join(" "));
        return names;
      };
      return {
        add: function(block, options) {
          var name;
          if (!options) {
            name = block.name;
          } else if (options.toString() === "[object Object]") {
            name = options.name || block.name;
            if (options.selector) {
              selectors[name] = options.selector;
              selectors_array.push(options.selector);
            }
          } else {
            name = options || block.name;
          }
          if (!name) {
            return "blocks:need name";
          }
          if (block.init == null) {
            return "blocks:" + name + " block.init == null";
          }
          if (block.destroy == null) {
            return "blocks:" + name + " block.destroy == null";
          }
          if (blocks[name] != null) {
            return "blocks:" + name + " block is already define";
          }
          blocks[name] = block;
          return null;
        },
        item: function() {
          var $el, args, c, name, options;
          name = arguments[0], $el = arguments[1], options = arguments[2], args = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
          c = blocks[name];
          if (!c) {
            return "block not found";
          }
          if ($el.is("[" + ATTR + "-" + name + "]")) {
            return "block is initialized";
          }
          if (options) {
            $el.data(name, options);
          } else {
            options = $el.data(name);
          }
          c.init.apply(c, [$el, options].concat(args));
          $el.attr("" + ATTR + "-" + name, "");
          return null;
        },
        init: function() {
          var $items, $root, args, name, names, selector, _i, _len, _this;
          $root = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          _this = this;
          selector = attr_prop();
          if ($root.is(selector)) {
            names = get_names($root);
            for (_i = 0, _len = names.length; _i < _len; _i++) {
              name = names[_i];
              name = name.trim();
              _this.item.apply(_this, [name, $root].concat(args));
            }
          }
          $items = $root.find(selector);
          $items.each(function(i) {
            var $el, _j, _len1, _results;
            $el = $items.eq(i);
            names = get_names($el);
            _results = [];
            for (_j = 0, _len1 = names.length; _j < _len1; _j++) {
              name = names[_j];
              name = name.trim();
              _results.push(_this.item.apply(_this, [name, $el].concat(args)));
            }
            return _results;
          });
          return null;
        },
        destroy: function($root) {
          var $items, c, name;
          for (name in blocks) {
            c = blocks[name];
            $items = $root.find("[" + ATTR + "-" + name + "]");
            $items.each(function(i) {
              return destroyItem($items.eq(i), name, c);
            });
            if ($root.is("[" + ATTR + "-" + name + "]")) {
              destroyItem($root, name, c);
            }
          }
          return null;
        },
        api: function() {
          var $el, $items, args, block, funcname, name, _func;
          name = arguments[0], funcname = arguments[1], $el = arguments[2], args = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
          block = blocks[name];
          if (!block) {
            return "block \"" + name + "\" not found";
          }
          if (!block.api) {
            return "api property not found in \"" + name + "\" block";
          }
          _func = block.api[funcname];
          if (!_func) {
            return "method \"" + funcname + "\" not found in api of \"" + name + "\" block";
          }
          $items = $el.find("[" + ATTR + "-" + name + "]");
          $items.each(function(i) {
            return _func.apply(null, [$items].concat(args));
          });
          if ($el.is("[" + ATTR + "-" + name + "]")) {
            _func.apply(null, [$el].concat(args));
          }
          return null;
        }
      };
    };
    scope = {};
    remove = function(name) {
      if (name == null) {
        name = "";
      }
      if (scope[name] != null) {
        return scope[name] = null;
      }
    };
    resolve = function(name) {
      if (name == null) {
        name = "";
      }
      return scope[name] || (scope[name] = initializer());
    };
    resolve.remove = remove;
    return resolve;
  };

  ComponentsHolder.version = "0.0.3";

  if ((typeof define === "function") && (typeof define.amd === "object") && define.amd) {
    define(["jquery"], function($) {
      return ComponentsHolder($);
    });
  } else {
    window.sblock = ComponentsHolder(jQuery || $);
  }

}).call(this);
