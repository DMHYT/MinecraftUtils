LIBRARY({
    name: "MinecraftUtils",
    version: 1,
    shared: false,
    api: 'CoreEngine'
});

namespace MinecraftUtils {

    enum RayTraceResultType {
        MISS, BLOCK, ENTITY
    };
    export class RayTraceResult extends java.lang.Object {

        private blockPos: BlockPos;
        public typeOfHit: RayTraceResultType;
        public sideHit: EnumFacing;
        public hitVec: Vec3d;
        public entityHit: number;

        constructor(hitVecIn: Vec3d, sideHitIn: EnumFacing, blockPosIn: BlockPos);
        constructor(hitVecIn: Vec3d, sideHitIn: EnumFacing);
        constructor(entityIn: number);
        constructor(typeIn: RayTraceResultType, hitVecIn: Vec3d, sideHitIn: EnumFacing, blockPosIn: BlockPos);
        constructor(entityHitIn: number, hitVecIn: Vec3d);

        constructor(par1: Vec3d | number | RayTraceResultType, par2?: EnumFacing | Vec3d, par3?: BlockPos | EnumFacing, par4?: BlockPos){
            super();
            if(typeof par1 === "number" && par2 instanceof Vec3d){
                this.typeOfHit = RayTraceResult.Type.ENTITY;
                this.entityHit = par1;
                this.hitVec = par2;
            } else if(par2 instanceof Vec3d && par3 instanceof EnumFacing && par4 instanceof BlockPos){
                this.typeOfHit = par1 as RayTraceResultType;
                this.blockPos = par4;
                this.sideHit = par3;
                this.hitVec = new Vec3d(par2.xCoord, par2.yCoord, par2.zCoord);
            } else if(typeof par1 === "number" && !(par2 instanceof Vec3d)){
                let pos = Entity.getPosition(par1);
                return new RayTraceResult(par1, new Vec3d(pos.x, pos.y, pos.z));
            } else if(par1 instanceof Vec3d && par2 instanceof EnumFacing){
                if(par3 instanceof BlockPos){
                    return new RayTraceResult(RayTraceResult.Type.BLOCK, par1, par2, par3);
                } else return new RayTraceResult(RayTraceResult.Type.BLOCK, par1, par2, BlockPos.ORIGIN);
            }
        }

        public getBlockPos(): BlockPos {
            return this.blockPos;
        }

        public toString(): string {
            return `HitResult{type=${this.typeOfHit}, blockpos=${this.blockPos}, f=${this.sideHit}, pos=${this.hitVec}, entity=${this.entityHit}}`;
        }

        public static Type = RayTraceResultType;

    }

    export class AxisAlignedBB extends java.lang.Object {

        public readonly minX: number;
        public readonly minY: number;
        public readonly minZ: number;
        public readonly maxX: number;
        public readonly maxY: number;
        public readonly maxZ: number;

        constructor(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number);
        constructor(pos: BlockPos);
        constructor(pos1: BlockPos, pos2: BlockPos);
        constructor(min: Vec3d, max: Vec3d);

        constructor(x1: number | BlockPos | Vec3d, y1?: number | BlockPos | Vec3d, z1?: number, x2?: number, y2?: number, z2?: number){
            super();
            if(typeof x1 === "number" && typeof y1 === "number" && typeof z1 === "number" &&
               typeof x2 === "number" && typeof y2 === "number" && typeof z2 === "number"){
                this.minX = Math.min(x1, x2), this.minY = Math.min(y1, y2), this.minZ = Math.min(z1, z2),
                this.maxX = Math.max(x1, x2), this.maxY = Math.max(y1, y2), this.maxZ = Math.max(z1, z2);
            } else if(typeof x1 === "object" && typeof y1 === "object"){
                if(x1 instanceof BlockPos && y1 instanceof BlockPos){
                    return new AxisAlignedBB(x1.getX(), x1.getY(), x1.getZ(), y1.getX(), y1.getY(), y1.getZ());
                } else if(x1 instanceof Vec3d && y1 instanceof Vec3d){
                    return new AxisAlignedBB(x1.xCoord, x1.yCoord, x1.zCoord, y1.xCoord, y1.yCoord, y1.zCoord);
                }
            } else if(typeof x1 === "object" && typeof y1 !== "object" && x1 instanceof BlockPos){
                return new AxisAlignedBB(x1.getX(), x1.getY(), x1.getZ(), x1.getX() + 1, x1.getY() + 1, x1.getZ() + 1);
            }
        }

        public setMaxY(y2: number): AxisAlignedBB {
            return new AxisAlignedBB(this.minX, this.minY, this.minZ, this.maxX, y2, this.maxZ);
        }

        public equals(obj: java.lang.Object): boolean {
            if(this == obj) return true;
            else if(!(obj instanceof AxisAlignedBB)) return false;
            else {
                let axisalignedbb: AxisAlignedBB = obj;
                return java.lang.Double.compare(axisalignedbb.minX, this.minX) != 0 ? false :
                    (java.lang.Double.compare(axisalignedbb.minY, this.minY) != 0 ? false :
                    (java.lang.Double.compare(axisalignedbb.minZ, this.minZ) != 0 ? false :
                    (java.lang.Double.compare(axisalignedbb.maxX, this.maxX) != 0 ? false :
                    (java.lang.Double.compare(axisalignedbb.maxY, this.maxY) != 0 ? false :
                    (java.lang.Double.compare(axisalignedbb.maxZ, this.maxZ) == 0)))));
            }
        }

        public hashCode(): number {
            let i: number = java.lang.Double.doubleToLongBits(this.minX);
            let j: number = Math.floor(i ^ i >>> 32);
            i = java.lang.Double.doubleToLongBits(this.minY);
            j = 31 * j + Math.floor(i ^ i >>> 32);
            i = java.lang.Double.doubleToLongBits(this.minZ);
            j = 31 * j + Math.floor(i ^ i >>> 32);
            i = java.lang.Double.doubleToLongBits(this.maxX);
            j = 31 * j + Math.floor(i ^ i >>> 32);
            i = java.lang.Double.doubleToLongBits(this.maxY);
            j = 31 * j + Math.floor(i ^ i >>> 32);
            i = java.lang.Double.doubleToLongBits(this.maxZ);
            j = 31 * j + (i ^ i >>> 32);
            return j;
        }

        public addCoord(x: number, y: number, z: number): AxisAlignedBB {
            let d0 = this.minX, d1 = this.minY, d2 = this.minZ, 
                d3 = this.maxX, d4 = this.maxY, d5 = this.maxZ;
            if(x < 0) d0 += x;
            else if(x > 0) d3 += x;
            if(y < 0) d1 += y;
            else if(y > 0) d4 += y;
            if(z < 0) d2 += z;
            else if(z > 0) d5 += z;
            return new AxisAlignedBB(d0, d1, d2, d3, d4, d5);
        }

