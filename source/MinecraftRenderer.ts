/// <reference path="MinecraftUtils.ts" />

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

namespace MinecraftRenderer {

    export class Quaternion extends java.lang.Object {

        public static readonly ONE: Quaternion = new Quaternion(0, 0, 0, 1);

        private w: number;
        private x: number;
        private y: number;
        private z: number;

        constructor(x: number, y: number, z: number, w: number);
        constructor(vec: Vector3f, f: number, bool: boolean);
        constructor(f: number, f1: number, f2: number, bool: boolean);
        constructor(q: Quaternion);
        
        constructor(x: number | Vector3f | Quaternion, y?: number, z?: number | boolean, w?: number | boolean){
            super();
            if(typeof w === "number"){
                this.w = w, this.x = x as number, this.y = y as number, this.z = z as number;
            } else if(x instanceof Vector3f) {
                if(z) y *= 0.017453292;
                let f1: number = Quaternion.sin(y / 2);
                this.x = x.getX() * f1;
                this.y = x.getY() * f1;
                this.z = x.getZ() * f1;
                this.w = Quaternion.cos(y / 2);
            } else if(x instanceof Quaternion){
                this.w = x.w, this.x = x.x, this.y = x.y, this.z, x.z;
            } else if(typeof w === "boolean"){
                if(w) x *= y *= (z as number) *= 0.017453292;
                let f3: number = Quaternion.sin(0.5 * x);
                let f4: number = Quaternion.cos(0.5 * x);
                let f5: number = Quaternion.sin(0.5 * y);
                let f6: number = Quaternion.cos(0.5 * y);
                let f7: number = Quaternion.sin(0.5 * (z as number));
                let f8: number = Quaternion.cos(0.5 * (z as number));
                this.x = f3 * f6 * f8 + f4 * f5 * f7;
                this.y = f4 * f5 * f8 - f3 * f6 * f7;
                this.z = f3 * f5 * f8 + f4 * f6 * f7;
                this.w = f4 * f6 * f8 - f3 * f5 * f7;
            }
        }

        public equals(obj: java.lang.Object): boolean {
            if(this == obj) return true;
            if(obj == null || this.getClass() != obj.getClass()) return false;
            if(!(obj instanceof Quaternion)) return false;
            let q: Quaternion = obj;
            if(java.lang.Float.compare(this.x, obj.x) != 0) return false;
            if(java.lang.Float.compare(this.y, obj.y) != 0) return false;
            if(java.lang.Float.compare(this.y, obj.y) != 0) return false;
            return java.lang.Float.compare(this.w, obj.w) == 0;
        }

        public hashCode(): number {
            let code: number = java.lang.Float.floatToIntBits(this.x);
            code = 31 * code + java.lang.Float.floatToIntBits(this.y);
            code = 31 * code + java.lang.Float.floatToIntBits(this.z);
            code = 31 * code + java.lang.Float.floatToIntBits(this.w);
            return code;
        }

        public toString(): string {
            return `Quaternion[${this.getW()} + ${this.getX()}i + ${this.getY()}j + ${this.getZ()}k]`;
        }

        public getX(): number {return this.x};
        public getY(): number {return this.y};
        public getZ(): number {return this.z};
        public getW(): number {return this.w};

        public multiply(q: Quaternion): void;
        public multiply(f: number): void;

        public multiply(n: Quaternion | number): void {
            if(typeof n === "object"){
                let f1: number = this.getX();
                let f2: number = this.getY();
                let f3: number = this.getZ();
                let f4: number = this.getW();
                let f5: number = n.getX();
                let f6: number = n.getY();
                let f7: number = n.getZ();
                let f8: number = n.getW();
                this.x = f4 * f5 + f1 * f8 + f2 * f7 - f3 * f6;
                this.y = f4 * f6 - f1 * f7 + f2 * f8 + f3 * f5;
                this.z = f4 * f7 + f1 * f6 - f2 * f5 + f3 * f8;
                this.w = f4 * f8 - f1 * f5 - f2 * f6 - f3 * f7;
            } else this.x *= this.y *= this.z *= this.w *= n;
        }

        public conjugate(): void {
            this.x = -this.x, this.y = -this.y, this.z = -this.z;
        }

