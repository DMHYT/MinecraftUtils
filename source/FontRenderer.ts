LIBRARY({
    name: "FontRenderer",
    version: 1,
    shared: false,
    api: 'CoreEngine'
});

class FontRenderer {

    private static readonly resourceInputStream: java.io.InputStream = new java.io.FileInputStream();

    private static readonly unicodePageLocations: any[] = [];

    private charWidth: number[] = [];

    public FONT_HEIGHT: number = 9;
    public fontRandom: java.util.Random = new java.util.Random();

    private glyphWidth: number[] = [];

    private colorCode: number[] = [];
    private locationFontTexture: string;

    private boundTexture: string;

    private posX: number;
    private posY: number;

    private unicodeFlag: boolean;
    private bidiFlag: boolean;

    private red: number;
    private green: number;
    private blue: number;
    private alpha: number;
    private textColor: number;

    private randomStyle: boolean;
    private boldStyle: boolean;
    private italicStyle: boolean;
    private underlineStyle: boolean;
    private strikethroughStyle: boolean;

    public gameSettings: any;
    public locationFontTextureBase: string;
    public enabled: boolean = true;
    public scaleFactor: number = 1;

    constructor(resLoc: string, uni: boolean){
        this.gameSettings = null;//TODO
        this.locationFontTextureBase = resLoc;
        this.locationFontTexture = resLoc;
        this.unicodeFlag = uni;
        this.locationFontTexture = FontRenderer.getHdFontLocation(this.locationFontTextureBase);
        this.bindTexture(this.locationFontTexture);
        for(let a=0; a<32; a++){
            let b: number = (a >> 3 & 1) * 85;
            let c: number = (a >> 2 & 1) * 170 + b;
            let d: number = (a >> 1 & 1) * 170 + b;
            let e: number = (a >> 0 & 1) * 170 + b;
            if(a == 6) c += 85;
            if(a >= 16) c /= d /= e /= 4;
            this.colorCode[a] = (c & 255) << 16 | (d & 255) << 8 | e & 255;
        }
        this.readGlyphSizes();
    }

    public onResorceManagerReload(): void {
        this.locationFontTexture = FontRenderer.getHdFontLocation(this.locationFontTextureBase);
        for(let e of FontRenderer.unicodePageLocations) e = null;
        this.readFontTexture();
        this.readGlyphSizes();
    }

    private readFontTexture(): void {
        let img: android.graphics.Bitmap;
        img = FileTools.ReadImage(this.locationFontTexture);
        if(img == null) throw new java.lang.RuntimeException();
        let imgWidth: number = img.getWidth();
        let imgHeight: number = img.getHeight();
        let charW: number = imgWidth / 16;
        let charH: number = imgHeight / 16;
        let kx: number = imgWidth / 128;
        this.scaleFactor = ((val: number, min: number, max: number) => val < min ? min : (val > max ? max : val))(kx, 1, 2);
        let ai: number[] = [];
        img.getPixels(ai, 0, imgWidth, 0, 0, imgWidth, imgHeight);
        let k: number = 0;
        while(k < 256){
            let cx: number = k % 16;
            let cy: number = k / 16;
            let px: boolean = false;
            let var19: number = charW - 1;
            while(true){
                if(var19 >= 0){
                    let x: number = cx * charW + var19;
                    let flag: boolean = true;
                    for(let py = 0; py < charH && flag; ++py){
                        let ypos: number = (cy * charH + py) * imgWidth;
                        let col: number = ai[x + ypos];
                        let al: number = col >> 24 & 255;
                        if(al > 16) flag = false;
                    }
                    if(flag){ --var19; continue; };
                }
                if(k == 65) k = k;
                if(k == 32){
                    if(charW <= 8){
                        var19 = 2 * kx;
                    } else var19 = 1.5 * kx;
                }
                this.charWidth[k] = (var19 + 1) / kx + 1;
                ++k;
                break;
            }
        }
        this.readCustomCharWidths();
    }

