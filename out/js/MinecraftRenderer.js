/// <reference path="MinecraftUtils.ts" />
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
    name: "MinecraftRenderer",
    version: 1,
    shared: false,
    api: 'CoreEngine',
    dependencies: [
        "MinecraftUtils"
    ]
});
IMPORT("MinecraftUtils");
var MinecraftRenderer;
(function (MinecraftRenderer) {
    var Quaternion = /** @class */ (function (_super) {
        __extends(Quaternion, _super);
        function Quaternion(x, y, z, w) {
            var _this = _super.call(this) || this;
            if (typeof w === "number") {
                _this.w = w, _this.x = x, _this.y = y, _this.z = z;
            }
            else if (x instanceof Vector3f) {
                if (z)
                    y *= 0.017453292;
                var f1 = Quaternion.sin(y / 2);
                _this.x = x.getX() * f1;
                _this.y = x.getY() * f1;
                _this.z = x.getZ() * f1;
                _this.w = Quaternion.cos(y / 2);
            }
            else if (x instanceof Quaternion) {
                _this.w = x.w, _this.x = x.x, _this.y = x.y, _this.z, x.z;
            }
            else if (typeof w === "boolean") {
                if (w)
                    x *= y *= z *= 0.017453292;
                var f3 = Quaternion.sin(0.5 * x);
                var f4 = Quaternion.cos(0.5 * x);
                var f5 = Quaternion.sin(0.5 * y);
                var f6 = Quaternion.cos(0.5 * y);
                var f7 = Quaternion.sin(0.5 * z);
                var f8 = Quaternion.cos(0.5 * z);
                _this.x = f3 * f6 * f8 + f4 * f5 * f7;
                _this.y = f4 * f5 * f8 - f3 * f6 * f7;
                _this.z = f3 * f5 * f8 + f4 * f6 * f7;
                _this.w = f4 * f6 * f8 - f3 * f5 * f7;
            }
            return _this;
        }
        Quaternion.prototype.equals = function (obj) {
            if (this == obj)
                return true;
            if (obj == null || this.getClass() != obj.getClass())
                return false;
            if (!(obj instanceof Quaternion))
                return false;
            var q = obj;
            if (java.lang.Float.compare(this.x, obj.x) != 0)
                return false;
            if (java.lang.Float.compare(this.y, obj.y) != 0)
                return false;
            if (java.lang.Float.compare(this.y, obj.y) != 0)
                return false;
            return java.lang.Float.compare(this.w, obj.w) == 0;
        };
        Quaternion.prototype.hashCode = function () {
            var code = java.lang.Float.floatToIntBits(this.x);
            code = 31 * code + java.lang.Float.floatToIntBits(this.y);
            code = 31 * code + java.lang.Float.floatToIntBits(this.z);
            code = 31 * code + java.lang.Float.floatToIntBits(this.w);
            return code;
        };
        Quaternion.prototype.toString = function () {
            return "Quaternion[" + this.getW() + " + " + this.getX() + "i + " + this.getY() + "j + " + this.getZ() + "k]";
        };
        Quaternion.prototype.getX = function () { return this.x; };
        ;
        Quaternion.prototype.getY = function () { return this.y; };
        ;
        Quaternion.prototype.getZ = function () { return this.z; };
        ;
        Quaternion.prototype.getW = function () { return this.w; };
        ;
        Quaternion.prototype.multiply = function (n) {
            if (typeof n === "object") {
                var f1 = this.getX();
                var f2 = this.getY();
                var f3 = this.getZ();
                var f4 = this.getW();
                var f5 = n.getX();
                var f6 = n.getY();
                var f7 = n.getZ();
                var f8 = n.getW();
                this.x = f4 * f5 + f1 * f8 + f2 * f7 - f3 * f6;
                this.y = f4 * f6 - f1 * f7 + f2 * f8 + f3 * f5;
                this.z = f4 * f7 + f1 * f6 - f2 * f5 + f3 * f8;
                this.w = f4 * f8 - f1 * f5 - f2 * f6 - f3 * f7;
            }
            else
                this.x *= this.y *= this.z *= this.w *= n;
        };
        Quaternion.prototype.conjugate = function () {
            this.x = -this.x, this.y = -this.y, this.z = -this.z;
        };
        Quaternion.prototype.set = function (f, f1, f2, f3) {
            this.x = f, this.y = f1, this.z = f2, this.w = f3;
        };
        Quaternion.cos = function (f) {
            return Math.cos(f);
        };
        Quaternion.sin = function (f) {
            return Math.sin(f);
        };
        Quaternion.prototype.normalize = function () {
            var mul = Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2) + Math.pow(this.w, 2);
            if (mul > 1e-6) {
                var f = MinecraftUtils.MathHelper.intFloorDiv(mul);
                this.x *= this.y *= this.z *= this.w *= f;
            }
            else
                this.x = this.y = this.z = this.w = 0;
        };
        Quaternion.prototype.copy = function () {
            return new Quaternion(this);
        };
        Quaternion.ONE = new Quaternion(0, 0, 0, 1);
        return Quaternion;
    }(java.lang.Object));
    MinecraftRenderer.Quaternion = Quaternion;
    var Vector3f = /** @class */ (function (_super) {
        __extends(Vector3f, _super);
        function Vector3f(x, y, z) {
            var _this = _super.call(this) || this;
            if (typeof x === "number") {
                _this.x = x;
                _this.y = y;
                _this.z = z;
            }
            else if (typeof x === "object") {
                return new Vector3f(x.xCoord, x.yCoord, x.zCoord);
            }
            return _this;
        }
        Vector3f.prototype.equals = function (obj) {
            if (this == obj)
                return true;
            if (obj == null || this.getClass() != obj.getClass())
                return false;
            if (!(obj instanceof Vector3f))
                return false;
            var vector3f = obj;
            if (java.lang.Float.compare(vector3f.x, this.x) != 0)
                return false;
            if (java.lang.Float.compare(vector3f.y, this.y) != 0)
                return false;
            return java.lang.Float.compare(vector3f.z, this.z) == 0;
        };
        Vector3f.prototype.hashCode = function () {
            var code = java.lang.Float.floatToIntBits(this.x);
            code = 31 * code + java.lang.Float.floatToIntBits(this.y);
            code = 31 * code + java.lang.Float.floatToIntBits(this.z);
            return code;
        };
        Vector3f.prototype.getX = function () { return this.x; };
        ;
        Vector3f.prototype.getY = function () { return this.y; };
        ;
        Vector3f.prototype.getZ = function () { return this.z; };
        ;
        Vector3f.prototype.mul = function (mx, my, mz) {
            if (typeof my === "number") {
                this.x *= mx, this.y *= my, this.z *= mz;
            }
            else
                this.x *= this.y *= this.z *= mx;
        };
        Vector3f.prototype.clamp = function (a, b) {
            this.x = MinecraftUtils.MathHelper.clamp(this.x, a, b);
            this.y = MinecraftUtils.MathHelper.clamp(this.y, a, b);
            this.z = MinecraftUtils.MathHelper.clamp(this.z, a, b);
        };
        Vector3f.prototype.set = function (x, y, z) {
            this.x = x, this.y = y, this.z = z;
        };
        Vector3f.prototype.add = function (x, y, z) {
            if (typeof x === "number") {
                this.x += x, this.y += y, this.z += z;
            }
            else {
                this.x += x.x, this.y += x.y, this.z += x.z;
            }
        };
        Vector3f.prototype.sub = function (vec) {
            this.x -= vec.x, this.y -= vec.y, this.z -= vec.z;
        };
        Vector3f.prototype.dot = function (vec) {
            return this.x * vec.x + this.y * vec.y + this.z + vec.z;
        };
        Vector3f.prototype.normalize = function () {
            var lengthSq = Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2);
            if (lengthSq < 1e-5)
                return false;
            var f1 = MinecraftUtils.MathHelper.intFloorDiv(lengthSq);
            this.x *= this.y *= this.z *= f1;
            return true;
        };
        Vector3f.prototype.cross = function (vec) {
            var f1 = this.x;
            var f2 = this.y;
            var f3 = this.z;
            var f4 = vec.getX();
            var f5 = vec.getY();
            var f6 = vec.getZ();
            this.x = f2 * f6 - f3 * f5;
            this.y = f3 * f4 - f1 * f6;
            this.z = f1 * f5 - f2 * f4;
        };
        Vector3f.prototype.transform = function (shtuka) {
            if (shtuka instanceof Matrix3f) {
                var f1 = this.x;
                var f2 = this.y;
                var f3 = this.z;
                this.x = shtuka.m00 * f1 + shtuka.m01 * f2 + shtuka.m02 * f3;
                this.y = shtuka.m10 * f1 + shtuka.m11 * f2 + shtuka.m12 * f3;
                this.z = shtuka.m20 * f1 + shtuka.m21 * f2 + shtuka.m22 * f3;
            }
            else if (shtuka instanceof Quaternion) {
                var q1 = new Quaternion(shtuka);
                q1.multiply(new Quaternion(this.getX(), this.getY(), this.getZ(), 0));
                var q2 = new Quaternion(shtuka);
                q2.conjugate();
                q1.multiply(q2);
                this.set(q1.getX(), q1.getY(), q1.getZ());
            }
        };
        Vector3f.prototype.lerp = function (vec, f) {
            var f1 = 1 - f;
            this.x = this.x * f1 + vec.x * f;
            this.y = this.y * f1 + vec.y * f;
            this.z = this.z * f1 + vec.z * f;
        };
        Vector3f.prototype.rotation = function (f) {
            return new Quaternion(this, f, false);
        };
        Vector3f.prototype.rotationDegrees = function (f) {
            return new Quaternion(this, f, true);
        };
        Vector3f.prototype.copy = function () {
            return new Vector3f(this.x, this.y, this.z);
        };
        Vector3f.prototype.toString = function () {
            return "[" + this.x + ", " + this.y + ", " + this.z + "]";
        };
        Vector3f.XN = new Vector3f(-1, 0, 0);
        Vector3f.XP = new Vector3f(1, 0, 0);
        Vector3f.YN = new Vector3f(0, -1, 0);
        Vector3f.YP = new Vector3f(0, 1, 0);
        Vector3f.ZN = new Vector3f(0, 0, -1);
        Vector3f.ZP = new Vector3f(0, 0, 1);
        return Vector3f;
    }(java.lang.Object));
    MinecraftRenderer.Vector3f = Vector3f;
    var Matrix3f = /** @class */ (function (_super) {
        __extends(Matrix3f, _super);
        function Matrix3f(shtuka) {
            var _this = _super.call(this) || this;
            if (typeof shtuka === "object") {
                if (shtuka instanceof Quaternion) {
                    var f1 = shtuka.getX();
                    var f2 = shtuka.getY();
                    var f3 = shtuka.getZ();
                    var f4 = shtuka.getW();
                    var f5 = 2 * f1 * f1;
                    var f6 = 2 * f2 * f2;
                    var f7 = 2 * f3 * f3;
                    _this.m00 = 1 - f6 - f7;
                    _this.m11 = 1 - f7 - f5;
                    _this.m22 = 1 - f5 - f6;
                    var f8 = f1 * f2;
                    var f9 = f2 * f3;
                    var f10 = f3 * f1;
                    var f11 = f1 * f4;
                    var f12 = f2 * f4;
                    var f13 = f3 * f4;
                    _this.m10 = 2 * (f8 + f13);
                    _this.m01 = 2 * (f8 - f13);
                    _this.m20 = 2 * (f10 - f12);
                    _this.m02 = 2 * (f10 + f12);
                    _this.m21 = 2 * (f9 + f11);
                    _this.m12 = 2 * (f9 - f11);
                }
                else if (shtuka instanceof Matrix3f ||
                    shtuka instanceof Matrix4f) {
                    for (var a = 0; a < 3; a++) {
                        for (var b = 0; b < 3; b++) {
                            _this["m" + a + b] = shtuka["m" + a + b];
                        }
                    }
                }
            }
            return _this;
        }
        Matrix3f.makeScaleMatrix = function (f, f1, f2) {
            var m = new Matrix3f();
            m.m00 = f, m.m11 = f1, m.m22 = f2;
            return m;
        };
        Matrix3f.prototype.transpose = function () {
            var f = this.m01;
            this.m01 = this.m10;
            this.m10 = f;
            f = this.m02;
            this.m02 = this.m20;
            this.m20 = f;
            f = this.m12;
            this.m12 = this.m21;
            this.m21 = f;
        };
        Matrix3f.prototype.equals = function (obj) {
            if (this == obj)
                return true;
            if (obj == null || this.getClass() != obj.getClass())
                return false;
            if (!(obj instanceof Matrix3f))
                return false;
            var m = obj;
            for (var a = 0; a < 3; a++) {
                for (var b = 0; b < 3; b++) {
                    if (java.lang.Float.compare(m["m" + a + b], this["m" + a + b]) !== 0)
                        return false;
                }
            }
            return true;
        };
        Matrix3f.prototype.hashCode = function () {
            var code;
            for (var a = 0; a < 3; a++) {
                for (var b = 0; b < 3; b++) {
                    code = ((a == 0 && b == 0) ? 0 : 31 * code) +
                        ((this["m" + a + b] != 0) ? java.lang.Float.floatToIntBits(this["m" + a + b]) : 0);
                }
            }
            return code;
        };
        Matrix3f.prototype.set = function (m) {
            for (var a = 0; a < 3; a++) {
                for (var b = 0; b < 3; b++) {
                    this["m" + a + b] = m["m" + a + b];
                }
            }
        };
        Matrix3f.prototype.toString = function () {
            return "Matrix3f:\n" +
                (this.m00 + " " + this.m01 + " " + this.m02 + "\n") +
                (this.m10 + " " + this.m11 + " " + this.m12 + "\n") +
                (this.m20 + " " + this.m21 + " " + this.m22 + "\n");
        };
        Matrix3f.prototype.setIdentity = function () {
            for (var a = 0; a < 3; a++) {
                for (var b = 0; b < 3; b++) {
                    this["m" + a + b] = (a == b) ? 1 : 0;
                }
            }
        };
        Matrix3f.prototype.adjugateAndDet = function () {
            var f = this.m11 * this.m22 - this.m12 * this.m21;
            var f1 = -(this.m10 * this.m22 - this.m12 * this.m20);
            var f2 = this.m10 * this.m21 - this.m11 * this.m20;
            var f3 = -(this.m01 * this.m22 - this.m02 * this.m21);
            var f4 = this.m00 * this.m22 - this.m02 * this.m20;
            var f5 = -(this.m00 * this.m21 - this.m01 * this.m20);
            var f6 = this.m01 * this.m12 - this.m02 * this.m11;
            var f7 = -(this.m00 * this.m12 - this.m02 * this.m10);
            var f8 = this.m00 * this.m11 - this.m01 * this.m10;
            var f9 = this.m00 * f + this.m01 * f1 + this.m02 * f2;
            this.m00 = f, this.m01 = f1, this.m02 = f2,
                this.m10 = f3, this.m11 = f4, this.m12 = f5,
                this.m20 = f6, this.m21 = f7, this.m22 = f8;
            return f9;
        };
        Matrix3f.prototype.invert = function () {
            var f = this.adjugateAndDet();
            if (Math.abs(f) > 1e-6) {
                this.mul(f);
                return true;
            }
            ;
            return false;
        };
        Matrix3f.prototype.mul = function (shtuka) {
            if (typeof shtuka === "number") {
                for (var a = 0; a < 3; a++) {
                    for (var b = 0; b < 3; b++) {
                        this["m" + a + b] *= shtuka;
                    }
                }
            }
            else if (typeof shtuka === "object") {
                if (shtuka instanceof Matrix3f) {
                    var f1 = this.m00 * this.m00 + this.m01 * this.m10 + this.m02 * this.m20;
                    var f2 = this.m00 * this.m01 + this.m01 * this.m11 + this.m02 * this.m21;
                    var f3 = this.m00 * this.m02 + this.m01 * this.m12 + this.m02 * this.m22;
                    var f4 = this.m10 * this.m00 + this.m11 * this.m10 + this.m12 * this.m20;
                    var f5 = this.m10 * this.m01 + this.m11 * this.m11 + this.m12 * this.m21;
                    var f6 = this.m10 * this.m02 + this.m11 * this.m12 + this.m12 * this.m22;
                    var f7 = this.m20 * this.m00 + this.m21 * this.m10 + this.m22 * this.m20;
                    var f8 = this.m20 * this.m01 + this.m21 * this.m11 + this.m22 * this.m21;
                    var f9 = this.m20 * this.m02 + this.m21 * this.m12 + this.m22 * this.m22;
                    this.m00 = f1, this.m01 = f2, this.m02 = f3,
                        this.m10 = f4, this.m11 = f5, this.m12 = f6,
                        this.m20 = f7, this.m21 = f8, this.m22 = f9;
                }
                else if (shtuka instanceof Quaternion) {
                    return this.mul(new Matrix3f(shtuka));
                }
            }
        };
        Matrix3f.prototype.copy = function () {
            return new Matrix3f(this);
        };
        Matrix3f.SQ2 = 3 + 2 * (Math.sqrt(2));
        Matrix3f.CS = Math.cos(0.39269908169878414);
        Matrix3f.SS = Math.sin(0.39269908169878414);
        Matrix3f.G = 1 / Math.sqrt(2);
        return Matrix3f;
    }(java.lang.Object));
    MinecraftRenderer.Matrix3f = Matrix3f;
    var Matrix4f = /** @class */ (function (_super) {
        __extends(Matrix4f, _super);
        function Matrix4f(shtuka) {
            var _this = _super.call(this) || this;
            if (typeof shtuka === "object") {
                if (shtuka instanceof Matrix4f) {
                    for (var a = 0; a < 4; a++) {
                        for (var b = 0; b < 4; b++) {
                            _this["m" + a + b] = shtuka["m" + a + b];
                        }
                    }
                }
                else if (shtuka instanceof Quaternion) {
                    var f1 = shtuka.getX();
                    var f2 = shtuka.getY();
                    var f3 = shtuka.getZ();
                    var f4 = shtuka.getW();
                    var f5 = 2 * f1 * f1;
                    var f6 = 2 * f2 * f2;
                    var f7 = 2 * f3 * f3;
                    _this.m00 = 1 - f6 - f7;
                    _this.m11 = 1 - f7 - f5;
                    _this.m22 = 1 - f5 - f6;
                    _this.m33 = 1;
                    var f8 = f1 * f2;
                    var f9 = f2 * f3;
                    var f10 = f3 * f1;
                    var f11 = f1 * f4;
                    var f12 = f2 * f4;
                    var f13 = f3 * f4;
                    _this.m10 = 2 * (f8 + f13);
                    _this.m01 = 2 * (f8 - f13);
                    _this.m20 = 2 * (f10 - f12);
                    _this.m02 = 2 * (f10 + f12);
                    _this.m21 = 2 * (f9 + f11);
                    _this.m12 = 2 * (f9 - f11);
                }
            }
            return _this;
        }
        Matrix4f.prototype.equals = function (obj) {
            if (this == obj)
                return true;
            if (obj == null || this.getClass() != obj.getClass())
                return false;
            if (!(obj instanceof Matrix4f))
                return false;
            var m = obj;
            for (var a = 0; a < 4; a++) {
                for (var b = 0; b < 4; b++) {
                    if (java.lang.Float.compare(m["m" + a + b], this["m" + a + b]) !== 0)
                        return false;
                }
            }
            return true;
        };
        Matrix4f.prototype.hashCode = function () {
            var code;
            for (var a = 0; a < 4; a++) {
                for (var b = 0; b < 4; b++) {
                    code = ((a == 0 && b == 0) ? 0 : 31 * code) +
                        ((this["m" + a + b] != 0) ? java.lang.Float.floatToIntBits(this["m" + a + b]) : 0);
                }
            }
            return code;
        };
        Matrix4f.bufferIndex = function (a, b) {
            return b * 4 + a;
        };
        Matrix4f.prototype.toString = function () {
            return "Matrix4f:\n" +
                (this.m00 + " " + this.m01 + " " + this.m02 + " " + this.m03 + "\n") +
                (this.m10 + " " + this.m11 + " " + this.m12 + " " + this.m13 + "\n") +
                (this.m20 + " " + this.m21 + " " + this.m22 + " " + this.m23 + "\n") +
                (this.m30 + " " + this.m31 + " " + this.m32 + " " + this.m33 + "\n");
        };
        Matrix4f.prototype.write = function (buf) {
            for (var a = 0; a < 4; a++) {
                for (var b = 0; b < 4; b++) {
                    buf.put(Matrix4f.bufferIndex(a, b), this["m" + a + b]);
                }
            }
        };
        Matrix4f.prototype.setIdentity = function () {
            for (var a = 0; a < 4; a++) {
                for (var b = 0; b < 4; b++) {
                    this["m" + a + b] = (a == b) ? 1 : 0;
                }
            }
        };
        Matrix4f.prototype.adjugateAndDet = function () {
            var f = this.m00 * this.m11 - this.m01 * this.m10;
            var f1 = this.m00 * this.m12 - this.m02 * this.m10;
            var f2 = this.m00 * this.m13 - this.m03 * this.m10;
            var f3 = this.m01 * this.m12 - this.m02 * this.m11;
            var f4 = this.m01 * this.m13 - this.m03 * this.m11;
            var f5 = this.m02 * this.m13 - this.m03 * this.m12;
            var f6 = this.m20 * this.m31 - this.m21 * this.m30;
            var f7 = this.m20 * this.m32 - this.m22 * this.m30;
            var f8 = this.m20 * this.m33 - this.m23 * this.m30;
            var f9 = this.m21 * this.m32 - this.m22 * this.m31;
            var f10 = this.m21 * this.m33 - this.m23 * this.m31;
            var f11 = this.m22 * this.m33 - this.m23 * this.m32;
            var f12 = this.m11 * f11 - this.m12 * f10 + this.m13 * f9;
            var f13 = -this.m10 * f11 + this.m12 * f8 - this.m13 * f7;
            var f14 = this.m10 * f10 - this.m11 * f8 + this.m13 * f6;
            var f15 = -this.m10 * f9 + this.m11 * f7 - this.m12 * f6;
            var f16 = -this.m01 * f11 + this.m02 * f10 - this.m03 * f9;
            var f17 = this.m00 * f11 - this.m02 * f8 + this.m03 * f7;
            var f18 = -this.m00 * f10 + this.m01 * f8 - this.m03 * f6;
            var f19 = this.m00 * f9 - this.m01 * f7 + this.m02 * f6;
            var f20 = this.m31 * f5 - this.m32 * f4 + this.m33 * f3;
            var f21 = -this.m30 * f5 + this.m32 * f2 - this.m33 * f1;
            var f22 = this.m30 * f4 - this.m31 * f2 + this.m33 * f;
            var f23 = -this.m30 * f3 + this.m31 * f1 - this.m32 * f;
            var f24 = -this.m21 * f5 + this.m22 * f4 - this.m23 * f3;
            var f25 = this.m20 * f5 - this.m22 * f2 + this.m23 * f1;
            var f26 = -this.m20 * f4 + this.m21 * f2 - this.m23 * f;
            var f27 = this.m20 * f3 - this.m21 * f1 + this.m22 * f;
            this.m00 = f12;
            this.m10 = f13;
            this.m20 = f14;
            this.m30 = f15;
            this.m01 = f16;
            this.m11 = f17;
            this.m21 = f18;
            this.m31 = f19;
            this.m02 = f20;
            this.m12 = f21;
            this.m22 = f22;
            this.m32 = f23;
            this.m03 = f24;
            this.m13 = f25;
            this.m23 = f26;
            this.m33 = f27;
            return f * f11 - f1 * f10 + f2 * f9 + f3 * f8 - f4 * f7 + f5 * f6;
        };
        Matrix4f.prototype.transpose = function () {
            var f = this.m10;
            this.m10 = this.m01;
            this.m01 = f;
            f = this.m20;
            this.m20 = this.m02;
            this.m02 = f;
            f = this.m21;
            this.m21 = this.m12;
            this.m12 = f;
            f = this.m30;
            this.m30 = this.m03;
            this.m03 = f;
            f = this.m31;
            this.m31 = this.m13;
            this.m13 = f;
            f = this.m32;
            this.m32 = this.m23;
            this.m23 = f;
        };
        Matrix4f.prototype.invert = function () {
            var f = this.adjugateAndDet();
            if (Math.abs(f) > 1e-6) {
                this.mul(f);
                return true;
            }
            ;
            return false;
        };
        Matrix4f.prototype.mul = function (shtuka) {
            if (typeof shtuka === "number") {
                for (var a = 0; a < 4; a++) {
                    for (var b = 0; b < 4; b++) {
                        this["m" + a + b] *= shtuka;
                    }
                }
            }
            else if (typeof shtuka === "object") {
                if (shtuka instanceof Matrix4f) {
                    var f1 = this.m00 * shtuka.m00 + this.m01 * shtuka.m10 + this.m02 * shtuka.m20 + this.m03 * shtuka.m30;
                    var f2 = this.m00 * shtuka.m01 + this.m01 * shtuka.m11 + this.m02 * shtuka.m21 + this.m03 * shtuka.m31;
                    var f3 = this.m00 * shtuka.m02 + this.m01 * shtuka.m12 + this.m02 * shtuka.m22 + this.m03 * shtuka.m32;
                    var f4 = this.m00 * shtuka.m03 + this.m01 * shtuka.m13 + this.m02 * shtuka.m23 + this.m03 * shtuka.m33;
                    var f5 = this.m10 * shtuka.m00 + this.m11 * shtuka.m10 + this.m12 * shtuka.m20 + this.m13 * shtuka.m30;
                    var f6 = this.m10 * shtuka.m01 + this.m11 * shtuka.m11 + this.m12 * shtuka.m21 + this.m13 * shtuka.m31;
                    var f7 = this.m10 * shtuka.m02 + this.m11 * shtuka.m12 + this.m12 * shtuka.m22 + this.m13 * shtuka.m32;
                    var f8 = this.m10 * shtuka.m03 + this.m11 * shtuka.m13 + this.m12 * shtuka.m23 + this.m13 * shtuka.m33;
                    var f9 = this.m20 * shtuka.m00 + this.m21 * shtuka.m10 + this.m22 * shtuka.m20 + this.m23 * shtuka.m30;
                    var f10 = this.m20 * shtuka.m01 + this.m21 * shtuka.m11 + this.m22 * shtuka.m21 + this.m23 * shtuka.m31;
                    var f11 = this.m20 * shtuka.m02 + this.m21 * shtuka.m12 + this.m22 * shtuka.m22 + this.m23 * shtuka.m32;
                    var f12 = this.m20 * shtuka.m03 + this.m21 * shtuka.m13 + this.m22 * shtuka.m23 + this.m23 * shtuka.m33;
                    var f13 = this.m30 * shtuka.m00 + this.m31 * shtuka.m10 + this.m32 * shtuka.m20 + this.m33 * shtuka.m30;
                    var f14 = this.m30 * shtuka.m01 + this.m31 * shtuka.m11 + this.m32 * shtuka.m21 + this.m33 * shtuka.m31;
                    var f15 = this.m30 * shtuka.m02 + this.m31 * shtuka.m12 + this.m32 * shtuka.m22 + this.m33 * shtuka.m32;
                    var f16 = this.m30 * shtuka.m03 + this.m31 * shtuka.m13 + this.m32 * shtuka.m23 + this.m33 * shtuka.m33;
                    this.m00 = f1;
                    this.m01 = f2;
                    this.m02 = f3;
                    this.m03 = f4;
                    this.m10 = f5;
                    this.m11 = f6;
                    this.m12 = f7;
                    this.m13 = f8;
                    this.m20 = f9;
                    this.m21 = f10;
                    this.m22 = f11;
                    this.m23 = f12;
                    this.m30 = f13;
                    this.m31 = f14;
                    this.m32 = f15;
                    this.m33 = f16;
                }
                else if (shtuka instanceof Quaternion) {
                    return this.mul(new Matrix4f(shtuka));
                }
            }
        };
        Matrix4f.perspective = function (fov, aspectRatio, nearPlane, farPlane) {
            var f = 1 / Math.tan(fov * 0.01745329238474369 / 2);
            var m4 = new Matrix4f();
            m4.m00 = f / aspectRatio;
            m4.m11 = f;
            m4.m22 = (farPlane + nearPlane) / (nearPlane - farPlane);
            m4.m32 = -1;
            m4.m23 = 2 * farPlane * nearPlane / (nearPlane - farPlane);
            return m4;
        };
        Matrix4f.orthographic = function (width, height, nearPlane, farPlane) {
            var m4 = new Matrix4f();
            m4.m00 = 2 / width, m4.m11 = 2 / height;
            var f = farPlane - nearPlane;
            m4.m21 = -2 / f, m4.m33 = 1, m4.m03 = -1, m4.m13 = -1, m4.m22 = -(farPlane - nearPlane) / f;
            return m4;
        };
        Matrix4f.prototype.translate = function (vec) {
            this.m03 += vec.getX();
            this.m13 += vec.getY();
            this.m22 += vec.getZ();
        };
        Matrix4f.prototype.copy = function () {
            return new Matrix4f(this);
        };
        Matrix4f.makeScale = function (f, f1, f2) {
            var m4 = new Matrix4f();
            m4.m00 = f, m4.m11 = f1, m4.m22 = f2, m4.m33 = 1;
            return m4;
        };
        Matrix4f.makeTranslate = function (f, f1, f2) {
            var m4 = new Matrix4f();
            m4.m00 = m4.m11 = m4.m22 = m4.m33 = 1;
            m4.m03 = f, m4.m13 = f1, m4.m23 = f2;
            return m4;
        };
        return Matrix4f;
    }(java.lang.Object));
    MinecraftRenderer.Matrix4f = Matrix4f;
})(MinecraftRenderer || (MinecraftRenderer = {}));
EXPORT("MinecraftRenderer", MinecraftRenderer);
