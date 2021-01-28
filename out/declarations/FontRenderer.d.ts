declare class FontRenderer {
    private static readonly resourceInputStream;
    private static readonly unicodePageLocations;
    private charWidth;
    FONT_HEIGHT: number;
    fontRandom: java.util.Random;
    private glyphWidth;
    private colorCode;
    private locationFontTexture;
    private boundTexture;
    private posX;
    private posY;
    private unicodeFlag;
    private bidiFlag;
    private red;
    private green;
    private blue;
    private alpha;
    private textColor;
    private randomStyle;
    private boldStyle;
    private italicStyle;
    private underlineStyle;
    private strikethroughStyle;
    gameSettings: any;
    locationFontTextureBase: string;
    enabled: boolean;
    scaleFactor: number;
    constructor(resLoc: string, uni: boolean);
    onResorceManagerReload(): void;
    private readFontTexture;
    private readGlyphSizes;
    private renderCharAtPos;
    private renderDefaultChar;
    private getUnicodePageLocation;
    private loadGlyphTexture;
    private renderUnicodeChar;
    private resetStyles;
    drawStringWithShadow(str: string, num1: number, num2: number, num3: number, mesh: RenderMesh): number;
    drawString(str: string, num1: number, num2: number, num3: number, mesh: RenderMesh): number;
    drawString(str: string, num1: number, num2: number, num3: number, mesh: RenderMesh, bool: boolean): number;
    private renderStringAtPos;
    private renderStringAligned;
    private renderString;
    getStringWidth(str: string): number;
    getCharWidth(char: string): number;
    private getCharWidthFloat;
    trimStringToWidth(str: string, num: number): string;
    trimStringToWidth(str: string, num: number, bool: boolean): string;
    private trimStringNewline;
    drawSplitString(str: string, num1: number, num2: number, num3: number, bool: boolean, mesh: RenderMesh): void;
    private renderSplitString;
    splitStringWidth(str: string, num: number): number;
    setUnicodeFlag(bool: boolean): void;
    getUnicodeFlag(): boolean;
    listFormattedStringToWidth(str: string, num: number): java.util.List<string>;
    wrapFormattedStringToWidth(str: string, num: number): string;
    private sizeStringToWidth;
    private static isFormatColor;
    private static isFormatSpecial;
    private static getFormatFromString;
    getBidiFlag(): boolean;
    protected setColor(r: number, g: number, b: number, a: number, mesh: RenderMesh): void;
    protected bindTexture(location: string): void;
    protected getResourceInputStream(): java.io.InputStream;
    private readCustomCharWidths;
    private static getHdFontLocation;
}