    private readGlyphSizes(): void {
        try {
            let input: java.io.InputStream = this.getResourceInputStream();
            input.read(this.glyphWidth);
        } catch(e){
            if(e instanceof java.io.IOException) throw new java.lang.RuntimeException(e);
        }
    }

    private renderCharAtPos(num: number, char: number, bool: boolean, mesh: RenderMesh): number {
        return char == 32 ? this.charWidth[char] : (char == 32 ? 4 : ("\u00c0\u00c1\u00c2\u00c8\u00ca\u00cb\u00cd\u00d3\u00d4\u00d5\u00da\u00df\u00e3\u00f5\u011f\u0130\u0131\u0152\u0153\u015e\u015f\u0174\u0175\u017e\u0207\u0000\u0000\u0000\u0000\u0000\u0000\u0000 !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u0000\u00c7\u00fc\u00e9\u00e2\u00e4\u00e0\u00e5\u00e7\u00ea\u00eb\u00e8\u00ef\u00ee\u00ec\u00c4\u00c5\u00c9\u00e6\u00c6\u00f4\u00f6\u00f2\u00fb\u00f9\u00ff\u00d6\u00dc\u00f8\u00a3\u00d8\u00d7\u0192\u00e1\u00ed\u00f3\u00fa\u00f1\u00d1\u00aa\u00ba\u00bf\u00ae\u00ac\u00bd\u00bc\u00a1\u00ab\u00bb\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255d\u255c\u255b\u2510\u2514\u2534\u252c\u251c\u2500\u253c\u255e\u255f\u255a\u2554\u2569\u2566\u2560\u2550\u256c\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256b\u256a\u2518\u250c\u2588\u2584\u258c\u2590\u2580\u03b1\u03b2\u0393\u03c0\u03a3\u03c3\u03bc\u03c4\u03a6\u0398\u03a9\u03b4\u221e\u2205\u2208\u2229\u2261\u00b1\u2265\u2264\u2320\u2321\u00f7\u2248\u00b0\u2219\u00b7\u221a\u207f\u00b2\u25a0\u0000"
            .indexOf(char.toString()) != -1 && !this.unicodeFlag ? this.renderDefaultChar(num, bool, mesh) : this.renderUnicodeChar(char, bool, mesh)));
    }

    private renderDefaultChar(num: number, bool: boolean, mesh: RenderMesh): number {
        let var3: number = num % 16 * 8;
        let var4: number = num / 16 * 8;
        let var5: number = bool ? 1 : 0;
        this.bindTexture(this.locationFontTexture);
        let var6: number = 7.99;
        mesh.addVertex(this.posX + var5, this.posY, 0, var3 / 128, var4 / 128);
        mesh.addVertex(this.posX - var5, this.posY + 7.99, 0, var3 / 128, (var4 + 7.99) / 128);
        mesh.addVertex(this.posX + var6 - 1 + var5, this.posY, 0, (var3 + var6 - 1) / 128, var4 / 128);
        mesh.addVertex(this.posX + var6 - 1 - var5, this.posY + 7.99, 0, (var3 + var6 - 1) / 128, (var4 + 7.99) / 128);
        return this.charWidth[num];
    }

    private getUnicodePageLocation(num: number): string {
        if(FontRenderer.unicodePageLocations[num] == null){
            FontRenderer.unicodePageLocations[num] = java.lang.String.format("textures/font/unicode_page_%02x.png", [java.lang.Integer.valueOf(num)]);
            FontRenderer.unicodePageLocations[num] = FontRenderer.getHdFontLocation(FontRenderer.unicodePageLocations[num]);
        }
        return FontRenderer.unicodePageLocations[num];
    }

    private loadGlyphTexture(num: number): void {
        this.bindTexture(this.getUnicodePageLocation(num));
    }

