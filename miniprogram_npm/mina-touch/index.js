module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1701393817378, function(require, module, exports) {
const DEFAULT_OPTIONS = {
    touchStart: function () { },
    touchMove: function () { },
    touchEnd: function () { },
    touchCancel: function () { },
    multipointStart: function () { },
    multipointEnd: function () { },
    tap: function () { },
    doubleTap: function () { },
    longTap: function () { },
    singleTap: function () { },
    rotate: function () { },
    pinch: function () { },
    pressMove: function () { },
    swipe: function () { }
}
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });class MinaTouch {
    constructor(_page, name, option = {}) {
        this.preV = { x: null, y: null };
        this.pinchStartLen = null;
        this.scale = 1;
        this.isDoubleTap = false;

        this.delta = null;
        this.last = null;
        this.now = null;
        this.tapTimeout = null;
        this.singleTapTimeout = null;
        this.longTapTimeout = null;
        this.swipeTimeout = null;
        this.x1 = this.x2 = this.y1 = this.y2 = null;
        this.preTapPosition = { x: null, y: null };

        this.lastZoom = 1;
        this.tempZoom = 1;

        try {
            if (this._checkBeforeCreate(_page, name)) {
                this._name = name
                this._option = { ...DEFAULT_OPTIONS, ...option }
                _page[name] = this
                this._bindFunc(_page)
            }
        } catch (error) {
            console.error(error)
        }
    }
    _checkBeforeCreate(_page, name) {
        if (!_page || !name) {
            throw new Error('MinaTouch实例化时，必须传入page对象和引用名')
        }
        if (_page[name]) {
            throw new Error('MinaTouch实例化error： ' + name + ' 已经存在page中')
        }
        return true
    }
    _bindFunc(_page) {
        let funcNames = ['start', 'move', 'end', 'cancel']
        for (let funcName of funcNames)
            _page[this._name + '.' + funcName] = this[funcName].bind(this)
    }
    start(evt) {
        if (!evt.touches) return;
        this.now = Date.now();
        this.x1 = evt.touches[0].pageX == null ? evt.touches[0].x : evt.touches[0].pageX;
        this.y1 = evt.touches[0].pageY == null ? evt.touches[0].y : evt.touches[0].pageY;
        this.delta = this.now - (this.last || this.now);
        this._option.touchStart(evt);
        if (this.preTapPosition.x !== null) {
            this.isDoubleTap = (this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30);
        }
        this.preTapPosition.x = this.x1;
        this.preTapPosition.y = this.y1;
        this.last = this.now;
        let preV = this.preV,
            len = evt.touches.length;
        if (len > 1) {
            this._cancelLongTap();
            this._cancelSingleTap();
            let otx = evt.touches[1].pageX == null ? evt.touches[1].x : evt.touches[1].pageX;
            let oty = evt.touches[1].pageY == null ? evt.touches[1].y : evt.touches[1].pageY;
            let v = { x: otx - this.x1, y: oty - this.y1 };
            preV.x = v.x;
            preV.y = v.y;
            this.pinchStartLen = getLen(preV);
            this._option.multipointStart(evt);
        }
        this.longTapTimeout = setTimeout(function () {
            evt.type = "longTap";
            this._option.longTap(evt);
        }.bind(this), 750);
    }
    move(evt) {
        if (!evt.touches) return;
        let preV = this.preV,
            len = evt.touches.length,
            currentX = evt.touches[0].pageX == null ? evt.touches[0].x : evt.touches[0].pageX,
            currentY = evt.touches[0].pageY == null ? evt.touches[0].y : evt.touches[0].pageY;
        this.isDoubleTap = false;
        if (len > 1) {
            let otx = evt.touches[1].pageX == null ? evt.touches[1].x : evt.touches[1].pageX;
            let oty = evt.touches[1].pageY == null ? evt.touches[1].y : evt.touches[1].pageY;
            let v = { x: otx - currentX, y: oty - currentY };

            if (preV.x !== null) {
                if (this.pinchStartLen > 0) {
                    evt.singleZoom = getLen(v) / this.pinchStartLen;
                    evt.zoom = evt.singleZoom * this.lastZoom;
                    this.tempZoom = evt.zoom;
                    evt.type = "pinch";
                    this._option.pinch(evt);
                }

                evt.angle = getRotateAngle(v, preV);
                evt.type = "rotate";
                this._option.rotate(evt);
            }
            preV.x = v.x;
            preV.y = v.y;
        } else {
            if (this.x2 !== null) {
                evt.deltaX = currentX - this.x2;
                evt.deltaY = currentY - this.y2;

            } else {
                evt.deltaX = 0;
                evt.deltaY = 0;
            }
            this._option.pressMove(evt);
        }

        this._option.touchMove(evt);

        this._cancelLongTap();
        this.x2 = currentX;
        this.y2 = currentY;
        if (len > 1) {
            // evt.preventDefault();
        }
    }
    end(evt) {
        if (!evt.changedTouches) return;
        this._cancelLongTap();
        let self = this;
        evt.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2); //在结束钩子都加入方向判断，但触发swipe瞬时必须位移大于30
        if (evt.touches.length < 2) {
            this.lastZoom = this.tempZoom;
            this._option.multipointEnd(evt);
        }
        this._option.touchEnd(evt);
        //swipe
        if ((this.x2 && Math.abs(this.x1 - this.x2) > 30) ||
            (this.y2 && Math.abs(this.y1 - this.y2) > 30)) {
            // evt.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
            this.swipeTimeout = setTimeout(function () {
                evt.type = "swipe";
                self._option.swipe(evt);

            }, 0)
        } else {
            this.tapTimeout = setTimeout(function () {
                evt.type = "tap";
                self._option.tap(evt);
                // trigger double tap immediately
                if (self.isDoubleTap) {
                    evt.type = "doubleTap";
                    self._option.doubleTap(evt);
                    clearTimeout(self.singleTapTimeout);
                    self.isDoubleTap = false;
                }
            }, 0)

            if (!self.isDoubleTap) {
                self.singleTapTimeout = setTimeout(function () {
                    self._option.singleTap(evt);
                }, 250);
            }
        }

        this.preV.x = 0;
        this.preV.y = 0;
        this.scale = 1;
        this.pinchStartLen = null;
        this.x1 = this.x2 = this.y1 = this.y2 = null;
    }
    cancel(evt) {
        clearTimeout(this.singleTapTimeout);
        clearTimeout(this.tapTimeout);
        clearTimeout(this.longTapTimeout);
        clearTimeout(this.swipeTimeout);
        this._option.touchCancel(evt);
    }
    _cancelLongTap() {
        clearTimeout(this.longTapTimeout);
    }

    _cancelSingleTap() {
        clearTimeout(this.singleTapTimeout);
    }

    _swipeDirection(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
    }
    destroy() {
        if (this.singleTapTimeout) clearTimeout(this.singleTapTimeout);
        if (this.tapTimeout) clearTimeout(this.tapTimeout);
        if (this.longTapTimeout) clearTimeout(this.longTapTimeout);
        if (this.swipeTimeout) clearTimeout(this.swipeTimeout);

        this._option.rotate = null;
        this._option.touchStart = null;
        this._option.multipointStart = null;
        this._option.multipointEnd = null;
        this._option.pinch = null;
        this._option.swipe = null;
        this._option.tap = null;
        this._option.doubleTap = null;
        this._option.longTap = null;
        this._option.singleTap = null;
        this._option.pressMove = null;
        this._option.touchMove = null;
        this._option.touchEnd = null;
        this._option.touchCancel = null;

        this.preV = this.pinchStartLen = this.scale = this.isDoubleTap = this.delta = this.last = this.now = this.tapTimeout = this.singleTapTimeout = this.longTapTimeout = this.swipeTimeout = this.x1 = this.x2 = this.y1 = this.y2 = this.preTapPosition = this.rotate = this.touchStart = this.multipointStart = this.multipointEnd = this.pinch = this.swipe = this.tap = this.doubleTap = this.longTap = this.singleTap = this.pressMove = this.touchMove = this.touchEnd = this.touchCancel = null;

        return null;
    }
};exports.default = MinaTouch

function getLen(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}

function getAngle(v1, v2) {
    let mr = getLen(v1) * getLen(v2);
    if (mr === 0) return 0;
    let r = dot(v1, v2) / mr;
    if (r > 1) r = 1;
    return Math.acos(r);
}

function cross(v1, v2) {
    return v1.x * v2.y - v2.x * v1.y;
}

function getRotateAngle(v1, v2) {
    let angle = getAngle(v1, v2);
    if (cross(v1, v2) > 0) {
        angle *= -1;
    }

    return angle * 180 / Math.PI;
}
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1701393817378);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map