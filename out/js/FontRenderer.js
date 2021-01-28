LIBRARY({
    name: "FontRenderer",
    version: 1,
    shared: false,
    api: 'CoreEngine'
});
var FontRenderer = /** @class */ (function () {
    function FontRenderer(resLoc, uni) {
        this.charWidth = [];
        this.FONT_HEIGHT = 9;
        this.fontRandom = new java.util.Random();
        this.glyphWidth = [];
        this.colorCode = [];
        this.enabled = true;
        this.scaleFactor = 1;
        this.gameSettings = null; //TODO
        this.locationFontTextureBase = resLoc;
        this.locationFontTexture = resLoc;
        this.unicodeFlag = uni;
        this.locationFontTexture = FontRenderer.getHdFontLocation(this.locationFontTextureBase);
        this.bindTexture(this.locationFontTexture);
        for (var a = 0; a < 32; a++) {
            var b = (a >> 3 & 1) * 85;
            var c = (a >> 2 & 1) * 170 + b;
            var d = (a >> 1 & 1) * 170 + b;
            var e = (a >> 0 & 1) * 170 + b;
            if (a == 6)
                c += 85;
            if (a >= 16)
                c /= d /= e /= 4;
            this.colorCode[a] = (c & 255) << 16 | (d & 255) << 8 | e & 255;
        }
        this.readGlyphSizes();
    }
    FontRenderer.prototype.onResorceManagerReload = function () {
        this.locationFontTexture = FontRenderer.getHdFontLocation(this.locationFontTextureBase);
        for (var _i = 0, _a = FontRenderer.unicodePageLocations; _i < _a.length; _i++) {
            var e = _a[_i];
            e = null;
        }
        this.readFontTexture();
        this.readGlyphSizes();
    };
    FontRenderer.prototype.readFontTexture = function () {
        var img;
        img = FileTools.ReadImage(this.locationFontTexture);
        if (img == null)
            throw new java.lang.RuntimeException();
        var imgWidth = img.getWidth();
        var imgHeight = img.getHeight();
        var charW = imgWidth / 16;
        var charH = imgHeight / 16;
        var kx = imgWidth / 128;
        this.scaleFactor = (function (val, min, max) { return val < min ? min : (val > max ? max : val); })(kx, 1, 2);
        var ai = [];
        img.getPixels(ai, 0, imgWidth, 0, 0, imgWidth, imgHeight);
        var k = 0;
        while (k < 256) {
            var cx = k % 16;
            var cy = k / 16;
            var px = false;
            var var19 = charW - 1;
            while (true) {
                if (var19 >= 0) {
                    var x = cx * charW + var19;
                    var flag = true;
                    for (var py = 0; py < charH && flag; ++py) {
                        var ypos = (cy * charH + py) * imgWidth;
                        var col = ai[x + ypos];
                        var al = col >> 24 & 255;
                        if (al > 16)
                            flag = false;
                    }
                    if (flag) {
                        --var19;
                        continue;
                    }
                    ;
                }
                if (k == 65)
                    k = k;
                if (k == 32) {
                    if (charW <= 8) {
                        var19 = 2 * kx;
                    }
                    else
                        var19 = 1.5 * kx;
                }
                this.charWidth[k] = (var19 + 1) / kx + 1;
                ++k;
                break;
            }
        }
        this.readCustomCharWidths();
    };
    FontRenderer.prototype.readGlyphSizes = function () {
        try {
            var input = this.getResourceInputStream();
            input.read(this.glyphWidth);
        }
        catch (e) {
            if (e instanceof java.io.IOException)
                throw new java.lang.RuntimeException(e);
        }
    };
    FontRenderer.prototype.renderCharAtPos = function (num, char, bool, mesh) {
        return char == 32 ? this.charWidth[char] : (char == 32 ? 4 : ("\u00c0\u00c1\u00c2\u00c8\u00ca\u00cb\u00cd\u00d3\u00d4\u00d5\u00da\u00df\u00e3\u00f5\u011f\u0130\u0131\u0152\u0153\u015e\u015f\u0174\u0175\u017e\u0207\u0000\u0000\u0000\u0000\u0000\u0000\u0000 !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u0000\u00c7\u00fc\u00e9\u00e2\u00e4\u00e0\u00e5\u00e7\u00ea\u00eb\u00e8\u00ef\u00ee\u00ec\u00c4\u00c5\u00c9\u00e6\u00c6\u00f4\u00f6\u00f2\u00fb\u00f9\u00ff\u00d6\u00dc\u00f8\u00a3\u00d8\u00d7\u0192\u00e1\u00ed\u00f3\u00fa\u00f1\u00d1\u00aa\u00ba\u00bf\u00ae\u00ac\u00bd\u00bc\u00a1\u00ab\u00bb\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255d\u255c\u255b\u2510\u2514\u2534\u252c\u251c\u2500\u253c\u255e\u255f\u255a\u2554\u2569\u2566\u2560\u2550\u256c\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256b\u256a\u2518\u250c\u2588\u2584\u258c\u2590\u2580\u03b1\u03b2\u0393\u03c0\u03a3\u03c3\u03bc\u03c4\u03a6\u0398\u03a9\u03b4\u221e\u2205\u2208\u2229\u2261\u00b1\u2265\u2264\u2320\u2321\u00f7\u2248\u00b0\u2219\u00b7\u221a\u207f\u00b2\u25a0\u0000"
            .indexOf(char.toString()) != -1 && !this.unicodeFlag ? this.renderDefaultChar(num, bool, mesh) : this.renderUnicodeChar(char, bool, mesh)));
    };
    FontRenderer.prototype.renderDefaultChar = function (num, bool, mesh) {
        var var3 = num % 16 * 8;
        var var4 = num / 16 * 8;
        var var5 = bool ? 1 : 0;
        this.bindTexture(this.locationFontTexture);
        var var6 = 7.99;
        mesh.addVertex(this.posX + var5, this.posY, 0, var3 / 128, var4 / 128);
        mesh.addVertex(this.posX - var5, this.posY + 7.99, 0, var3 / 128, (var4 + 7.99) / 128);
        mesh.addVertex(this.posX + var6 - 1 + var5, this.posY, 0, (var3 + var6 - 1) / 128, var4 / 128);
        mesh.addVertex(this.posX + var6 - 1 - var5, this.posY + 7.99, 0, (var3 + var6 - 1) / 128, (var4 + 7.99) / 128);
        return this.charWidth[num];
    };
    FontRenderer.prototype.getUnicodePageLocation = function (num) {
        if (FontRenderer.unicodePageLocations[num] == null) {
            FontRenderer.unicodePageLocations[num] = java.lang.String.format("textures/font/unicode_page_%02x.png", [java.lang.Integer.valueOf(num)]);
            FontRenderer.unicodePageLocations[num] = FontRenderer.getHdFontLocation(FontRenderer.unicodePageLocations[num]);
        }
        return FontRenderer.unicodePageLocations[num];
    };
    FontRenderer.prototype.loadGlyphTexture = function (num) {
        this.bindTexture(this.getUnicodePageLocation(num));
    };
    FontRenderer.prototype.renderUnicodeChar = function (char, bool, mesh) {
        if (this.glyphWidth[char] == 0)
            return 0;
        else {
            var var3 = char / 256, var4 = this.glyphWidth[char] >>> 4, var5 = this.glyphWidth[char] & 15;
            var4 &= 15;
            var var6 = var4, var7 = var5 + 1, var8 = char % 16 * 16 + var6, var9 = (char & 255) / 16 * 16, var10 = var7 - var6 - 0.02, var11 = bool ? 1 : 0;
            mesh.addVertex(this.posX + var11, this.posY, 0, var8 / 256, var9 / 256);
            mesh.addVertex(this.posX - var11, this.posY + 7.99, 0, var8 / 256, (var9 + 15.98) / 256);
            mesh.addVertex(this.posX + var10 / 2 + var11, this.posY, 0, (var8 + var10) / 256, var9 / 256);
            mesh.addVertex(this.posX + var10 / 2 - var11, this.posY + 7.99, 0, (var8 + var10) / 256, (var9 + 15.98) / 256);
            return (var7 - var6) / 2 + 1;
        }
    };
    FontRenderer.prototype.resetStyles = function () {
        this.randomStyle = this.boldStyle = this.italicStyle = this.underlineStyle = this.strikethroughStyle = false;
    };
    FontRenderer.prototype.drawStringWithShadow = function (str, num1, num2, num3, mesh) {
        return this.drawString(str, num1, num2, num3, mesh, true);
    };
    FontRenderer.prototype.drawString = function (str, num1, num2, num3, mesh, bool) {
        if (typeof bool === "boolean") {
            this.resetStyles();
            var var6 = void 0;
            if (bool) {
                var6 = this.renderString(str, num1 + 1, num2 + 1, num3, true, mesh);
                var6 = Math.max(var6, this.renderString(str, num1, num2, num3, false, mesh));
            }
            else
                var6 = this.renderString(str, num1, num2, num3, false, mesh);
            return var6;
        }
        else
            return !this.enabled ? 0 : this.drawString(str, num1, num2, num3, mesh, false);
    };
    FontRenderer.prototype.renderStringAtPos = function (str, bool, mesh) {
        for (var a = 0; a < str.length; a++) {
            var b = str.charAt(a);
            var c = void 0, d = void 0;
            if (b.charCodeAt(0) == 167 && a + 1 < str.length) {
                c = "0123456789abcdefklmnor".indexOf(str.toLowerCase().charAt(a + 1));
                if (c < 16) {
                    this.randomStyle = this.boldStyle = this.strikethroughStyle = this.underlineStyle = this.italicStyle = false;
                    if (c < 0 || c > 15)
                        c = 15;
                    if (bool)
                        c += 16;
                    d = this.colorCode[c];
                    this.textColor = d;
                    this.setColor((d >> 16) / 255, (d >> 8 & 255) / 255, (d & 255) / 255, this.alpha, mesh);
                }
                else if (c == 16)
                    this.randomStyle = true;
                else if (c == 17)
                    this.boldStyle = true;
                else if (c == 18)
                    this.strikethroughStyle = true;
                else if (c == 19)
                    this.underlineStyle = true;
                else if (c == 20)
                    this.italicStyle = true;
                else if (c == 21) {
                    this.randomStyle = this.boldStyle = this.strikethroughStyle = this.underlineStyle = this.italicStyle = false;
                    this.setColor(this.red, this.blue, this.green, this.alpha, mesh);
                }
                ++a;
            }
            else {
                c = "\u00c0\u00c1\u00c2\u00c8\u00ca\u00cb\u00cd\u00d3\u00d4\u00d5\u00da\u00df\u00e3\u00f5\u011f\u0130\u0131\u0152\u0153\u015e\u015f\u0174\u0175\u017e\u0207\u0000\u0000\u0000\u0000\u0000\u0000\u0000 !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u0000\u00c7\u00fc\u00e9\u00e2\u00e4\u00e0\u00e5\u00e7\u00ea\u00eb\u00e8\u00ef\u00ee\u00ec\u00c4\u00c5\u00c9\u00e6\u00c6\u00f4\u00f6\u00f2\u00fb\u00f9\u00ff\u00d6\u00dc\u00f8\u00a3\u00d8\u00d7\u0192\u00e1\u00ed\u00f3\u00fa\u00f1\u00d1\u00aa\u00ba\u00bf\u00ae\u00ac\u00bd\u00bc\u00a1\u00ab\u00bb\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255d\u255c\u255b\u2510\u2514\u2534\u252c\u251c\u2500\u253c\u255e\u255f\u255a\u2554\u2569\u2566\u2560\u2550\u256c\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256b\u256a\u2518\u250c\u2588\u2584\u258c\u2590\u2580\u03b1\u03b2\u0393\u03c0\u03a3\u03c3\u03bc\u03c4\u03a6\u0398\u03a9\u03b4\u221e\u2205\u2208\u2229\u2261\u00b1\u2265\u2264\u2320\u2321\u00f7\u2248\u00b0\u2219\u00b7\u221a\u207f\u00b2\u25a0\u0000"
                    .indexOf(b);
                if (this.randomStyle && d != -1) {
                    do {
                        d = this.fontRandom.nextInt(this.charWidth.length);
                    } while (this.charWidth[c] != this.charWidth[d]);
                    c = d;
                }
                var i = this.unicodeFlag ? 0.5 : 1 / this.scaleFactor;
                var e = (b.charCodeAt(0) == 0 || c == -1 || this.unicodeFlag) && bool;
                if (e)
                    this.posX -= this.posY -= i;
                var f = this.renderCharAtPos(c, b.charCodeAt(0), this.italicStyle, mesh);
                if (e)
                    this.posX += this.posY += i;
                if (this.boldStyle) {
                    this.posX += i;
                    if (e)
                        this.posX -= this.posY -= i;
                    this.renderCharAtPos(c, b.charCodeAt(0), this.italicStyle, mesh);
                    this.posX -= i;
                    if (e)
                        this.posX += this.posY += i;
                    f += i;
                }
                if (this.strikethroughStyle) {
                    mesh.addVertex(this.posX, (this.posY + (this.FONT_HEIGHT / 2)), 0, 0, 0); //i'm not sure about the uv -_-
                    mesh.addVertex((this.posX + f), (this.posY + (this.FONT_HEIGHT / 2)), 0, 0, 0);
                    mesh.addVertex((this.posX + f), (this.posY + (this.FONT_HEIGHT / 2) - 1), 0, 0, 0);
                    mesh.addVertex(this.posX, (this.posY + (this.FONT_HEIGHT / 2) - 1), 0, 0, 0);
                }
                if (this.underlineStyle) {
                    var h = this.underlineStyle ? -1 : 0;
                    mesh.addVertex((this.posX + h), (this.posY + this.FONT_HEIGHT), 0, 0, 0);
                    mesh.addVertex((this.posX + f), (this.posY + this.FONT_HEIGHT), 0, 0, 0);
                    mesh.addVertex((this.posX + f), (this.posY + this.FONT_HEIGHT - 1), 0, 0, 0);
                    mesh.addVertex((this.posX + h), (this.posY + this.FONT_HEIGHT - 1), 0, 0, 0);
                }
                this.posX += f;
            }
        }
    };
    FontRenderer.prototype.renderStringAligned = function (str, num1, num2, num3, num4, bool, mesh) {
        return this.renderString(str, num1, num2, num4, bool, mesh);
    };
    FontRenderer.prototype.renderString = function (str, num1, num2, num3, bool, mesh) {
        if (str == null)
            return 0;
        else {
            if (this.bidiFlag)
                return;
            if ((num3 & -67108864) == 0)
                num3 |= -16777216;
            if (bool)
                num3 = (num3 & 16579836) >> 2 | num3 & -16777216;
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
    };
    FontRenderer.prototype.getStringWidth = function (str) {
        if (str == null)
            return 0;
        else {
            var var2 = 0;
            var var3 = false;
            for (var var4 = 0; var4 < str.length; ++var4) {
                var var5 = str.charAt(var4);
                var var6 = this.getCharWidthFloat(var5);
                if (var6 < 0 && var4 < str.length - 1) {
                    ++var4, var5 = str.charAt(var4);
                    if (var5.charCodeAt(0) != 108 && var5.charCodeAt(0) != 76) {
                        if (var5.charCodeAt(0) == 114 || var5.charCodeAt(0) == 82)
                            var3 = false;
                    }
                    else
                        var3 = true;
                    var6 = 0;
                }
                var2 += var6;
                if (var3 && var6 > 0)
                    var2 += 1 / this.scaleFactor;
            }
            return var2;
        }
    };
    FontRenderer.prototype.getCharWidth = function (char) {
        return Math.round(this.getCharWidthFloat(char));
    };
    FontRenderer.prototype.getCharWidthFloat = function (char) {
        if (char.charCodeAt(0) == 167)
            return -1;
        else if (char.charCodeAt(0) == 32)
            return this.charWidth[32];
        else {
            var var2 = "\u00c0\u00c1\u00c2\u00c8\u00ca\u00cb\u00cd\u00d3\u00d4\u00d5\u00da\u00df\u00e3\u00f5\u011f\u0130\u0131\u0152\u0153\u015e\u015f\u0174\u0175\u017e\u0207\u0000\u0000\u0000\u0000\u0000\u0000\u0000 !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u0000\u00c7\u00fc\u00e9\u00e2\u00e4\u00e0\u00e5\u00e7\u00ea\u00eb\u00e8\u00ef\u00ee\u00ec\u00c4\u00c5\u00c9\u00e6\u00c6\u00f4\u00f6\u00f2\u00fb\u00f9\u00ff\u00d6\u00dc\u00f8\u00a3\u00d8\u00d7\u0192\u00e1\u00ed\u00f3\u00fa\u00f1\u00d1\u00aa\u00ba\u00bf\u00ae\u00ac\u00bd\u00bc\u00a1\u00ab\u00bb\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255d\u255c\u255b\u2510\u2514\u2534\u252c\u251c\u2500\u253c\u255e\u255f\u255a\u2554\u2569\u2566\u2560\u2550\u256c\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256b\u256a\u2518\u250c\u2588\u2584\u258c\u2590\u2580\u03b1\u03b2\u0393\u03c0\u03a3\u03c3\u03bc\u03c4\u03a6\u0398\u03a9\u03b4\u221e\u2205\u2208\u2229\u2261\u00b1\u2265\u2264\u2320\u2321\u00f7\u2248\u00b0\u2219\u00b7\u221a\u207f\u00b2\u25a0\u0000"
                .indexOf(char);
            if (char.charCodeAt(0) > 0 && var2 != -1 && !this.unicodeFlag)
                return this.charWidth[var2];
            else if (this.glyphWidth[char.charCodeAt(0)] != 0) {
                var var3 = this.glyphWidth[char.charCodeAt(0)] >>> 4;
                var var4 = this.glyphWidth[char.charCodeAt(0)] & 15;
                var3 &= 15, ++var4;
                return (var4 - var3) / 2 + 1;
            }
            else
                return 0;
        }
    };
    FontRenderer.prototype.trimStringToWidth = function (str, num, bool) {
        if (typeof bool === "boolean") {
            var builder = new java.lang.StringBuilder();
            var var5 = 0;
            var var6 = bool ? str.length - 1 : 0;
            var var7 = bool ? -1 : 1;
            var var8 = false, var9 = false;
            for (var var10 = var6; var10 >= 0 && var10 < str.length && var5 < num; var10 += var7) {
                var var11 = str.charAt(var10);
                var var12 = this.getCharWidthFloat(var11);
                if (var8) {
                    var8 = false;
                    if (var11.charCodeAt(0) != 108 && var11.charCodeAt(0) != 76) {
                        if (var11.charCodeAt(0) == 114 || var11.charCodeAt(0) == 82)
                            var9 = false;
                    }
                    else
                        var9 = true;
                }
                else if (var12 < 0)
                    var8 = true;
                else {
                    var5 += var12;
                    if (var9)
                        ++var5;
                }
                if (var5 > num)
                    break;
                if (bool)
                    builder.insert(0, var11);
                else
                    builder.append(var11);
            }
            return builder.toString();
        }
        else
            return this.trimStringToWidth(str, num, false);
    };
    FontRenderer.prototype.trimStringNewline = function (str) {
        while (str != null && str.endsWith("\n"))
            str = str.substring(0, str.length - 1);
        return str;
    };
    FontRenderer.prototype.drawSplitString = function (str, num1, num2, num3, bool, mesh) {
        this.resetStyles();
        this.textColor = num3;
        str = this.trimStringNewline(str);
        this.renderSplitString(str, num1, num2, num3, bool, mesh);
    };
    FontRenderer.prototype.renderSplitString = function (str, num1, num2, num3, bool, mesh) {
        var l = this.listFormattedStringToWidth(str, num3);
        var iter = l.iterator();
        while (iter.hasNext()) {
            var st = iter.next();
            this.renderStringAligned(st, num1, num2, num3, this.textColor, bool, mesh);
            num2 += this.FONT_HEIGHT;
        }
    };
    FontRenderer.prototype.splitStringWidth = function (str, num) {
        return this.FONT_HEIGHT * this.listFormattedStringToWidth(str, num).size();
    };
    FontRenderer.prototype.setUnicodeFlag = function (bool) {
        this.unicodeFlag = bool;
    };
    FontRenderer.prototype.getUnicodeFlag = function () {
        return this.unicodeFlag;
    };
    FontRenderer.prototype.listFormattedStringToWidth = function (str, num) {
        return java.util.Arrays.asList(this.wrapFormattedStringToWidth(str, num).split("\n"));
    };
    FontRenderer.prototype.wrapFormattedStringToWidth = function (str, num) {
        var sizestr = this.sizeStringToWidth(str, num);
        if (str.length <= sizestr)
            return str;
        else {
            var subs = str.substring(0, sizestr);
            var char = str.charAt(sizestr);
            var chc = char.charCodeAt(0);
            var b = chc == 32 || chc == 10;
            var st = void 0;
            return subs + "\n" + this.wrapFormattedStringToWidth(st, num);
        }
    };
    FontRenderer.prototype.sizeStringToWidth = function (str, num) {
        var strlen = str.length;
        var var4 = 0, var5 = 0, var6 = -1;
        for (var var7 = false; var5 < strlen; ++var5) {
            var var8 = str.charAt(var5);
            switch (var8.charCodeAt(0)) {
                case 10:
                    --var5;
                    break;
                case 167:
                    if (var5 < strlen - 1) {
                        ++var5;
                        var var9 = str.charAt(var5);
                        if (var9.charCodeAt(0) != 108 && var9.charCodeAt(0) != 76) {
                            if (var9.charCodeAt(0) == 114 || var9.charCodeAt(0) == 82 || FontRenderer.isFormatColor(var9))
                                var7 = false;
                        }
                        else
                            var7 = true;
                    }
                    ;
                    break;
                case 32: var6 = var5;
                default:
                    var4 += this.getCharWidthFloat(var8);
                    if (var7)
                        ++var4;
            }
            if (var8.charCodeAt(0) == 10) {
                ++var5;
                var6 = var5;
                break;
            }
            ;
            if (var4 > num)
                break;
        }
        return var5 != strlen && var6 != -1 && var6 < var5 ? var6 : var5;
    };
    FontRenderer.isFormatColor = function (char) {
        var charr = char.charCodeAt(0);
        return charr >= 48 && charr <= 57 || charr >= 97 && charr <= 102 || charr >= 65 && charr <= 70;
    };
    FontRenderer.isFormatSpecial = function (char) {
        var charr = char.charCodeAt(0);
        return charr >= 107 && charr <= 111 || charr >= 75 && charr <= 79 || charr == 114 || charr == 82;
    };
    FontRenderer.getFormatFromString = function (str) {
        var st = "", mo = -1, len = str.length;
        while ((mo = str.indexOf("\u00A7", mo + 1)) != -1) {
            if (mo < len - 1) {
                var ch = str.charAt(mo + 1);
                if (this.isFormatColor(ch))
                    st = "\u00A7" + ch;
                else if (this.isFormatSpecial(ch))
                    st = st + "\u00A7" + ch;
            }
        }
        return st;
    };
    FontRenderer.prototype.getBidiFlag = function () {
        return this.bidiFlag;
    };
    FontRenderer.prototype.setColor = function (r, g, b, a, mesh) {
        mesh.setColor(r, g, b, a);
    };
    FontRenderer.prototype.bindTexture = function (location) {
        this.boundTexture = location;
    };
    FontRenderer.prototype.getResourceInputStream = function () {
        return FontRenderer.resourceInputStream;
    };
    FontRenderer.prototype.readCustomCharWidths = function () {
        var fontFileName = this.locationFontTexture;
        var suffix = ".png";
        if (fontFileName.endsWith(suffix)) {
            var fileName = fontFileName.substring(0, fontFileName.length - suffix.length) + ".properties";
            try {
                var e = this.locationFontTexture;
                var inn = new java.io.FileInputStream(new java.io.File(fontFileName));
                if (inn == null)
                    return;
                Logger.Log("Loading " + fileName, "CreateIC");
                var props = new java.util.Properties();
                props.load(inn);
                var keySet = props.keySet();
                var iter = keySet.iterator();
                while (iter.hasNext()) {
                    var key = iter.next();
                    var prefix = "width.";
                    if (key.startsWith(prefix)) {
                        var numStr = key.substring(prefix.length);
                        var num = parseInt(numStr, -1);
                        if (num >= 0 && num < this.charWidth.length) {
                            var value = props.getProperty(key);
                            var width = parseFloat(value);
                            if (width >= 0)
                                this.charWidth[num] = width;
                        }
                    }
                }
            }
            catch (e) {
                if (e instanceof java.io.IOException) {
                    e.printStackTrace();
                }
            }
        }
    };
    FontRenderer.getHdFontLocation = function (fontLoc) {
        if (fontLoc == null)
            return fontLoc;
        else {
            var texturesStr = "textures/";
            var mcpatcherStr = "mcpatcher/";
            if (!fontLoc.startsWith(texturesStr))
                return fontLoc;
            else {
                var fontLocHD = mcpatcherStr + fontLoc.substring(texturesStr.length);
                return FileTools.isExists(__dir__ + "/" + fontLoc) ? fontLocHD : fontLoc;
            }
        }
    };
    FontRenderer.resourceInputStream = new java.io.FileInputStream();
    FontRenderer.unicodePageLocations = [];
    return FontRenderer;
}());
EXPORT("FontRenderer", FontRenderer);