    private renderUnicodeChar(char: number, bool: boolean, mesh: RenderMesh): number {
        if(this.glyphWidth[char] == 0) return 0;
        else {
            let var3: number = char / 256,
                var4: number = this.glyphWidth[char] >>> 4,
                var5: number = this.glyphWidth[char] & 15;
            var4 &= 15;
            let var6: number = var4, var7: number = var5 + 1,
                var8: number = char % 16 * 16 + var6,
                var9: number = (char & 255) / 16 * 16,
                var10: number = var7 - var6 - 0.02,
                var11: number = bool ? 1 : 0;
            mesh.addVertex(this.posX + var11, this.posY, 0, var8 / 256, var9 / 256);
            mesh.addVertex(this.posX - var11, this.posY + 7.99, 0, var8 / 256, (var9 + 15.98) / 256);
            mesh.addVertex(this.posX + var10 / 2 + var11, this.posY, 0, (var8 + var10) / 256, var9 / 256);
            mesh.addVertex(this.posX + var10 / 2 - var11, this.posY + 7.99, 0, (var8 + var10) / 256, (var9 + 15.98) / 256);
            return (var7 - var6) / 2 + 1;
        }
    }

    private resetStyles(): void {
        this.randomStyle = this.boldStyle = this.italicStyle = this.underlineStyle = this.strikethroughStyle = false;
    }

    public drawStringWithShadow(str: string, num1: number, num2: number, num3: number, mesh: RenderMesh): number {
        return this.drawString(str, num1, num2, num3, mesh, true);
    }

    public drawString(str: string, num1: number, num2: number, num3: number, mesh: RenderMesh): number;
    public drawString(str: string, num1: number, num2: number, num3: number, mesh: RenderMesh, bool: boolean): number;

    public drawString(str: string, num1: number, num2: number, num3: number, mesh: RenderMesh, bool?: boolean): number {
        if(typeof bool === "boolean"){
            this.resetStyles();
            let var6: number;
            if(bool){
                var6 = this.renderString(str, num1 + 1, num2 + 1, num3, true, mesh);
                var6 = Math.max(var6, this.renderString(str, num1, num2, num3, false, mesh));
            } else var6 = this.renderString(str, num1, num2, num3, false, mesh);
            return var6;
        } else return !this.enabled ? 0 : this.drawString(str, num1, num2, num3, mesh, false);
    }