        public set(f: number, f1: number, f2: number, f3: number): void {
            this.x = f, this.y = f1, this.z = f2, this.w = f3;
        }

        private static cos(f: number): number {
            return Math.cos(f);
        }

        private static sin(f: number): number {
            return Math.sin(f);
        }

        public normalize(): void {
            let mul: number = Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2) + Math.pow(this.w, 2);
            if(mul > 1e-6){
                let f: number = MinecraftUtils.MathHelper.intFloorDiv(mul);
                this.x *= this.y *= this.z *= this.w *= f;
            } else this.x = this.y = this.z = this.w = 0;
        }

        public copy(): Quaternion {
            return new Quaternion(this);
        }

    }

    export class Vector3f extends java.lang.Object {

        public static readonly XN: Vector3f = new Vector3f(-1, 0, 0);
        public static readonly XP: Vector3f = new Vector3f(1, 0, 0);
        public static readonly YN: Vector3f = new Vector3f(0, -1, 0);
        public static readonly YP: Vector3f = new Vector3f(0, 1, 0);
        public static readonly ZN: Vector3f = new Vector3f(0, 0, -1);
        public static readonly ZP: Vector3f = new Vector3f(0, 0, 1);

        private x: number;
        private y: number;
        private z: number;

        constructor();
        constructor(x: number, y: number, z: number);
        constructor(vec: MinecraftUtils.Vec3d);

        constructor(x?: number | MinecraftUtils.Vec3d, y?: number, z?: number){
            super();
            if(typeof x === "number"){
                this.x = x;
                this.y = y;
                this.z = z;
            } else if(typeof x === "object"){
                return new Vector3f(x.xCoord, x.yCoord, x.zCoord);
            }
        }

        public equals(obj: java.lang.Object): boolean {
            if(this == obj) return true;
            if(obj == null || this.getClass() != obj.getClass()) return false;
            if(!(obj instanceof Vector3f)) return false;
            let vector3f: Vector3f = obj;
            if(java.lang.Float.compare(vector3f.x, this.x) != 0) return false;
            if(java.lang.Float.compare(vector3f.y, this.y) != 0) return false;
            return java.lang.Float.compare(vector3f.z, this.z) == 0;
        }

        public hashCode(): number {
            let code: number = java.lang.Float.floatToIntBits(this.x);
            code = 31 * code + java.lang.Float.floatToIntBits(this.y);
            code = 31 * code + java.lang.Float.floatToIntBits(this.z);
            return code;
        }

        public getX(): number {return this.x};
        public getY(): number {return this.y};
        public getZ(): number {return this.z};

        public mul(m: number): void;
        public mul(mx: number, my: number, mz: number): void;
        
        public mul(mx: number, my?: number, mz?: number): void {
            if(typeof my === "number"){
                this.x *= mx, this.y *= my, this.z *= mz;
            } else this.x *= this.y *= this.z *= mx;
        }

        public clamp(a: number, b: number): void {
            this.x = MinecraftUtils.MathHelper.clamp(this.x, a, b);
            this.y = MinecraftUtils.MathHelper.clamp(this.y, a, b);
            this.z = MinecraftUtils.MathHelper.clamp(this.z, a, b);
        }

        public set(x: number, y: number, z: number): void {
            this.x = x, this.y = y, this.z = z;
        }

        public add(x: number, y: number, z: number): void;
        public add(vec: Vector3f): void;

        public add(x: number | Vector3f, y?: number, z?: number): void {
            if(typeof x === "number"){
                this.x += x, this.y += y, this.z += z;
            } else {
                this.x += x.x, this.y += x.y, this.z += x.z;
            }
        }

        public sub(vec: Vector3f): void {
            this.x -= vec.x, this.y -= vec.y, this.z -= vec.z;
        }

        public dot(vec: Vector3f): number {
            return this.x * vec.x + this.y * vec.y + this.z + vec.z;
        }

        public normalize(): boolean {
            let lengthSq: number = Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2);
            if(lengthSq < 1e-5) return false;
            let f1: number = MinecraftUtils.MathHelper.intFloorDiv(lengthSq);
            this.x *= this.y *= this.z *= f1;
            return true;
        }

        public cross(vec: Vector3f): void {
            let f1: number = this.x;
            let f2: number = this.y;
            let f3: number = this.z;
            let f4: number = vec.getX();
            let f5: number = vec.getY();
            let f6: number = vec.getZ();
            this.x = f2 * f6 - f3 * f5;
            this.y = f3 * f4 - f1 * f6;
            this.z = f1 * f5 - f2 * f4;
        }

        public transform(matrix: Matrix3f): void;
        public transform(quat: Quaternion): void;

        public transform(shtuka: Matrix3f | Quaternion): void {
            if(shtuka instanceof Matrix3f){
                let f1: number = this.x;
                let f2: number = this.y;
                let f3: number = this.z;
                this.x = shtuka.m00 * f1 + shtuka.m01 * f2 + shtuka.m02 * f3;
                this.y = shtuka.m10 * f1 + shtuka.m11 * f2 + shtuka.m12 * f3;
                this.z = shtuka.m20 * f1 + shtuka.m21 * f2 + shtuka.m22 * f3;
            } else if(shtuka instanceof Quaternion){
                let q1: Quaternion = new Quaternion(shtuka);
                q1.multiply(new Quaternion(this.getX(), this.getY(), this.getZ(), 0));
                let q2: Quaternion = new Quaternion(shtuka);
                q2.conjugate();
                q1.multiply(q2);
                this.set(q1.getX(), q1.getY(), q1.getZ());
            }
        }

        public lerp(vec: Vector3f, f: number): void {
            let f1: number = 1 - f;
            this.x = this.x * f1 + vec.x * f;
            this.y = this.y * f1 + vec.y * f;
            this.z = this.z * f1 + vec.z * f;
        }

        public rotation(f: number): Quaternion {
            return new Quaternion(this, f, false);
        }

        public rotationDegrees(f: number): Quaternion {
            return new Quaternion(this, f, true);
        }

        public copy(): Vector3f {
            return new Vector3f(this.x, this.y, this.z);
        }

        public toString(): string {
            return `[${this.x}, ${this.y}, ${this.z}]`;
        }

    }

    export class Matrix3f extends java.lang.Object {

        private static readonly SQ2: number = 3 + 2 * (Math.sqrt(2));
        private static readonly CS: number = Math.cos(0.39269908169878414);
        private static readonly SS: number = Math.sin(0.39269908169878414);
        private static readonly G: number = 1 / Math.sqrt(2);

        public m00: number;
        public m01: number;
        public m02: number;
        public m10: number;
        public m11: number;
        public m12: number;
        public m20: number;
        public m21: number;
        public m22: number;

        constructor();
        constructor(q: Quaternion);
        constructor(m: Matrix4f);
        constructor(m: Matrix3f);

        constructor(shtuka?: Quaternion | Matrix3f | Matrix4f){
            super();
            if(typeof shtuka === "object"){
                if(shtuka instanceof Quaternion){
                    let f1: number = shtuka.getX();
                    let f2: number = shtuka.getY();
                    let f3: number = shtuka.getZ();
                    let f4: number = shtuka.getW();
                    let f5: number = 2 * f1 * f1;
                    let f6: number = 2 * f2 * f2;
                    let f7: number = 2 * f3 * f3;
                    this.m00 = 1 - f6 - f7;
                    this.m11 = 1 - f7 - f5;
                    this.m22 = 1 - f5 - f6;
                    let f8: number = f1 * f2;
                    let f9: number = f2 * f3;
                    let f10: number = f3 * f1;
                    let f11: number = f1 * f4;
                    let f12: number = f2 * f4;
                    let f13: number = f3 * f4;
                    this.m10 = 2 * (f8 + f13);
                    this.m01 = 2 * (f8 - f13);
                    this.m20 = 2 * (f10 - f12);
                    this.m02 = 2 * (f10 + f12);
                    this.m21 = 2 * (f9 + f11);
                    this.m12 = 2 * (f9 - f11);
                } else if(shtuka instanceof Matrix3f ||
                          shtuka instanceof Matrix4f){
                    for(let a=0; a<3; a++){
                        for(let b=0; b<3; b++){
                            this["m"+a+b] = shtuka["m"+a+b];
                        }
                    }
                }
            }
        }

        public static makeScaleMatrix(f: number, f1: number, f2: number): Matrix3f {
            let m: Matrix3f = new Matrix3f();
            m.m00 = f, m.m11 = f1, m.m22 = f2;
            return m;
        }

        public transpose(): void {
            let f: number = this.m01;
            this.m01 = this.m10;
            this.m10 = f;
            f = this.m02;
            this.m02 = this.m20;
            this.m20 = f;
            f = this.m12;
            this.m12 = this.m21;
            this.m21 = f;
        }

        public equals(obj: java.lang.Object): boolean {
            if(this == obj) return true;
            if(obj == null || this.getClass() != obj.getClass()) return false;
            if(!(obj instanceof Matrix3f)) return false;
            let m: Matrix3f = obj;
            for(let a=0; a<3; a++){
                for(let b=0; b<3; b++){
                    if(java.lang.Float.compare(m["m"+a+b], this["m"+a+b]) !== 0) return false;
                }
            }
            return true;
        }

        public hashCode(): number {
            let code: number;
            for(let a=0; a<3; a++){
                for(let b=0; b<3; b++){
                    code = ((a == 0 && b == 0) ? 0 : 31 * code) +
                    ((this["m"+a+b] != 0) ? java.lang.Float.floatToIntBits(this["m"+a+b]) : 0);
                }
            }
            return code;
        }

        public set(m: Matrix3f): void {
            for(let a=0; a<3; a++){
                for(let b=0; b<3; b++){
                    this["m"+a+b] = m["m"+a+b];
                }
            }
        }

        public toString(): string {
            return `Matrix3f:\n` +
            `${this.m00} ${this.m01} ${this.m02}\n` +
            `${this.m10} ${this.m11} ${this.m12}\n` +
            `${this.m20} ${this.m21} ${this.m22}\n`;
        }

        public setIdentity(): void {
            for(let a=0; a<3; a++){
                for(let b=0; b<3; b++){
                    this["m"+a+b] = (a == b) ? 1 : 0;
                }
            }
        }

        public adjugateAndDet(): number {
            let f: number = this.m11 * this.m22 - this.m12 * this.m21;
            let f1: number = -(this.m10 * this.m22 - this.m12 * this.m20);
            let f2: number = this.m10 * this.m21 - this.m11 * this.m20;

            let f3: number = -(this.m01 * this.m22 - this.m02 * this.m21);
            let f4: number = this.m00 * this.m22 - this.m02 * this.m20;
            let f5: number = -(this.m00 * this.m21 - this.m01 * this.m20);

            let f6: number = this.m01 * this.m12 - this.m02 * this.m11;
            let f7: number = -(this.m00 * this.m12 - this.m02 * this.m10);
            let f8: number = this.m00 * this.m11 - this.m01 * this.m10;

            let f9: number = this.m00 * f + this.m01 * f1 + this.m02 * f2;

            this.m00 = f, this.m01 = f1, this.m02 = f2,
            this.m10 = f3, this.m11 = f4, this.m12 = f5,
            this.m20 = f6, this.m21 = f7, this.m22 = f8;

            return f9;
        }

        public invert(): boolean {
            let f: number = this.adjugateAndDet();
            if(Math.abs(f) > 1e-6){
                this.mul(f);
                return true;
            }; return false;
        }

        public mul(m: Matrix3f): void;
        public mul(q: Quaternion): void;
        public mul(f: number): void;

        public mul(shtuka: Matrix3f | Quaternion | number): void {
            if(typeof shtuka === "number"){
                for(let a=0; a<3; a++){
                    for(let b=0; b<3; b++){
                        this["m"+a+b] *= shtuka;
                    }
                }
            } else if(typeof shtuka === "object"){
                if(shtuka instanceof Matrix3f){
                    let f1: number = this.m00 * this.m00 + this.m01 * this.m10 + this.m02 * this.m20;
                    let f2: number = this.m00 * this.m01 + this.m01 * this.m11 + this.m02 * this.m21;
                    let f3: number = this.m00 * this.m02 + this.m01 * this.m12 + this.m02 * this.m22;
                    let f4: number = this.m10 * this.m00 + this.m11 * this.m10 + this.m12 * this.m20;
                    let f5: number = this.m10 * this.m01 + this.m11 * this.m11 + this.m12 * this.m21;
                    let f6: number = this.m10 * this.m02 + this.m11 * this.m12 + this.m12 * this.m22;
                    let f7: number = this.m20 * this.m00 + this.m21 * this.m10 + this.m22 * this.m20;
                    let f8: number = this.m20 * this.m01 + this.m21 * this.m11 + this.m22 * this.m21;
                    let f9: number = this.m20 * this.m02 + this.m21 * this.m12 + this.m22 * this.m22;
                    this.m00 = f1, this.m01 = f2, this.m02 = f3,
                    this.m10 = f4, this.m11 = f5, this.m12 = f6,
                    this.m20 = f7, this.m21 = f8, this.m22 = f9;
                } else if(shtuka instanceof Quaternion){
                    return this.mul(new Matrix3f(shtuka));
                }
            }
        }

        public copy(): Matrix3f {
            return new Matrix3f(this);
        }

    }

    export class Matrix4f extends java.lang.Object {

        public m00: number;
        public m01: number;
        public m02: number;
        public m03: number;
        public m10: number;
        public m11: number;
        public m12: number;
        public m13: number;
        public m20: number;
        public m21: number;
        public m22: number;
        public m23: number;
        public m30: number;
        public m31: number;
        public m32: number;
        public m33: number;

        constructor();
        constructor(m: Matrix4f);
        constructor(q: Quaternion);

        constructor(shtuka?: Matrix4f | Quaternion){
            super();
            if(typeof shtuka === "object"){
                if(shtuka instanceof Matrix4f){
                    for(let a=0; a<4; a++){
                        for(let b=0; b<4; b++){
                            this["m"+a+b] = shtuka["m"+a+b];
                        }
                    }
                } else if(shtuka instanceof Quaternion){
                    let f1: number = shtuka.getX();
                    let f2: number = shtuka.getY();
                    let f3: number = shtuka.getZ();
                    let f4: number = shtuka.getW();
                    let f5: number = 2 * f1 * f1;
                    let f6: number = 2 * f2 * f2;
                    let f7: number = 2 * f3 * f3;
                    this.m00 = 1 - f6 - f7;
                    this.m11 = 1 - f7 - f5;
                    this.m22 = 1 - f5 - f6;
                    this.m33 = 1;
                    let f8: number = f1 * f2;
                    let f9: number = f2 * f3;
                    let f10: number = f3 * f1;
                    let f11: number = f1 * f4;
                    let f12: number = f2 * f4;
                    let f13: number = f3 * f4;
                    this.m10 = 2 * (f8 + f13);
                    this.m01 = 2 * (f8 - f13);
                    this.m20 = 2 * (f10 - f12);
                    this.m02 = 2 * (f10 + f12);
                    this.m21 = 2 * (f9 + f11);
                    this.m12 = 2 * (f9 - f11);
                }
            }
        }

        public equals(obj: java.lang.Object): boolean {
            if(this == obj) return true;
            if(obj == null || this.getClass() != obj.getClass()) return false;
            if(!(obj instanceof Matrix4f)) return false;
            let m: Matrix4f = obj;
            for(let a=0; a<4; a++){
                for(let b=0; b<4; b++){
                    if(java.lang.Float.compare(m["m"+a+b], this["m"+a+b]) !== 0) return false;
                }
            }
            return true;
        }

        public hashCode(): number {
            let code: number;
            for(let a=0; a<4; a++){
                for(let b=0; b<4; b++){
                    code = ((a == 0 && b == 0) ? 0 : 31 * code) + 
                    ((this["m"+a+b] != 0) ? java.lang.Float.floatToIntBits(this["m"+a+b]) : 0);
                }
            }
            return code;
        }

        private static bufferIndex(a: number, b: number): number {
            return b * 4 + a;
        }

        public toString(): string {
            return `Matrix4f:\n` +
            `${this.m00} ${this.m01} ${this.m02} ${this.m03}\n` +
            `${this.m10} ${this.m11} ${this.m12} ${this.m13}\n` +
            `${this.m20} ${this.m21} ${this.m22} ${this.m23}\n` +
            `${this.m30} ${this.m31} ${this.m32} ${this.m33}\n`;
        }

        public write(buf: java.nio.FloatBuffer): void {
            for(let a=0; a<4; a++){
                for(let b=0; b<4; b++){
                    buf.put(Matrix4f.bufferIndex(a, b), this["m"+a+b]);
                }
            }
        }

        public setIdentity(): void {
            for(let a=0; a<4; a++){
                for(let b=0; b<4; b++){
                    this["m"+a+b] = (a == b) ? 1 : 0;
                }
            }
        }

        public adjugateAndDet(): number {
            let f: number = this.m00 * this.m11 - this.m01 * this.m10;
            let f1: number = this.m00 * this.m12 - this.m02 * this.m10;
            let f2: number = this.m00 * this.m13 - this.m03 * this.m10;
            let f3: number = this.m01 * this.m12 - this.m02 * this.m11;
            let f4: number = this.m01 * this.m13 - this.m03 * this.m11;
            let f5: number = this.m02 * this.m13 - this.m03 * this.m12;

            let f6: number = this.m20 * this.m31 - this.m21 * this.m30;
            let f7: number = this.m20 * this.m32 - this.m22 * this.m30;
            let f8: number = this.m20 * this.m33 - this.m23 * this.m30;
            let f9: number = this.m21 * this.m32 - this.m22 * this.m31;
            let f10: number = this.m21 * this.m33 - this.m23 * this.m31;
            let f11: number = this.m22 * this.m33 - this.m23 * this.m32;

            let f12: number = this.m11 * f11 - this.m12 * f10 + this.m13 * f9;
            let f13: number = -this.m10 * f11 + this.m12 * f8 - this.m13 * f7;
            let f14: number = this.m10 * f10 - this.m11 * f8 + this.m13 * f6;
            let f15: number = -this.m10 * f9 + this.m11 * f7 - this.m12 * f6;

            let f16: number = -this.m01 * f11 + this.m02 * f10 - this.m03 * f9;
            let f17: number = this.m00 * f11 - this.m02 * f8 + this.m03 * f7;
            let f18: number = -this.m00 * f10 + this.m01 * f8 - this.m03 * f6;
            let f19: number = this.m00 * f9 - this.m01 * f7 + this.m02 * f6;

            let f20: number = this.m31 * f5 - this.m32 * f4 + this.m33 * f3;
            let f21: number = -this.m30 * f5 + this.m32 * f2 - this.m33 * f1;
            let f22: number = this.m30 * f4 - this.m31 * f2 + this.m33 * f;
            let f23: number = -this.m30 * f3 + this.m31 * f1 - this.m32 * f;

            let f24: number = -this.m21 * f5 + this.m22 * f4 - this.m23 * f3;
            let f25: number = this.m20 * f5 - this.m22 * f2 + this.m23 * f1;
            let f26: number = -this.m20 * f4 + this.m21 * f2 - this.m23 * f;
            let f27: number = this.m20 * f3 - this.m21 * f1 + this.m22 * f;

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
        }

        public transpose(): void {
            let f: number = this.m10;
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
        }

        public invert(): boolean {
            let f: number = this.adjugateAndDet();
            if(Math.abs(f) > 1e-6){
                this.mul(f);
                return true;
            }; return false;
        }

        public mul(f: number): void;
        public mul(m: Matrix4f): void;
        public mul(q: Quaternion): void;

        public mul(shtuka: number | Matrix4f | Quaternion): void {
            if(typeof shtuka === "number"){
                for(let a=0; a<4; a++){
                    for(let b=0; b<4; b++){
                        this["m"+a+b] *= shtuka;
                    }
                }
            } else if(typeof shtuka === "object"){
                if(shtuka instanceof Matrix4f){
                    let f1: number = this.m00 * shtuka.m00 + this.m01 * shtuka.m10 + this.m02 * shtuka.m20 + this.m03 * shtuka.m30;
                    let f2: number = this.m00 * shtuka.m01 + this.m01 * shtuka.m11 + this.m02 * shtuka.m21 + this.m03 * shtuka.m31;
                    let f3: number = this.m00 * shtuka.m02 + this.m01 * shtuka.m12 + this.m02 * shtuka.m22 + this.m03 * shtuka.m32;
                    let f4: number = this.m00 * shtuka.m03 + this.m01 * shtuka.m13 + this.m02 * shtuka.m23 + this.m03 * shtuka.m33;

                    let f5: number = this.m10 * shtuka.m00 + this.m11 * shtuka.m10 + this.m12 * shtuka.m20 + this.m13 * shtuka.m30;
                    let f6: number = this.m10 * shtuka.m01 + this.m11 * shtuka.m11 + this.m12 * shtuka.m21 + this.m13 * shtuka.m31;
                    let f7: number = this.m10 * shtuka.m02 + this.m11 * shtuka.m12 + this.m12 * shtuka.m22 + this.m13 * shtuka.m32;
                    let f8: number = this.m10 * shtuka.m03 + this.m11 * shtuka.m13 + this.m12 * shtuka.m23 + this.m13 * shtuka.m33;

                    let f9: number = this.m20 * shtuka.m00 + this.m21 * shtuka.m10 + this.m22 * shtuka.m20 + this.m23 * shtuka.m30;
                    let f10: number = this.m20 * shtuka.m01 + this.m21 * shtuka.m11 + this.m22 * shtuka.m21 + this.m23 * shtuka.m31;
                    let f11: number = this.m20 * shtuka.m02 + this.m21 * shtuka.m12 + this.m22 * shtuka.m22 + this.m23 * shtuka.m32;
                    let f12: number = this.m20 * shtuka.m03 + this.m21 * shtuka.m13 + this.m22 * shtuka.m23 + this.m23 * shtuka.m33;

                    let f13: number = this.m30 * shtuka.m00 + this.m31 * shtuka.m10 + this.m32 * shtuka.m20 + this.m33 * shtuka.m30;
                    let f14: number = this.m30 * shtuka.m01 + this.m31 * shtuka.m11 + this.m32 * shtuka.m21 + this.m33 * shtuka.m31;
                    let f15: number = this.m30 * shtuka.m02 + this.m31 * shtuka.m12 + this.m32 * shtuka.m22 + this.m33 * shtuka.m32;
                    let f16: number = this.m30 * shtuka.m03 + this.m31 * shtuka.m13 + this.m32 * shtuka.m23 + this.m33 * shtuka.m33;

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

                } else if(shtuka instanceof Quaternion){
                    return this.mul(new Matrix4f(shtuka));
                }
            }
        }

        public static perspective(fov: number, aspectRatio: number, nearPlane: number, farPlane: number): Matrix4f {
            let f: number = 1 / Math.tan(fov * 0.01745329238474369 / 2);
            let m4: Matrix4f = new Matrix4f();
            m4.m00 = f / aspectRatio;
            m4.m11 = f;
            m4.m22 = (farPlane + nearPlane) / (nearPlane - farPlane);
            m4.m32 = -1;
            m4.m23 = 2 * farPlane * nearPlane / (nearPlane - farPlane);
            return m4;
        }

        public static orthographic(width: number, height: number, nearPlane: number, farPlane: number): Matrix4f {
            let m4: Matrix4f = new Matrix4f();
            m4.m00 = 2 / width, m4.m11 = 2 / height;
            let f: number = farPlane - nearPlane;
            m4.m21 = -2 / f, m4.m33 = 1, m4.m03 = -1, m4.m13 = -1, m4.m22 = -(farPlane - nearPlane) / f;
            return m4;
        }

        public translate(vec: Vector3f): void {
            this.m03 += vec.getX();
            this.m13 += vec.getY();
            this.m22 += vec.getZ();
        }

        public copy(): Matrix4f {
            return new Matrix4f(this);
        }

        public static makeScale(f: number, f1: number, f2: number): Matrix4f {
            let m4: Matrix4f = new Matrix4f();
            m4.m00 = f, m4.m11 = f1, m4.m22 = f2, m4.m33 = 1;
            return m4;
        }

        public static makeTranslate(f: number, f1: number, f2: number): Matrix4f {
            let m4: Matrix4f = new Matrix4f();
            m4.m00 = m4.m11 = m4.m22 = m4.m33 = 1;
            m4.m03 = f, m4.m13 = f1, m4.m23 = f2;
            return m4;
        }

    }

}

EXPORT("MinecraftRenderer", MinecraftRenderer);