        public expand(x: number, y: number, z: number): AxisAlignedBB {
            return new AxisAlignedBB(this.minX - x, this.minY - y, this.minZ - z,
                                     this.maxX + x, this.maxY + y, this.maxZ + z);
        }

        public expandXyz(value: number): AxisAlignedBB {
            return this.expand(value, value, value);
        }

        public union(other: AxisAlignedBB): AxisAlignedBB {
            return new AxisAlignedBB(Math.min(this.minX, other.minX),
                                     Math.min(this.minY, other.minY),
                                     Math.min(this.minZ, other.minZ),
                                     Math.max(this.maxX, other.maxX),
                                     Math.max(this.maxY, other.maxY),
                                     Math.max(this.maxZ, other.maxZ));
        }

        public offset(x: number, y: number, z: number): AxisAlignedBB;
        public offset(pos: BlockPos): AxisAlignedBB;

        public offset(x: number | BlockPos, y?: number, z?: number): AxisAlignedBB {
            if(typeof x === "number"){
                return new AxisAlignedBB(this.minX + x, this.minY + y, this.minZ + z, 
                                         this.maxX + x, this.maxY + y, this.maxZ + z);
            } else if(typeof x === "object" && x instanceof BlockPos){
                return new AxisAlignedBB(this.minX + x.getX(), this.minY + x.getY(), this.minZ + x.getZ(),
                                         this.maxX + x.getX(), this.maxY + x.getY(), this.maxZ + x.getZ());
            }
        }

        public calculateXOffset(other: AxisAlignedBB, offsetX: number): number {
            if(other.maxY > this.minY && other.minY < this.maxY && other.maxZ > this.minZ && other.minZ < this.maxZ){
                if(offsetX > 0 && other.maxX <= this.minX){
                    let d1: number = this.minX - other.maxX;
                    if(d1 < offsetX) offsetX = d1;
                } else if(offsetX < 0 && other.minX >= this.maxX){
                    let d0: number = this.maxX - other.minX;
                    if(d0 > offsetX) offsetX = d0;
                }
                return offsetX
            } else return offsetX;
        }

        public calculateYOffset(other: AxisAlignedBB, offsetY: number): number {
            if(other.maxX > this.minX && other.minX < this.maxX && other.maxZ > this.minZ && other.minZ < this.maxZ){
                if(offsetY > 0 && other.maxY <= this.minY){
                    let d1: number = this.minY - other.maxY;
                    if(d1 < offsetY) offsetY = d1;
                } else if(offsetY < 0 && other.minY >= this.maxY){
                    let d0: number = this.maxY - other.minY;
                    if(d0 > offsetY) offsetY = d0;
                }
                return offsetY;
            } else return offsetY;
        }

        public calculateZOffset(other: AxisAlignedBB, offsetZ: number): number {
            if(other.maxX > this.minX && other.minX < this.maxX && other.maxY > this.minY && other.minY < this.maxY){
                if(offsetZ > 0 && other.maxZ <= this.minZ){
                    let d1: number = this.minZ - other.maxZ;
                    if(d1 < offsetZ) offsetZ = d1;
                } else if(offsetZ < 0 && other.minZ >= this.maxZ){
                    let d0: number = this.maxZ - other.minZ;
                    if(d0 > offsetZ) offsetZ = d0;
                }
                return offsetZ;
            } else return offsetZ;
        }

        public intersectsWith(other: AxisAlignedBB): boolean {
            return this.intersects(other.minX, other.minY, other.minZ,
                                   other.maxX, other.maxY, other.maxZ);
        }

        public intersects(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): boolean;
        public intersects(min: Vec3d, max: Vec3d): boolean;

        public intersects(x1: number | Vec3d, y1?: number | Vec3d, z1?: number, x2?: number, y2?: number, z2?: number): boolean {
            if(typeof x1 === "number" && typeof y1 === "number"){
                return this.minX < x2 && this.maxX > x1 && this.minY < y2 && this.maxY > y1 && this.minZ < z2 && this.maxZ > z1;
            } else if(typeof x1 === "object" && x1 instanceof Vec3d && typeof y1 === "object" && y1 instanceof Vec3d){
                return this.intersects(Math.min(x1.xCoord, y1.xCoord), Math.min(x1.yCoord, y1.yCoord), Math.min(x1.zCoord, y1.zCoord),
                                       Math.max(x1.xCoord, y1.xCoord), Math.max(x1.yCoord, y1.yCoord), Math.max(x1.zCoord, y1.zCoord));
            }
        }

        public isVecInside(vec: Vec3d): boolean {
            return vec.xCoord > this.minX && vec.xCoord < this.maxX ? 
                    (vec.yCoord > this.minY && vec.yCoord < this.maxY ? 
                        vec.zCoord > this.minZ && vec.zCoord < this.maxZ : false) : false;
        }

        public getAverageEdgeLength(): number {
            return (this.maxX - this.minX, this.maxY - this.minY, this.maxZ - this.minZ) / 3;
        }

        public contract(value: number): AxisAlignedBB {
            return this.expandXyz(-value);
        }

        public calculateIntercept(vecA: Vec3d, vecB: Vec3d): Nullable<RayTraceResult> {
            let vec3d: Vec3d = this.collideWithXPlane(this.minX, vecA, vecB);
            let enumfacing: EnumFacing = EnumFacing.WEST;
            let vec3d1: Vec3d = this.collideWithXPlane(this.maxX, vecA, vecB);
            if(vec3d1 != null && this.isClosest(vecA, vec3d, vec3d1)){
                vec3d = vec3d1, enumfacing = EnumFacing.EAST;
            }
            vec3d1 = this.collideWithYPlane(this.minY, vecA, vecB);
            if(vec3d1 != null && this.isClosest(vecA, vec3d, vec3d1)){
                vec3d = vec3d1, enumfacing = EnumFacing.DOWN;
            }
            vec3d1 = this.collideWithYPlane(this.maxY, vecA, vecB);
            if(vec3d1 != null && this.isClosest(vecA, vec3d, vec3d1)){
                vec3d = vec3d1, enumfacing = EnumFacing.UP;
            }
            vec3d1 = this.collideWithZPlane(this.minZ, vecA, vecB);
            if(vec3d1 != null && this.isClosest(vecA, vec3d, vec3d1)){
                vec3d = vec3d1, enumfacing = EnumFacing.NORTH;
            }
            vec3d1 = this.collideWithZPlane(this.maxZ, vecA, vecB);
            if(vec3d1 != null && this.isClosest(vecA, vec3d, vec3d1)){
                vec3d = vec3d1, enumfacing = EnumFacing.SOUTH;
            }
            return vec3d == null ? null : new RayTraceResult(vec3d, enumfacing);
        }

        private isClosest(vec1: Vec3d, vec2: Vec3d, vec3: Vec3d): boolean {
            return vec2 == null || vec1.squareDistanceTo(vec3) < vec1.squareDistanceTo(vec2);
        }