    private renderStringAtPos(str: string, bool: boolean, mesh: RenderMesh): void {
        for(let a=0; a<str.length; a++){
            let b: string = str.charAt(a);
            let c: number, d: number;
            if(b.charCodeAt(0) == 167 && a + 1 < str.length){
                c = "0123456789abcdefklmnor".indexOf(str.toLowerCase().charAt(a + 1))
                if(c < 16){
                    this.randomStyle = this.boldStyle = this.strikethroughStyle = this.underlineStyle = this.italicStyle = false;
                    if(c < 0 || c > 15) c = 15;
                    if(bool) c += 16;
                    d = this.colorCode[c];
                    this.textColor = d;
                    this.setColor((d >> 16) / 255, (d >> 8 & 255) / 255, (d & 255) / 255, this.alpha, mesh);
                } else if(c == 16) this.randomStyle = true; else if(c == 17) this.boldStyle = true;
                else if(c == 18) this.strikethroughStyle = true; else if(c == 19) this.underlineStyle = true;
                else if(c == 20) this.italicStyle = true; else if(c == 21){
                    this.randomStyle = this.boldStyle = this.strikethroughStyle = this.underlineStyle = this.italicStyle = false;
                    this.setColor(this.red, this.blue, this.green, this.alpha, mesh);
                }
                ++a;
            } else {
                c = "\u00c0\u00c1\u00c2\u00c8\u00ca\u00cb\u00cd\u00d3\u00d4\u00d5\u00da\u00df\u00e3\u00f5\u011f\u0130\u0131\u0152\u0153\u015e\u015f\u0174\u0175\u017e\u0207\u0000\u0000\u0000\u0000\u0000\u0000\u0000 !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u0000\u00c7\u00fc\u00e9\u00e2\u00e4\u00e0\u00e5\u00e7\u00ea\u00eb\u00e8\u00ef\u00ee\u00ec\u00c4\u00c5\u00c9\u00e6\u00c6\u00f4\u00f6\u00f2\u00fb\u00f9\u00ff\u00d6\u00dc\u00f8\u00a3\u00d8\u00d7\u0192\u00e1\u00ed\u00f3\u00fa\u00f1\u00d1\u00aa\u00ba\u00bf\u00ae\u00ac\u00bd\u00bc\u00a1\u00ab\u00bb\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255d\u255c\u255b\u2510\u2514\u2534\u252c\u251c\u2500\u253c\u255e\u255f\u255a\u2554\u2569\u2566\u2560\u2550\u256c\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256b\u256a\u2518\u250c\u2588\u2584\u258c\u2590\u2580\u03b1\u03b2\u0393\u03c0\u03a3\u03c3\u03bc\u03c4\u03a6\u0398\u03a9\u03b4\u221e\u2205\u2208\u2229\u2261\u00b1\u2265\u2264\u2320\u2321\u00f7\u2248\u00b0\u2219\u00b7\u221a\u207f\u00b2\u25a0\u0000"
                    .indexOf(b);
                if(this.randomStyle && d != -1){
                    do {
                        d = this.fontRandom.nextInt(this.charWidth.length);
                    } while(this.charWidth[c] != this.charWidth[d]);
                    c = d;
                }
                let i: number = this.unicodeFlag ? 0.5 : 1 / this.scaleFactor;
                let e: boolean = (b.charCodeAt(0) == 0 || c == -1 || this.unicodeFlag) && bool;
                if(e) this.posX -= this.posY -= i;
                let f: number = this.renderCharAtPos(c, b.charCodeAt(0), this.italicStyle, mesh);
                if(e) this.posX += this.posY += i;
                if(this.boldStyle){
                    this.posX += i;
                    if(e) this.posX -= this.posY -= i;
                    this.renderCharAtPos(c, b.charCodeAt(0), this.italicStyle, mesh);
                    this.posX -= i;
                    if(e) this.posX += this.posY += i;
                    f += i;
                }
                if(this.strikethroughStyle){
                    mesh.addVertex(this.posX, (this.posY + (this.FONT_HEIGHT / 2)), 0, 0, 0);//i'm not sure about the uv -_-
                    mesh.addVertex((this.posX + f), (this.posY + (this.FONT_HEIGHT / 2)), 0, 0, 0);
                    mesh.addVertex((this.posX + f), (this.posY + (this.FONT_HEIGHT / 2) - 1), 0, 0, 0);
                    mesh.addVertex(this.posX, (this.posY + (this.FONT_HEIGHT / 2) - 1), 0, 0, 0);
                }
                if(this.underlineStyle){
                    let h: number = this.underlineStyle ? -1 : 0;
                    mesh.addVertex((this.posX + h), (this.posY + this.FONT_HEIGHT), 0, 0, 0);
                    mesh.addVertex((this.posX + f), (this.posY + this.FONT_HEIGHT), 0, 0, 0);
                    mesh.addVertex((this.posX + f), (this.posY + this.FONT_HEIGHT - 1), 0, 0, 0);
                    mesh.addVertex((this.posX + h), (this.posY + this.FONT_HEIGHT - 1), 0, 0, 0);
                }
                this.posX += f;
            }
        }
    }

    private renderStringAligned(str: string, num1: number, num2: number, num3: number, num4: number, bool: boolean, mesh: RenderMesh): number {
        return this.renderString(str, num1, num2, num4, bool, mesh);
    }

