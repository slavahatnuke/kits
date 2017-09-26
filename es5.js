(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
    function Kit() {
        var creators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Kit);

        Object.defineProperty(this, '__kit', {
            value: {
                creators: {},
                values: {},
                decorator: function decorator(value, name) {
                    return value;
                }
            }
        });

        if (creators instanceof Kit) {
            creators = creators.__kit.creators;
        }

        for (var creator in creators) {
            this.add(creator, creators[creator]);
        }

        this.set = this.set.bind(this);
        this.add = this.add.bind(this);
        this.get = this.get.bind(this);
        this.create = this.create.bind(this);
        this.remove = this.remove.bind(this);
        this.defineDecorator = this.defineDecorator.bind(this);
    }

    _createClass(Kit, [{
        key: 'set',
        value: function set(name, creator) {
            return this.add(name, creator);
        }
    }, {
        key: 'add',
        value: function add(name, creator) {
            var _this = this;

            if (creator instanceof Function) {
                this.remove(name);

                if (this.__kit.creators[name] === undefined) {
                    Object.defineProperty(this, name, {
                        get: function get() {
                            return _this.get(name);
                        },
                        enumerable: true
                    });
                }

                this.__kit.creators[name] = creator;
            } else if (name instanceof Object && creator === undefined) {
                for (var key in name) {
                    this.add(key, name[key]);
                }
            } else {
                throw new Error('\'' + name + '\' : creator is not a function');
            }

            return this;
        }
    }, {
        key: 'get',
        value: function get(name) {
            var _this2 = this;

            if (Array.isArray(name)) {
                return name.map(function (name) {
                    return _this2.get(name);
                });
            }

            if (this.__kit.values[name] === undefined) {
                this.__kit.values[name] = this.create(name);
            }

            return this.__kit.values[name];
        }
    }, {
        key: 'create',
        value: function create(name) {
            if (this.__kit.creators[name]) {
                var value = this.__kit.creators[name](this);
                return this.__kit.decorator(value, name);
            }

            return undefined;
        }
    }, {
        key: 'remove',
        value: function remove(name) {
            if (this.__kit.values[name] !== undefined) {
                delete this.__kit.values[name];
            }

            if (this.__kit.creators[name]) {
                this.__kit.creators[name] = null;
            }
        }
    }, {
        key: 'defineDecorator',
        value: function defineDecorator(decorator) {
            if (decorator instanceof Function) {
                this.__kit.decorator = function (value, name) {
                    return decorator(value, name);
                };
            }
        }
    }]);

    return Kit;
}();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Kit = __webpack_require__(0);

module.exports = function (creators) {
    return new Kit(creators);
};

/***/ })
/******/ ]);
});