/// <reference path="MinecraftRenderer.d.ts" />
declare namespace Blaze3d {
    class MatrixStack extends java.lang.Object {
        private readonly stack;
        constructor();
        translate(d: number, d1: number, d2: number): void;
        scale(f: number, f1: number, f2: number): void;
        rotate(q: MinecraftRenderer.Quaternion): void;
        push(): void;
        pop(): void;
        getLast(): MatrixStack.Entry;
        clear(): boolean;
    }
    namespace MatrixStack {
        class Entry extends java.lang.Object {
            private normal;
            private matrix;
            constructor(matrix: MinecraftRenderer.Matrix4f, normal: MinecraftRenderer.Matrix3f);
            getMatrix(): MinecraftRenderer.Matrix4f;
            getNormal(): MinecraftRenderer.Matrix3f;
        }
    }
}