    private renderString(str: string, num1: number, num2: number, num3: number, bool: boolean, mesh: RenderMesh): number {
        if(str == null) return 0; else {
            if(this.bidiFlag) return;
            if((num3 & -67108864) == 0) num3 |= -16777216;
            if(bool) num3 = (num3 & 16579836) >> 2 | num3 & -16777216;
            this.red = (num3 >> 16 & 255) / 255;
            this.blue = (num3 >> 8 & 255) / 255;
            this.green = (num3 & 255) / 255;
            this.alpha = (num3 >> 24 & 255) / 255;
            this.setColor(this.red, this.blue, this.green, this.alpha, mesh);
            this.posX = num1;
            this.posY = num2;
            this.renderStringAtPos(str, bool, mesh);
            return this.posX;
        }
    }

    public getStringWidth(str: string): number {
        if(str == null) return 0; else {
            let var2: number = 0;
            let var3: boolean = false;
            for(let var4 = 0; var4 < str.length; ++var4){
                let var5: string = str.charAt(var4);
                let var6: number = this.getCharWidthFloat(var5);
                if(var6 < 0 && var4 < str.length - 1){
                    ++var4, var5 = str.charAt(var4);
                    if(var5.charCodeAt(0) != 108 && var5.charCodeAt(0) != 76){
                        if(var5.charCodeAt(0) == 114 || var5.charCodeAt(0) == 82) var3 = false;
                    } else var3 = true;
                    var6 = 0;
                }
                var2 += var6;
                if(var3 && var6 > 0) var2 += 1 / this.scaleFactor;
            }
            return var2;
        }
    }

    public getCharWidth(char: string): number {
        return Math.round(this.getCharWidthFloat(char));
    }

    private getCharWidthFloat(char: string): number {
        if(char.charCodeAt(0) == 167) return -1;
        else if(char.charCodeAt(0) == 32) return this.charWidth[32];
        else {
            let var2: number = "\u00c0\u00c1\u00c2\u00c8\u00ca\u00cb\u00cd\u00d3\u00d4\u00d5\u00da\u00df\u00e3\u00f5\u011f\u0130\u0131\u0152\u0153\u015e\u015f\u0174\u0175\u017e\u0207\u0000\u0000\u0000\u0000\u0000\u0000\u0000 !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u0000\u00c7\u00fc\u00e9\u00e2\u00e4\u00e0\u00e5\u00e7\u00ea\u00eb\u00e8\u00ef\u00ee\u00ec\u00c4\u00c5\u00c9\u00e6\u00c6\u00f4\u00f6\u00f2\u00fb\u00f9\u00ff\u00d6\u00dc\u00f8\u00a3\u00d8\u00d7\u0192\u00e1\u00ed\u00f3\u00fa\u00f1\u00d1\u00aa\u00ba\u00bf\u00ae\u00ac\u00bd\u00bc\u00a1\u00ab\u00bb\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255d\u255c\u255b\u2510\u2514\u2534\u252c\u251c\u2500\u253c\u255e\u255f\u255a\u2554\u2569\u2566\u2560\u2550\u256c\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256b\u256a\u2518\u250c\u2588\u2584\u258c\u2590\u2580\u03b1\u03b2\u0393\u03c0\u03a3\u03c3\u03bc\u03c4\u03a6\u0398\u03a9\u03b4\u221e\u2205\u2208\u2229\u2261\u00b1\u2265\u2264\u2320\u2321\u00f7\u2248\u00b0\u2219\u00b7\u221a\u207f\u00b2\u25a0\u0000"
                .indexOf(char);
            if(char.charCodeAt(0) > 0 && var2 != -1 && !this.unicodeFlag) return this.charWidth[var2];
            else if(this.glyphWidth[char.charCodeAt(0)] != 0){
                let var3: number = this.glyphWidth[char.charCodeAt(0)] >>> 4;
                let var4: number = this.glyphWidth[char.charCodeAt(0)] & 15;
                var3 &= 15, ++var4;
                return (var4 - var3) / 2 + 1;
            } else return 0;
        }
    }