        private collideWithXPlane(num: number, vec1: Vec3d, vec2: Vec3d): Nullable<Vec3d> {
            let vec3d: Vec3d = vec1.getIntermediateWithXValue(vec2, num);
            return vec3d != null && this.intersectsWithYZ(vec3d) ? vec3d : null;
        }

        private collideWithYPlane(num: number, vec1: Vec3d, vec2: Vec3d): Nullable<Vec3d> {
            let vec3d: Vec3d = vec1.getIntermediateWithYValue(vec2, num);
            return vec3d != null && this.intersectsWithXZ(vec3d) ? vec3d : null;
        }

        private collideWithZPlane(num: number, vec1: Vec3d, vec2: Vec3d): Nullable<Vec3d> {
            let vec3d: Vec3d = vec1.getIntermediateWithZValue(vec2, num);
            return vec3d != null && this.intersectsWithXY(vec3d) ? vec3d : null;
        }

        public intersectsWithYZ(vec: Vec3d): boolean {
            return vec.yCoord >= this.minY && vec.yCoord <= this.maxY && vec.zCoord >= this.minZ && vec.zCoord <= this.maxZ;
        }

        public intersectsWithXZ(vec: Vec3d): boolean {
            return vec.xCoord >= this.minX && vec.xCoord <= this.maxX && vec.zCoord >= this.minZ && vec.zCoord <= this.maxZ;
        }

        public intersectsWithXY(vec: Vec3d): boolean {
            return vec.xCoord >= this.minX && vec.xCoord <= this.maxX && vec.yCoord >= this.minY && vec.yCoord <= this.maxY;
        }

        public toString(): string {
            return `box[${this.minX}, ${this.minY}, ${this.minZ} -> ${this.maxX}, ${this.maxY}, ${this.maxZ}]`;
        }

        public hasNaN(): boolean {
            return java.lang.Double.isNaN(this.minX) ||
                    java.lang.Double.isNaN(this.minY) ||
                    java.lang.Double.isNaN(this.minZ) ||
                    java.lang.Double.isNaN(this.maxX) ||
                    java.lang.Double.isNaN(this.maxY) ||
                    java.lang.Double.isNaN(this.maxZ);
        }

        public getCenter(): Vec3d {
            return new Vec3d(this.minX + (this.maxX - this.minX) * 0.5, 
                             this.minY + (this.maxY - this.minY) * 0.5, 
                             this.minZ + (this.maxZ - this.minZ) * 0.5);
        }

    }

    abstract class UnmodifiableIterator<E> extends java.util.Iterator<E> {
        protected constructor(){super()};
        public remove(): void {
            throw new java.lang.UnsupportedOperationException();
        }
    }
    enum AbstractIteratorState {
        READY, NOT_READY, DONE, FAILED
    }
    abstract class AbstractIterator<T> extends UnmodifiableIterator<T> {
        private state: number = AbstractIteratorState.NOT_READY;
        protected constructor(){super()};
        private State = AbstractIteratorState;
        private nextt: Nullable<T>;
        public next(): Nullable<T> {
            if(!this.hasNext()) throw new java.util.NoSuchElementException();
            this.state = this.State.NOT_READY;
            let result: T = this.nextt;
            this.nextt = null;
            return result;
        }
        protected abstract computeNext(): T;
        protected endOfData(): T {
            this.state = this.State.DONE;
            return null;
        }
        public hasNext(): boolean {
            if(!(this.state != this.State.FAILED)) throw new java.lang.IllegalStateException();
            switch(this.state){
                case this.State.DONE: return false;
                case this.State.READY: return true;
                default:
            }
            return this.tryToComputeNext();
        }
        private tryToComputeNext(): boolean {
            this.state = this.State.FAILED;
            this.nextt = this.computeNext();
            if(this.state != this.State.DONE){
                this.state = this.State.READY;
                return true;
            }
            return false;
        }
        public peek(): T {
            if(!this.hasNext()) throw new java.util.NoSuchElementException();
            return this.nextt;
        }
    }

    
    export class Vec2f extends java.lang.Object {

        public static readonly ZERO: Vec2f = new Vec2f(0, 0);
        public static readonly ONE: Vec2f = new Vec2f(1, 1);
        public static readonly UNIT_X: Vec2f = new Vec2f(1, 0);
        public static readonly NEGATIVE_UNIT_X: Vec2f = new Vec2f(-1, 0);
        public static readonly UNIT_Y: Vec2f = new Vec2f(0, 1);
        public static readonly NEGATIVE_UNIT_Y: Vec2f = new Vec2f(0, -1);
        public static readonly MAX: Vec2f = new Vec2f(java.lang.Float.MAX_VALUE, java.lang.Float.MAX_VALUE);
        public static readonly MIN: Vec2f = new Vec2f(java.lang.Float.MIN_VALUE, java.lang.Float.MIN_VALUE);
    
        public readonly x: number;
        public readonly y: number;
    
        constructor(xIn: number, yIn: number){
            super();
            this.x = xIn;
            this.y = yIn;
        }
    
    }
    
    export class Vec3i extends java.lang.Object implements java.lang.Comparable<Vec3i> {

        public static readonly NULL_VECTOR: Vec3i = new Vec3i(0, 0, 0);
    
        protected readonly x: number;
        protected readonly y: number;
        protected readonly z: number;
    
        constructor(xIn: number, yIn: number, zIn: number){
            super();
            this.x = Math.floor(xIn), this.y = Math.floor(yIn), this.z = Math.floor(zIn);
        }
    
        public equals(obj: java.lang.Object): boolean {
            if(this == obj) return true;
            else if(!(obj instanceof Vec3i)) return false;
            else {
                let vec3i: Vec3i = obj;
                return this.getX() != vec3i.getX() ? false :
                    (this.getY() != vec3i.getY() ? false :
                        this.getZ() == vec3i.getZ());
            }
        }
    
        public hashCode(): number {
            return (this.getY() + this.getZ() * 31) * 31 + this.getX();
        }
    
        public compareTo(toCompare: Vec3i): number {
            return this.getY() == toCompare.getY() ?
                (this.getZ() == toCompare.getZ() ? this.getX() - toCompare.getX() :
                    this.getZ() - toCompare.getZ()) : this.getY() - toCompare.getY();
        }
    
        public getX(): number {return this.x};
        public getY(): number {return this.y};
        public getZ(): number {return this.z};
    
        public crossProduct(vec: Vec3i): Vec3i {
            return new Vec3i(this.getY() * vec.getZ() - this.getZ() * vec.getY(), 
                            this.getZ() * vec.getX() - this.getX() * vec.getZ(), 
                            this.getX() * vec.getY() - this.getY() * vec.getX());
        }
    
        public getDistance(xIn: number, yIn: number, zIn: number): number {
            return Math.sqrt(this.distanceSq(xIn, yIn, zIn));
        }
    
        public distanceSq(toX: number, toY: number, toZ: number): number;
        public distanceSq(to: Vec3i);
    
