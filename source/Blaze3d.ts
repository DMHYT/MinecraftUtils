/// <reference path="MinecraftRenderer.ts" />

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

namespace Blaze3d {

    export class MatrixStack extends java.lang.Object {

        private readonly stack: java.util.Deque<MatrixStack.Entry>;

        constructor(){
            super();
            this.stack = (function<T>(arrayDeque: T, func: (param: T) => void): T {
                func(arrayDeque);
                return arrayDeque;
            })(new java.util.ArrayDeque<MatrixStack.Entry>(), (param: java.util.ArrayDeque<MatrixStack.Entry>) => {
                let m4: MinecraftRenderer.Matrix4f = new MinecraftRenderer.Matrix4f();
                m4.setIdentity();
                let m3: MinecraftRenderer.Matrix3f = new MinecraftRenderer.Matrix3f();
                m3.setIdentity();
                param.add(new MatrixStack.Entry(m4, m3));
            });
        }

        public translate(d: number, d1: number, d2: number): void {
            let entry: MatrixStack.Entry = this.stack.getLast();
            entry.getMatrix().mul(MinecraftRenderer.Matrix4f.makeTranslate(d, d1, d2));
        }

        public scale(f: number, f1: number, f2: number): void {
            let entry: MatrixStack.Entry = this.stack.getLast();
            entry.getMatrix().mul(MinecraftRenderer.Matrix4f.makeScale(f, f1, f2));
            if(f == f1 && f1 == f2){
                if(f > 0) return;
                entry.getNormal().mul(-1);
            }
            let f3: number = 1 / f, f4: number = 1 / f1, f5: number = 1 / f2;
            let f6: number = (function(num: number): number {
                let i: number = java.lang.Float.floatToIntBits(num);
                i = 1419967116 - i / 3;
                let f: number = java.lang.Float.intBitsToFloat(i);
                f = 0.6666667 * f + 1 / 3 * f * f * num;
                f = 0.6666667 * f + 1 / 3 * f * f * num;
                return f;
            })(f3 * f4 * f5);
            entry.getNormal().mul(MinecraftRenderer.Matrix3f.makeScaleMatrix(f6 * f3, f6 * f4, f6 * f5));
        }

        public rotate(q: MinecraftRenderer.Quaternion): void {
            let entry: MatrixStack.Entry = this.stack.getLast();
            entry.getMatrix().mul(q);
            entry.getNormal().mul(q);
        }

        public push(): void {
            let e: MatrixStack.Entry = this.stack.getLast();
            this.stack.addLast(new MatrixStack.Entry(e.getMatrix(), e.getNormal()));
        }

        public pop(): void {
            this.stack.removeLast();
        }

        public getLast(): MatrixStack.Entry {
            return this.stack.getLast();
        }

        public clear(): boolean {
            return this.stack.size() == 1;
        }

    }

    export namespace MatrixStack {

        export class Entry extends java.lang.Object {

            private normal: MinecraftRenderer.Matrix3f;
            private matrix: MinecraftRenderer.Matrix4f;

            public constructor(matrix: MinecraftRenderer.Matrix4f, normal: MinecraftRenderer.Matrix3f){
                super();
                this.matrix = matrix, this.normal = normal;
            }

            public getMatrix(): MinecraftRenderer.Matrix4f {return this.matrix};
            public getNormal(): MinecraftRenderer.Matrix3f {return this.normal};

        }

    }

}

EXPORT("Blaze3d", Blaze3d);