    public trimStringToWidth(str: string, num: number): string;
    public trimStringToWidth(str: string, num: number, bool: boolean): string;

    public trimStringToWidth(str: string, num: number, bool?: boolean): string {
        if(typeof bool === "boolean"){
            let builder: java.lang.StringBuilder = new java.lang.StringBuilder();
            let var5: number = 0;
            let var6: number = bool ? str.length - 1 : 0;
            let var7: number = bool ? -1 : 1;
            let var8: boolean = false, var9: boolean = false;
            for(let var10 = var6; var10 >= 0 && var10 < str.length && var5 < num; var10 += var7){
                let var11: string = str.charAt(var10);
                let var12: number = this.getCharWidthFloat(var11);
                if(var8){
                    var8 = false;
                    if(var11.charCodeAt(0) != 108 && var11.charCodeAt(0) != 76){
                        if(var11.charCodeAt(0) == 114 || var11.charCodeAt(0) == 82) var9 = false;
                    } else var9 = true;
                } else if(var12 < 0) var8 = true; else {
                    var5 += var12;
                    if(var9) ++var5;
                }
                if(var5 > num) break;
                if(bool) builder.insert(0, var11); else builder.append(var11);
            }
            return builder.toString();
        } else return this.trimStringToWidth(str, num, false);
    }

    private trimStringNewline(str: string): string {
        while(str != null && str.endsWith("\n")) str = str.substring(0, str.length - 1);
        return str;
    }

    public drawSplitString(str: string, num1: number, num2: number, num3: number, bool: boolean, mesh: RenderMesh): void {
        this.resetStyles();
        this.textColor = num3;
        str = this.trimStringNewline(str);
        this.renderSplitString(str, num1, num2, num3, bool, mesh);
    }

    private renderSplitString(str: string, num1: number, num2: number, num3: number, bool: boolean, mesh: RenderMesh): void {
        let l: java.util.List<string> = this.listFormattedStringToWidth(str, num3);
        let iter: java.util.Iterator<string> = l.iterator();
        while(iter.hasNext()){
            let st: string = iter.next();
            this.renderStringAligned(st, num1, num2, num3, this.textColor, bool, mesh);
            num2 += this.FONT_HEIGHT;
        }
    }

    public splitStringWidth(str: string, num: number): number {
        return this.FONT_HEIGHT * this.listFormattedStringToWidth(str, num).size();
    }

    public setUnicodeFlag(bool: boolean): void {
        this.unicodeFlag = bool;
    }

    public getUnicodeFlag(): boolean {
        return this.unicodeFlag;
    }

    public listFormattedStringToWidth(str: string, num: number): java.util.List<string> {
        return java.util.Arrays.asList(this.wrapFormattedStringToWidth(str, num).split("\n"));
    }

    public wrapFormattedStringToWidth(str: string, num: number): string {
        let sizestr: number = this.sizeStringToWidth(str, num);
        if(str.length <= sizestr) return str; else {
            let subs: string = str.substring(0, sizestr);
            let char: string = str.charAt(sizestr);
            let chc: number = char.charCodeAt(0);
            let b: boolean = chc == 32 || chc == 10;
            let st: string;
            return subs + "\n" + this.wrapFormattedStringToWidth(st, num);
        }
    }