        public distanceSq(toX: number | Vec3i, toY?: number, toZ?: number): number {
            if(typeof toX === "number"){
                return Math.pow(this.getX() - toX, 2) + Math.pow(this.getY() - toY, 2) + Math.pow(this.getZ() + toZ, 2);
            } else if(typeof toX === "object" && toX instanceof Vec3i) {
                toX = toX as Vec3i;
                return this.distanceSq(toX.getX(), toX.getY(), toX.getZ());
            }
        }
    
        public distanceSqToCenter(xIn: number, yIn: number, zIn: number): number {
            return this.distanceSq(xIn + 0.5, yIn + 0.5, zIn + 0.5);
        }
    
        public toString(): string {
            return `${this.getX()}, ${this.getY()}, ${this.getZ()}`;
        }
    
    }

    export class Vec3d extends java.lang.Object {

        public static readonly ZERO: Vec3d = new Vec3d(0, 0, 0);
    
        public readonly xCoord: number;
        public readonly yCoord: number;
        public readonly zCoord: number;
    
        constructor(x: number, y: number, z: number);
        constructor(vec: Vec3i);
    
        constructor(x: number | Vec3i, y?: number, z?: number){
            super();
            if(typeof x === "number"){
                if(x == -0) x = 0;
                if(y == -0) y = 0;
                if(z == -0) z = 0;
                this.xCoord = x;
                this.yCoord = y;
                this.zCoord = z;
            } else if(typeof x === "object" && x instanceof Vec3i){
                return new Vec3d(x.getX(), x.getY(), x.getZ());
            }
        }
    
        public subtractReverse(vec: Vec3d): Vec3d {
            return new Vec3d(vec.xCoord - this.xCoord, vec.yCoord - this.yCoord, vec.zCoord - this.zCoord);
        }
    
        public normalize(): Vec3d {
            let d0: number = Math.sqrt(Math.pow(this.xCoord, 2) + Math.pow(this.yCoord, 2) + Math.pow(this.zCoord, 2));
            return d0 < 1e-4 ? Vec3d.ZERO : new Vec3d(this.xCoord / d0, this.yCoord / d0, this.zCoord / d0);
        }
    
        public dotProduct(vec: Vec3d): number {
            return this.xCoord * vec.xCoord + this.yCoord * vec.yCoord + this.zCoord * vec.zCoord;
        }
    
        public crossProduct(vec: Vec3d): Vec3d {
            return new Vec3d(this.yCoord * vec.zCoord - this.zCoord * vec.yCoord, 
                            this.zCoord * vec.xCoord - this.xCoord * vec.zCoord, 
                            this.xCoord * vec.yCoord - this.yCoord * vec.xCoord);
        }
    
        public subtract(vec: Vec3d): Vec3d;
        public subtract(x: number, y: number, z: number): Vec3d;
    
        public subtract(x: number | Vec3d, y?: number, z?: number): Vec3d {
            if(typeof x === "number"){
                return this.addVector(-x, -y, -z);
            } else if(typeof x === "object" && x instanceof Vec3d){
                return this.subtract(x.xCoord, x.yCoord, x.zCoord);
            }
        }
    
        public add(vec: Vec3d): Vec3d {
            return this.addVector(vec.xCoord, vec.yCoord, vec.zCoord);
        }
    
        public addVector(x: number, y: number, z: number): Vec3d {
            return new Vec3d(this.xCoord + x, this.yCoord + y, this.zCoord + z);
        }

        public mul(factorX: number, factorY: number, factorZ: number): Vec3d {
            return new Vec3d(this.xCoord * factorX, this.yCoord * factorY, this.zCoord * factorZ);
        }
    
        public distanceTo(vec: Vec3d): number {
            return Math.sqrt(this.squareDistanceTo(vec));
        }
    
        public squareDistanceTo(vec: Vec3d): number;
        public squareDistanceTo(x: number, y: number, z: number): number;
    
        public squareDistanceTo(vec: Vec3d | number, y?: number, z?: number): number {
            if(typeof vec === "object" && vec instanceof Vec3d){
                return Math.pow(vec.xCoord - this.xCoord, 2) + Math.pow(vec.yCoord - this.yCoord, 2) + Math.pow(vec.zCoord - this.zCoord, 2);
            } else return Math.pow(vec - this.xCoord, 2) + Math.pow(y - this.yCoord, 2) + Math.pow(z - this.zCoord, 2);
        }
    
        public scale(scale: number): Vec3d {
            return new Vec3d(this.xCoord * scale, this.yCoord * scale, this.zCoord * scale);
        }
    
        public lengthVector(): number {
            return Math.sqrt(this.lengthSquared())
        }
    
        public lengthSquared(): number {
            return Math.pow(this.xCoord, 2) + Math.pow(this.yCoord, 2) + Math.pow(this.zCoord, 2);
        }
    
        public getIntermediateWithXValue(vec: Vec3d, x: number): Nullable<Vec3d> {
            let d0: number = vec.xCoord - this.xCoord;
            let d1: number = vec.yCoord - this.yCoord;
            let d2: number = vec.zCoord - this.zCoord;
            if(Math.pow(d0, 2) < 1.0000000116860974e-7) return null;
            else {
                let d3: number = (x - this.xCoord) / d0;
                return d3 >= 0 && d3 <= 1 ? new Vec3d(this.xCoord + d0 * d3, this.yCoord + d1 * d3, this.zCoord + d2 * d3) : null;
            }
        }
    
        public getIntermediateWithYValue(vec: Vec3d, y: number): Nullable<Vec3d> {
            let d0: number = vec.xCoord - this.xCoord;
            let d1: number = vec.yCoord - this.yCoord;
            let d2: number = vec.zCoord - this.zCoord;
            if(Math.pow(d0, 2) < 1.0000000116860974e-7) return null;
            else {
                let d3: number = (y - this.yCoord) / d0;
                return d3 >= 0 && d3 <= 1 ? new Vec3d(this.xCoord + d0 * d3, this.yCoord + d1 * d3, this.zCoord + d2 * d3) : null;
            }
        }
    
        public getIntermediateWithZValue(vec: Vec3d, z: number): Nullable<Vec3d> {
            let d0: number = vec.xCoord - this.xCoord;
            let d1: number = vec.yCoord - this.yCoord;
            let d2: number = vec.zCoord - this.zCoord;
            if(Math.pow(d0, 2) < 1.0000000116860974e-7) return null;
            else {
                let d3: number = (z - this.zCoord) / d0;
                return d3 >= 0 && d3 <= 1 ? new Vec3d(this.xCoord + d0 * d3, this.yCoord + d1 * d3, this.zCoord + d2 * d3) : null;
            }
        }
    
        public equals(obj: java.lang.Object): boolean {
            if(this == obj) return true;
            else if(!(obj instanceof Vec3d)) return false;
            else {
                let vec3d: Vec3d = obj;
                return java.lang.Double.compare(vec3d.xCoord, this.xCoord) != 0 ? false : 
                    (java.lang.Double.compare(vec3d.yCoord, this.yCoord) != 0 ? false :
                    (java.lang.Double.compare(vec3d.zCoord, this.zCoord) == 0));
            }
        }
    
