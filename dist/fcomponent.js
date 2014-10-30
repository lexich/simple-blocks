(function() {
  var ComponentsHolder,
    __slice = [].slice;

  ComponentsHolder = function($) {
    var ATTR;
    if (typeof String.prototype.trim !== 'function') {
      String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
      };
    }
    ATTR = "data-component";
    return (function($) {
      var components;
      components = {};
      return {
        add: function(component, name) {
          if (name == null) {
            name = component.name;
          }
          if (!name) {
            throw new Error("Components:need name");
          }
          if (component.init == null) {
            throw new Error("Components:" + name + " component.init == null ");
          }
          if (component.destroy == null) {
            throw new Error("Components:" + name + " component.destroy == null ");
          }
          return components[name] = component;
        },
        item: function() {
          var $el, args, c, name, options;
          name = arguments[0], $el = arguments[1], options = arguments[2], args = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
          c = components[name];
          if (!c) {
            return;
          }
          if ($el.is("[" + ATTR + "-" + name + "]")) {
            return;
          }
          if (options) {
            $el.data(name, options);
          } else {
            options = $el.data(name);
          }
          c.init.apply(c, [$el, options].concat(args));
          return $el.attr("" + ATTR + "-" + name, "");
        },
        init: function() {
          var $items, $root, args, _this;
          $root = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          $items = $root.find("[" + ATTR + "]");
          _this = this;
          return $items.each(function(i) {
            var $el, name, names, _i, _len, _results;
            $el = $items.eq(i);
            names = $el.attr(ATTR).split();
            _results = [];
            for (_i = 0, _len = names.length; _i < _len; _i++) {
              name = names[_i];
              name = name.trim();
              _results.push(_this.item.apply(_this, [name, $el].concat(args)));
            }
            return _results;
          });
        },
        destroy: function($root) {
          var $items, c, name, _results;
          _results = [];
          for (name in components) {
            c = components[name];
            $items = $root.find("[" + ATTR + "-" + name + "]");
            _results.push($items.each(function(i) {
              var $el, val;
              $el = $items.eq(i);
              c.destroy($el);
              $el.removeAttr("" + ATTR + "-" + name);
              if ($el.is("[" + ATTR + "]")) {
                val = $el.attr(ATTR);
                return $el.attr(ATTR, val.split(",").concat(name).join(","));
              } else {
                return $el.attr(ATTR, name);
              }
            }));
          }
          return _results;
        },
        api: function() {
          var $el, $items, args, component, funcname, name, _func;
          name = arguments[0], funcname = arguments[1], $el = arguments[2], args = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
          component = components[name];
          if (component.api) {
            return "not api";
          }
          _func = component.api[funcname];
          if (!_func) {
            return "not api:" + funcname;
          }
          $items = $el.find("[" + ATTR + "-" + name + "]");
          $items.each(function(i) {
            return _func.apply(null, [$items].concat(args));
          });
          if ($el.is("[" + ATTR + "-" + name + "]")) {
            return _func.apply(null, [$el].concat(args));
          }
        }
      };
    })($);
  };

  ComponentsHolder.version = "0.0.1";

  if ((typeof define === 'function') && (typeof define.amd === 'object') && define.amd) {
    define(["jquery"], function($) {
      return ComponentsHolder($);
    });
  } else {
    window.ServerClient = ComponentsHolder(jQuery || $);
  }

}).call(this);