    private sizeStringToWidth(str: string, num: number): number {
        let strlen: number = str.length;
        let var4: number = 0, var5: number = 0, var6: number = -1;
        for(let var7 = false; var5 < strlen; ++var5){
            let var8: string = str.charAt(var5);
            switch(var8.charCodeAt(0)){
                case 10: --var5; break;
                case 167:
                    if(var5 < strlen - 1){
                        ++var5;
                        let var9: string = str.charAt(var5);
                        if(var9.charCodeAt(0) != 108 && var9.charCodeAt(0) != 76){
                            if(var9.charCodeAt(0) == 114 || var9.charCodeAt(0) == 82 || FontRenderer.isFormatColor(var9)) var7 = false;
                        } else var7 = true;
                    }; break;
                case 32: var6 = var5;
                default: var4 += this.getCharWidthFloat(var8); if(var7) ++var4;
            }
            if(var8.charCodeAt(0) == 10) {++var5; var6 = var5; break; };
            if(var4 > num) break;
        }
        return var5 != strlen && var6 != -1 && var6 < var5 ? var6 : var5; 
    }

    private static isFormatColor(char: string): boolean {
        let charr: number = char.charCodeAt(0); 
        return charr >= 48 && charr <= 57 || charr >= 97 && charr <= 102 || charr >= 65 && charr <= 70;
    }

    private static isFormatSpecial(char: string): boolean {
        let charr: number = char.charCodeAt(0);
        return charr >= 107 && charr <= 111 || charr >= 75 && charr <= 79 || charr == 114 || charr == 82;
    }

    private static getFormatFromString(str: string): string {
        let st: string = "", mo: number = -1, len: number = str.length;
        while((mo = str.indexOf("\u00A7", mo + 1)) != -1){
            if(mo < len - 1){
                let ch: string = str.charAt(mo + 1);
                if(this.isFormatColor(ch)) st = "\u00A7" + ch;
                else if(this.isFormatSpecial(ch)) st = st + "\u00A7" + ch;
            }
        }
        return st;
    }

    public getBidiFlag(): boolean {
        return this.bidiFlag;
    }

    protected setColor(r: number, g: number, b: number, a: number, mesh: RenderMesh): void {
        mesh.setColor(r, g, b, a);
    }

    protected bindTexture(location: string): void {
        this.boundTexture = location;
    }

    protected getResourceInputStream(): java.io.InputStream {
        return FontRenderer.resourceInputStream;
    }

    private readCustomCharWidths(): void {
        let fontFileName: string = this.locationFontTexture;
        let suffix: string = ".png";
        if(fontFileName.endsWith(suffix)){
            let fileName: string = fontFileName.substring(0, fontFileName.length - suffix.length) + ".properties";
            try {
                let e: string = this.locationFontTexture;
                let inn: java.io.InputStream = new java.io.FileInputStream(new java.io.File(fontFileName));
                if(inn == null) return;
                Logger.Log("Loading " + fileName, "CreateIC");
                let props: java.util.Properties = new java.util.Properties();
                props.load(inn);
                let keySet: java.util.Set<string> = props.keySet();
                let iter: java.util.Iterator<string> = keySet.iterator();
                while(iter.hasNext()){
                    let key: string = iter.next();
                    let prefix: string = "width.";
                    if(key.startsWith(prefix)){
                        let numStr: string = key.substring(prefix.length);
                        let num: number = parseInt(numStr, -1);
                        if(num >= 0 && num < this.charWidth.length){
                            let value: string = props.getProperty(key);
                            let width: number = parseFloat(value);
                            if(width >= 0) this.charWidth[num] = width;
                        }
                    }
                }
            } catch(e){
                if(e instanceof java.io.IOException){
                    e.printStackTrace();
                }
            }
        }
    }

    private static getHdFontLocation(fontLoc: string): string {
        if(fontLoc == null) return fontLoc;
        else {
            let texturesStr: string = "textures/";
            let mcpatcherStr: string = "mcpatcher/";
            if(!fontLoc.startsWith(texturesStr)) return fontLoc;
            else {
                let fontLocHD: string = mcpatcherStr + fontLoc.substring(texturesStr.length);
                return FileTools.isExists(__dir__ + "/" + fontLoc) ? fontLocHD : fontLoc;
            }
        }
    }

}

EXPORT("FontRenderer", FontRenderer);