        public hashCode(): number {
            let j: number = java.lang.Double.doubleToLongBits(this.xCoord);
            let i: number = Math.floor(j ^ j >>> 32);
            j = java.lang.Double.doubleToLongBits(this.yCoord);
            i = 31 * i + Math.floor(j ^ j >>> 32);
            j = java.lang.Double.doubleToLongBits(this.zCoord);
            i = 31 * i + Math.floor(j ^ j >>> 32);
            return i;
        }
    
        public toString(): string {
            return `(${this.xCoord}, ${this.yCoord}, ${this.zCoord})`;
        }
    
        public rotatePitch(pitch: number): Vec3d {
            let f: number = Math.cos(pitch);
            let f1: number = Math.sin(pitch);
            let d0: number = this.xCoord;
            let d1: number = this.yCoord * f + this.zCoord * f1;
            let d2: number = this.zCoord * f - this.yCoord * f1;
            return new Vec3d(d0, d1, d2);
        }
    
        public rotateYaw(yaw: number): Vec3d {
            let f: number = Math.cos(yaw);
            let f1: number = Math.sin(yaw);
            let d0: number = this.xCoord * f + this.zCoord * f1;
            let d1: number = this.yCoord;
            let d2: number = this.zCoord * f - this.xCoord * f1;
            return new Vec3d(d0, d1, d2);
        }
    
        public static fromPitchYawVector(vec: Vec2f): Vec3d {
            return Vec3d.fromPitchYaw(vec.x, vec.y);
        }
    
        public static fromPitchYaw(pitch: number, yaw: number): Vec3d {
            let f: number = Math.cos(-yaw * 0.017453292 - Math.PI);
            let f1: number = Math.sin(-yaw * 0.017453292 - Math.PI);
            let f2: number = Math.cos(-pitch * 0.017453292);
            let f3: number = Math.sin(-pitch * 0.017453292);
            return new Vec3d(f1 * f2, f3, f * f2);
        }
    
    }
    
    export class BlockPos extends Vec3i {
        
        public static readonly ORIGIN: BlockPos = new BlockPos(0, 0, 0);
        private static readonly NUM_X_BITS: number = 1;//TODO
        private static readonly NUM_Z_BITS: number = BlockPos.NUM_X_BITS;
        private static readonly NUM_Y_BITS: number = 64 - BlockPos.NUM_X_BITS - BlockPos.NUM_Z_BITS;
        private static readonly Y_SHIFT: number = 0 + BlockPos.NUM_Z_BITS;
        private static readonly X_SHIFT: number = BlockPos.Y_SHIFT + BlockPos.NUM_Y_BITS;
        private static readonly X_MASK: number = (1 << BlockPos.NUM_X_BITS) - 1;
        private static readonly Y_MASK: number = (1 << BlockPos.NUM_Y_BITS) - 1;
        private static readonly Z_MASK: number = (1 << BlockPos.NUM_Z_BITS) - 1;

        protected readonly x: number;
        protected readonly y: number;
        protected readonly z: number;

        constructor(x: number, y: number, z: number);
        constructor(source: number);//Entity
        constructor(vec: Vec3d);
        constructor(source: Vec3i);

        constructor(x: number | Vec3d | Vec3i, y?: number, z?: number){
            if(typeof y !== "undefined" && typeof z !== "undefined"){
                super(x as number, y, z);
            } else if(typeof x === "number"){
                let pos = Entity.getPosition(x);
                return new BlockPos(pos.x, pos.y, pos.z);
            } else if(typeof x === "object"){
                if(x instanceof Vec3d){
                    return new BlockPos(x.xCoord, x.yCoord, x.zCoord);
                } else if(x instanceof Vec3i){
                    return new BlockPos(x.getX(), x.getY(), x.getZ());
                }
            }
        }

        public add(x: number, y: number, z: number): BlockPos;
        public add(vec: Vec3i): BlockPos;

        public add(x: number | Vec3i, y?: number, z?: number): BlockPos {
            if(typeof x === "number"){
                return x == 0 && y == 0 && z == 0 ? this : new BlockPos(this.getX() + x, this.getY() + y, this.getZ() + z);
            } else return x.getX() == 0 && x.getY() == 0 && x.getZ() == 0 ? this : new BlockPos(this.getX() + x.getX(),
                                                                                                this.getY() + x.getY(), 
                                                                                                this.getZ() + x.getZ());
        }

        public subtract(vec: Vec3i): BlockPos {
            return vec.getX() == 0 && vec.getY() == 0 && vec.getZ() == 0 ? this : new BlockPos(this.getX() - vec.getX(), 
                                                                                                this.getY() - vec.getY(), 
                                                                                                this.getZ() - vec.getZ());
        }

        public up(): BlockPos;
        public up(n: number): BlockPos;
        public up(n?: number): BlockPos {
            if(typeof n !== "undefined"){
                return this.offset(EnumFacing.UP, n);
            } else return this.up(1);
        }

        public down(): BlockPos;
        public down(n: number): BlockPos;
        public down(n?: number): BlockPos {
            if(typeof n !== "undefined"){
                return this.offset(EnumFacing.DOWN, n);
            } else return this.down(1);
        }

        public north(): BlockPos;
        public north(n: number): BlockPos;
        public north(n?: number): BlockPos {
            if(typeof n !== "undefined"){
                return this.offset(EnumFacing.NORTH, n);
            } else return this.north(1);
        }

        public south(): BlockPos;
        public south(n: number): BlockPos;
        public south(n?: number): BlockPos {
            if(typeof n !== "undefined"){
                return this.offset(EnumFacing.SOUTH, n);
            } else return this.south(1);
        }

        public west(): BlockPos;
        public west(n: number): BlockPos;
        public west(n?: number): BlockPos {
            if(typeof n !== "undefined"){
                return this.offset(EnumFacing.WEST, n);
            } else return this.west(1);
        }

        public east(): BlockPos;
        public east(n: number): BlockPos;
        public east(n?: number): BlockPos {
            if(typeof n !== "undefined"){
                return this.offset(EnumFacing.EAST, n);
            } else return this.east(1);
        }

        public offset(facing: EnumFacing): BlockPos;
        public offset(facing: EnumFacing, n: number): BlockPos;
        public offset(facing: EnumFacing, n?: number): BlockPos {
            if(typeof n !== "undefined"){
                return n == 0 ? this : new BlockPos(this.getX() + facing.getFrontOffsetX() * n, 
                                                    this.getY() + facing.getFrontOffsetY() * n, 
                                                    this.getZ() + facing.getFrontOffsetZ() * n);
            } else return this.offset(facing, 1);
        }

        public crossProduct(vec: Vec3i): BlockPos {
            return new BlockPos(this.getY() * vec.getZ() - this.getZ() * vec.getY(), 
                                this.getZ() * vec.getX() - this.getX() * vec.getZ(), 
                                this.getX() * vec.getY() - this.getY() * vec.getX());
        }

