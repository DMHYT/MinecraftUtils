/// <reference path="MinecraftRenderer.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
LIBRARY({
    name: "Blaze3d",
    version: 1,
    shared: false,
    api: 'CoreEngine',
    dependencies: [
        "MinecraftRenderer"
    ]
});
IMPORT("MinecraftRenderer");
var Blaze3d;
(function (Blaze3d) {
    var MatrixStack = /** @class */ (function (_super) {
        __extends(MatrixStack, _super);
        function MatrixStack() {
            var _this = _super.call(this) || this;
            _this.stack = (function (arrayDeque, func) {
                func(arrayDeque);
                return arrayDeque;
            })(new java.util.ArrayDeque(), function (param) {
                var m4 = new MinecraftRenderer.Matrix4f();
                m4.setIdentity();
                var m3 = new MinecraftRenderer.Matrix3f();
                m3.setIdentity();
                param.add(new MatrixStack.Entry(m4, m3));
            });
            return _this;
        }
        MatrixStack.prototype.translate = function (d, d1, d2) {
            var entry = this.stack.getLast();
            entry.getMatrix().mul(MinecraftRenderer.Matrix4f.makeTranslate(d, d1, d2));
        };
        MatrixStack.prototype.scale = function (f, f1, f2) {
            var entry = this.stack.getLast();
            entry.getMatrix().mul(MinecraftRenderer.Matrix4f.makeScale(f, f1, f2));
            if (f == f1 && f1 == f2) {
                if (f > 0)
                    return;
                entry.getNormal().mul(-1);
            }
            var f3 = 1 / f, f4 = 1 / f1, f5 = 1 / f2;
            var f6 = (function (num) {
                var i = java.lang.Float.floatToIntBits(num);
                i = 1419967116 - i / 3;
                var f = java.lang.Float.intBitsToFloat(i);
                f = 0.6666667 * f + 1 / 3 * f * f * num;
                f = 0.6666667 * f + 1 / 3 * f * f * num;
                return f;
            })(f3 * f4 * f5);
            entry.getNormal().mul(MinecraftRenderer.Matrix3f.makeScaleMatrix(f6 * f3, f6 * f4, f6 * f5));
        };
        MatrixStack.prototype.rotate = function (q) {
            var entry = this.stack.getLast();
            entry.getMatrix().mul(q);
            entry.getNormal().mul(q);
        };
        MatrixStack.prototype.push = function () {
            var e = this.stack.getLast();
            this.stack.addLast(new MatrixStack.Entry(e.getMatrix(), e.getNormal()));
        };
        MatrixStack.prototype.pop = function () {
            this.stack.removeLast();
        };
        MatrixStack.prototype.getLast = function () {
            return this.stack.getLast();
        };
        MatrixStack.prototype.clear = function () {
            return this.stack.size() == 1;
        };
        return MatrixStack;
    }(java.lang.Object));
    Blaze3d.MatrixStack = MatrixStack;
    (function (MatrixStack) {
        var Entry = /** @class */ (function (_super) {
            __extends(Entry, _super);
            function Entry(matrix, normal) {
                var _this = _super.call(this) || this;
                _this.matrix = matrix, _this.normal = normal;
                return _this;
            }
            Entry.prototype.getMatrix = function () { return this.matrix; };
            ;
            Entry.prototype.getNormal = function () { return this.normal; };
            ;
            return Entry;
        }(java.lang.Object));
        MatrixStack.Entry = Entry;
    })(MatrixStack = Blaze3d.MatrixStack || (Blaze3d.MatrixStack = {}));
})(Blaze3d || (Blaze3d = {}));
EXPORT("Blaze3d", Blaze3d);