        public toLong(): number {
            return (this.getX() & BlockPos.X_MASK) << BlockPos.X_SHIFT | 
                    (this.getY() & BlockPos.Y_MASK) << BlockPos.Y_SHIFT | 
                    (this.getZ() & BlockPos.Z_MASK) << 0;
        }

        public fromLong(serialized: number): BlockPos {
            return new BlockPos(serialized << 64 - BlockPos.X_SHIFT - BlockPos.NUM_X_BITS >> 64 - BlockPos.NUM_X_BITS, 
                                serialized << 64 - BlockPos.Y_SHIFT - BlockPos.NUM_Y_BITS >> 64 - BlockPos.NUM_Y_BITS,
                                serialized << 64 - BlockPos.NUM_Z_BITS >> 64 - BlockPos.NUM_Z_BITS);
        }

        public static getAllInBox(from: BlockPos, to: BlockPos): java.lang.Iterable<BlockPos> {
            const blockpos: BlockPos = new BlockPos(Math.min(from.getX(), to.getX()), 
                                                    Math.min(from.getY(), to.getY()), 
                                                    Math.min(from.getZ(), to.getZ()));
            const blockpos1: BlockPos = new BlockPos(Math.max(from.getX(), to.getX()), 
                                                    Math.max(from.getY(), to.getY()), 
                                                    Math.max(from.getZ(), to.getZ()));
            return new (class extends java.lang.Iterable<BlockPos> {
                public iterator(): java.util.Iterator<BlockPos> {
                    return new (class extends AbstractIterator<BlockPos> {
                        constructor(){super()};
                        private lastReturned: BlockPos;
                        protected computeNext(): BlockPos {
                            if(this.lastReturned == null){
                                this.lastReturned = blockpos;
                                return this.lastReturned;
                            } else if(this.lastReturned.equals(blockpos1)) return this.endOfData(); else {
                                let i: number = this.lastReturned.getX();
                                let j: number = this.lastReturned.getY();
                                let k: number = this.lastReturned.getZ();
                                if(i < blockpos1.getX()) ++i;
                                else if(j < blockpos1.getY()) {i = blockpos.getX(); ++j;}
                                else if(k < blockpos1.getZ()) {i = blockpos.getX(), j = blockpos.getY(); ++k;};
                                this.lastReturned = new BlockPos(i, j, k);
                                return this.lastReturned;
                            }
                        }
                    });
                }
            })
        }

        public toImmutable(): BlockPos {
            return this;
        }

        public static getAllInBoxMutable(from: BlockPos, to: BlockPos): java.lang.Iterable<BlockPos> {
            const blockpos: BlockPos = new BlockPos(Math.min(from.getX(), to.getX()), 
                                                    Math.min(from.getY(), to.getY()), 
                                                    Math.min(from.getZ(), to.getZ()));
            const blockpos1: BlockPos = new BlockPos(Math.max(from.getX(), to.getX()), 
                                                    Math.max(from.getY(), to.getY()), 
                                                    Math.max(from.getZ(), to.getZ()));
            return new (class extends java.lang.Iterable<BlockPos> {
                public iterator(): java.util.Iterator<BlockPos> {
                    return new (class extends AbstractIterator<BlockPos> {
                        constructor(){super()};
                        private theBlockPos: BlockPos;
                        protected computeNext(): BlockPos {
                            if(this.theBlockPos == null){
                                this.theBlockPos = new BlockPos.MutableBlockPos(blockpos.getX(), blockpos.getY(), blockpos.getZ());
                                return this.theBlockPos;
                            } else if(this.theBlockPos.equals(blockpos1)) return this.endOfData(); else {
                                let i: number = this.theBlockPos.getX();
                                let j: number = this.theBlockPos.getY();
                                let k: number = this.theBlockPos.getZ();
                                if(i < blockpos1.getX()) ++i;
                                else if(j < blockpos1.getY()) {i = blockpos.getX(); ++j;}
                                else if(k < blockpos1.getZ()) {i = blockpos.getX(); j = blockpos.getY(); ++k;};
                                return new BlockPos(i, j, k);
                            }
                        }
                    });
                }
            });
        }

    }

    export namespace BlockPos {

        export class MutableBlockPos extends BlockPos {

            protected x: number;
            protected y: number;
            protected z: number;
    
            constructor();
            constructor(pos: BlockPos);
            constructor(x: number, y: number, z: number);
    
            constructor(x?: BlockPos | number, y?: number, z?: number){
                if(typeof x === "number"){
                    super(0, 0, 0);
                    this.x = x, this.y = y, this.z = z;
                } else if(typeof x === "object" && x instanceof BlockPos){
                    return new MutableBlockPos(x.getX(), x.getY(), x.getZ());
                } else return new MutableBlockPos(0, 0, 0);
            }
    
            public getX(): number {return this.x};
            public getY(): number {return this.y};
            public getZ(): number {return this.z};
    
            public setPos(xIn: number, yIn: number, zIn: number): MutableBlockPos;
            public setPos(entityIn: number): MutableBlockPos;
            public setPos(vec: Vec3i): MutableBlockPos;
            
            public setPos(x: number | Vec3i, y?: number, z?: number): MutableBlockPos {
                if(typeof x === "number"){
                    if(typeof y === "number" && typeof z === "number"){
                        this.x = Math.floor(x), this.y = Math.floor(y), this.z = Math.floor(z);
                        return this;
                    } else {
                        let pos = Entity.getPosition(x);
                        return this.setPos(pos.x, pos.y, pos.z);
                    }
                } else if(typeof x === "object" && x instanceof Vec3i){
                    return this.setPos(x.getX(), x.getY(), x.getZ());
                }
            }
    
            public move(facing: EnumFacing): MutableBlockPos;
            public move(facing: EnumFacing, num: number): MutableBlockPos;
    
            public move(facing: EnumFacing, num?: number): MutableBlockPos {
                if(typeof num === "number"){
                    return this.setPos(this.x + facing.getFrontOffsetX() * num,
                                        this.y + facing.getFrontOffsetY() * num,
                                        this.z + facing.getFrontOffsetZ() * num);
                } else return this.move(facing, 1);
            }
    
            public setY(yIn: number): void {
                this.y = yIn;
            }
    
            public toImmutable(): BlockPos {
                return new BlockPos(this.getX(), this.getY(), this.getZ());
            }
    
        }

    }

    export namespace Direction {

        export const offsetX: number[] = [0, -1, 0, 1];
        export const offsetZ: number[] = [1, 0, -1, 0];
        export const directions: string[] = ["SOUTH", "WEST", "NORTH", "EAST"];
        /** Maps a Direction value (2D) to a Facing value (3D). */
        export const directionsToFacing: number[] = [3, 4, 2, 5];
        /**  Maps a Facing value (3D) to a Direction value (2D). */
        export const facingToDirection: number[] = [-1, -1, 2, 0, 1, 3];
        /** Maps a direction to that opposite of it. */
        export const rotateOpposite: number[] = [2, 3, 0, 1];
        /** Maps a direction to that to the right of it. */
        export const rotateRight: number[] = [1, 2, 3, 0];
        /** Maps a direction to that to the left of it. */
        export const rotateLeft: number[] = [3, 0, 1, 2];
        export const bedDirection: number[][] = [[1, 0, 3, 2, 5, 4], [1, 0, 5, 4, 2, 3], [1, 0, 2, 3, 4, 5], [1, 0, 4, 5, 3, 2]];
    
        /**
         * Returns the movement direction from a velocity vector.
         */
        export function getMovementDirection(pitch: number, yaw: number): number {
            return Math.abs(pitch) > Math.abs(yaw) ? (pitch > 0 ? 1 : 3) : (yaw > 0 ? 2 : 0);
        }
    
    }

    export interface IStringSerializable {
        getName(): string;
    }

    export class EnumFacingAxisDirection {

        public static readonly POSITIVE: EnumFacingAxisDirection = new EnumFacingAxisDirection(1, "Towards positive");
        public static readonly NEGATIVE: EnumFacingAxisDirection = new EnumFacingAxisDirection(-1, "Towards negative");

        private readonly offset: number;
        private readonly description: string;
        private constructor(offset: number, description: string){
            this.offset = offset;
            this.description = description;
        }

        public getOffset(): number {
            return this.offset;
        }

        public toString(): string {
            return this.description;
        }

    }

    class EnumFacingPlane {
        
        public static readonly HORIZONTAL: EnumFacingPlane = new EnumFacingPlane(0);
        public static readonly VERTICAL: EnumFacingPlane = new EnumFacingPlane(1);
        private readonly num: number;
        private constructor(num: number){
            this.num = num;
        }

        public facings(): EnumFacing[] {
            switch(this){
                case EnumFacingPlane.HORIZONTAL:
                    return [];
                case EnumFacingPlane.VERTICAL:
                    return [];
                default:
                    throw new java.lang.Error("Someone\'s been tampering with the universe!");
            }
        }

        public random(rand: java.util.Random): EnumFacing {
            let aenumfacing: EnumFacing[] = this.facings();
            return aenumfacing[rand.nextInt(aenumfacing.length)];
        }

        public apply(toApply: Nullable<EnumFacing>): boolean {
            return toApply != null;//todo
        }

        public iterator(): java.util.Iterator<EnumFacing> {
            return java.util.Arrays.asList(this.facings()).iterator();
        }

    }

    export class EnumFacingAxis implements IStringSerializable {
        
        public static readonly X: EnumFacingAxis = new EnumFacingAxis("x", EnumFacingPlane.HORIZONTAL);
        public static readonly Y: EnumFacingAxis = new EnumFacingAxis("y", EnumFacingPlane.VERTICAL);
        public static readonly Z: EnumFacingAxis = new EnumFacingAxis("z", EnumFacingPlane.HORIZONTAL);

        public static readonly NAME_LOOKUP: java.util.Map<string, EnumFacingAxis> = new java.util.HashMap<string, EnumFacingAxis>();
        public static readonly VALUES: EnumFacingAxis[] = [EnumFacingAxis.X, EnumFacingAxis.Y, EnumFacingAxis.Z];
        private readonly name: string;
        private readonly plane: EnumFacingPlane;
        private constructor(name: string, plane: EnumFacingPlane){
            this.name = name;
            this.plane = plane;
        }

        public static byName(name: string): EnumFacingAxis {
            return name == null ? null : EnumFacingAxis.NAME_LOOKUP.get(name.toLowerCase());
        }

        public getName2(): string {
            return this.name;
        }

        public isVertical(): boolean {
            return this.plane == EnumFacingPlane.VERTICAL;
        }

        public isHorizontal(): boolean {
            return this.plane == EnumFacingPlane.HORIZONTAL;
        }

        public toString(): string {
            return this.name;
        }

        public apply(toApply: Nullable<EnumFacing>): boolean {
            return toApply != null && toApply.getAxis() == this;
        }

        public getPlane(): EnumFacingPlane {
            return this.plane;
        }

        public getName(): string {
            return this.name;
        }

    }

    export class EnumFacing implements IStringSerializable {

        public static readonly DOWN: EnumFacing = new EnumFacing(0, 1, -1, "down", EnumFacingAxisDirection.NEGATIVE, EnumFacingAxis.Y, new Vec3i(0, -1, 0));
        public static readonly UP: EnumFacing = new EnumFacing(1, 0, -1, "up", EnumFacingAxisDirection.POSITIVE, EnumFacingAxis.Y, new Vec3i(0, 1, 0));
        public static readonly NORTH: EnumFacing = new EnumFacing(2, 3, 2, "north", EnumFacingAxisDirection.NEGATIVE, EnumFacingAxis.Z, new Vec3i(0, 0, -1));
        public static readonly SOUTH: EnumFacing = new EnumFacing(3, 2, 0, "south", EnumFacingAxisDirection.POSITIVE, EnumFacingAxis.Z, new Vec3i(0, 0, 1));
        public static readonly WEST: EnumFacing = new EnumFacing(4, 5, 1, "west", EnumFacingAxisDirection.NEGATIVE, EnumFacingAxis.X, new Vec3i(-1, 0, 0));
        public static readonly EAST: EnumFacing = new EnumFacing(5, 4, 3, "east", EnumFacingAxisDirection.POSITIVE, EnumFacingAxis.X, new Vec3i(1, 0, 0));

        private readonly index: number;
        private readonly opposite: number;
        private readonly horizontalIndex: number;
        private readonly name: string;
        private readonly axis: EnumFacingAxis;
        private readonly axisDirection: EnumFacingAxisDirection;
        private readonly directionVec: Vec3i;

        public static readonly VALUES: EnumFacing[] = [];
        public static readonly HORIZONTALS: EnumFacing[] = [];
        public static readonly NAME_LOOKUP: java.util.Map<string, EnumFacing> = new java.util.HashMap<string, EnumFacing>();

        private constructor(indexIn: number, oppositeIn: number, horizontalIndexIn: number, nameIn: string, axisDirectionIn: EnumFacingAxisDirection, axisIn: EnumFacingAxis, directionVecIn: Vec3i){
            this.index = indexIn;
            this.horizontalIndex = horizontalIndexIn;
            this.opposite = oppositeIn;
            this.name = nameIn;
            this.axis = axisIn;
            this.axisDirection = axisDirectionIn;
            this.directionVec = directionVecIn;
        }

        public getIndex(): number {
            return this.index;
        }

        public getHorizontalIndex(): number {
            return this.horizontalIndex;
        }

        public getAxisDirection(): EnumFacingAxisDirection {
            return this.axisDirection;
        }

        public getOpposite(): EnumFacing {
            return EnumFacing.VALUES[this.opposite];
        }

        public rotateAround(axis: EnumFacingAxis): EnumFacing {
            switch(axis){
                case EnumFacingAxis.X:
                    if(this != EnumFacing.WEST && this != EnumFacing.EAST) return this.rotateX();
                    return this;
                case EnumFacingAxis.Y:
                    if(this != EnumFacing.UP && this != EnumFacing.DOWN) return this.rotateY();
                    return this;
                case EnumFacingAxis.Z:
                    if(this != EnumFacing.NORTH && this != EnumFacing.SOUTH) return this.rotateZ();
                    return this;
                default:
                    throw new java.lang.IllegalStateException(`Unable to get CW facing for axis ${axis}`);
            }
        }

        public rotateY(): EnumFacing {
            switch(this){
                case EnumFacing.NORTH: return EnumFacing.EAST;
                case EnumFacing.EAST: return EnumFacing.SOUTH;
                case EnumFacing.SOUTH: return EnumFacing.WEST;
                case EnumFacing.WEST: return EnumFacing.NORTH;
                default:
                    throw new java.lang.IllegalStateException(`Unable to get Y-rotated facing of ${this.name}`);
            }
        }

        private rotateX(): EnumFacing {
            switch(this){
                case EnumFacing.NORTH: return EnumFacing.DOWN;
                case EnumFacing.EAST: case EnumFacing.WEST: default:
                    throw new java.lang.IllegalStateException(`Unable to get X-rotated facing of ${this.name}`);
                case EnumFacing.SOUTH: return EnumFacing.UP;
                case EnumFacing.UP: return EnumFacing.NORTH;
                case EnumFacing.DOWN: return EnumFacing.SOUTH;
            }
        }

        private rotateZ(): EnumFacing {
            switch(this){
                case EnumFacing.EAST: return EnumFacing.DOWN;
                case EnumFacing.SOUTH: default:
                    throw new java.lang.IllegalStateException(`Unable to get Z-rotated facing of ${this.name}`);
                case EnumFacing.WEST: return EnumFacing.UP;
                case EnumFacing.UP: return EnumFacing.EAST;
                case EnumFacing.DOWN: return EnumFacing.WEST;
            }
        }

        public rotateYCCW(): EnumFacing {
            switch(this){
                case EnumFacing.NORTH: return EnumFacing.WEST;
                case EnumFacing.EAST: return EnumFacing.NORTH;
                case EnumFacing.SOUTH: return EnumFacing.EAST;
                case EnumFacing.WEST: return EnumFacing.SOUTH;
                default:
                    throw new java.lang.IllegalStateException(`Unable to get CCW facing of ${this.name}`);
            }
        }

        public getFrontOffsetX(): number {
            return this.axis == EnumFacing.Axis.X ? this.axisDirection.getOffset() : 0;
        }

        public getFrontOffsetY(): number {
            return this.axis == EnumFacing.Axis.Y ? this.axisDirection.getOffset() : 0;
        }

        public getFrontOffsetZ(): number {
            return this.axis == EnumFacing.Axis.Z ? this.axisDirection.getOffset() : 0;
        }

        public getName2(): string {
            return this.name;
        }

        public getAxis(): EnumFacingAxis {
            return this.axis;
        }

        public static byName(name: string): EnumFacing {
            return name == null ? null : this.NAME_LOOKUP.get(name.toLowerCase());
        }

        public static getFront(index: number): EnumFacing {
            return this.VALUES[Math.abs(index % this.VALUES.length)];
        }

        public static getHorizontal(index: number): EnumFacing {
            return this.HORIZONTALS[Math.abs(index % this.HORIZONTALS.length)];
        }

        public static fromAngle(angle: number): EnumFacing {
            return this.getHorizontal(Math.floor(angle / 90 + 0.5) & 3);
        }

        public getHorizontalAngle(): number {
            return (this.horizontalIndex & 3) * 90;
        }

        public static random(rand: java.util.Random): EnumFacing {
            return this.VALUES[rand.nextInt(this.VALUES.length)];
        }

        public static getFacingFromVector(x: number, y: number, z: number): EnumFacing {
            let enumfacing: EnumFacing = EnumFacing.NORTH;
            let f: number = java.lang.Float.MIN_VALUE;
            for(let i in this.VALUES){
                let enumfacing1: EnumFacing = this.VALUES[i];
                let f1: number = x * enumfacing1.directionVec.getX() + y * enumfacing1.directionVec.getY() + z * enumfacing1.directionVec.getZ();
                if(f1 > f){
                    f = f1, enumfacing = enumfacing1;
                }
            }
            return enumfacing;
        }

        public toString(): string {
            return this.name;
        }

        public static getFacingFromAxis(axisDirectionIn: EnumFacingAxisDirection, axisIn: EnumFacingAxis): EnumFacing {
            for(let i in this.VALUES){
                let enumfacing: EnumFacing = this.VALUES[i];
                if(enumfacing.getAxisDirection() == axisDirectionIn && enumfacing.getAxis() == axisIn) return enumfacing;
            }
            throw new java.lang.IllegalArgumentException(`No such direction: ${axisDirectionIn} ${axisIn}`);
        }

        public getDirectionVec(): Vec3i {
            return this.directionVec;
        }

        public getName(): string {
            return this.name;
        }

        public static readonly Axis = EnumFacingAxis;
        public static readonly Plane = EnumFacingPlane;
        public static readonly AxisDirection = EnumFacingAxisDirection;

    }

    export namespace MathHelper {

        export function clamp(num: number, min: number, max: number): number {
            return num < min ? min : (num > max ? max : num);
        }

        export function lerp(value1: number, value2: number, amount: number): number {
            return value1 + (value2 - value1) * amount;
        }

        export function intFloorDiv(f: number): number {
            let f1: number = 0.5 * f;
            let i: number = java.lang.Float.floatToIntBits(f);
            i = 1597463007 - (i >> 1);
            f = java.lang.Float.intBitsToFloat(i);
            f *= 1.5 - f1 * f * f;
            return f;
        }

    }

}

//static code

for(let i in MinecraftUtils.EnumFacing.VALUES){
    let enumfacing: MinecraftUtils.EnumFacing = MinecraftUtils.EnumFacing[i];
    MinecraftUtils.EnumFacing.VALUES[enumfacing.getIndex()] = enumfacing;
    if(enumfacing.getAxis().isHorizontal()){
        MinecraftUtils.EnumFacing.HORIZONTALS[enumfacing.getHorizontalIndex()] = enumfacing;
    }
    MinecraftUtils.EnumFacing.NAME_LOOKUP.put(enumfacing.getName2().toLowerCase(), enumfacing);
}

for(let i in MinecraftUtils.EnumFacing.Axis.VALUES){
    let enumfacingaxis = MinecraftUtils.EnumFacing.Axis.VALUES[i];
    MinecraftUtils.EnumFacing.Axis.NAME_LOOKUP.put(enumfacingaxis.getName2().toLowerCase(), enumfacingaxis);
}

//----------

EXPORT("MinecraftUtils", MinecraftUtils);