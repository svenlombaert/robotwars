(function(d) {
    BitmapChar = function(a, b, l, f, h) {
        this.mTexture = b;
        this.mCharId = a;
        this.mXOffset = l;
        this.mYOffset = f;
        this.mXAdvance = h;
        this.mKernings = null
    };
    BitmapChar.prototype.addKerning = function(a, b) {
        null == this.mKernings && (this.mKernings = []);
        this.mKernings[a] = b
    };
    BitmapChar.prototype.getKerning = function(a) {
        return null == this.mKernings || null == this.mKernings[a] || void 0 == this.mKernings[a] ? 0 : this.mKernings[a]
    };
    BitmapChar.prototype.createImage = function() {
        return this.mTexture.clone()
    };
    BitmapChar.prototype.getCharId =
        function() {
            return this.mCharId
        };
    BitmapChar.prototype.getXOffset = function() {
        return this.mXOffset
    };
    BitmapChar.prototype.getYOffset = function() {
        return this.mYOffset
    };
    BitmapChar.prototype.getXAdvance = function() {
        return this.mXAdvance
    };
    BitmapChar.prototype.getTexture = function() {
        return this.mTexture
    };
    BitmapChar.prototype.getWidth = function() {
        return this.mTexture.spriteSheet.getFrame(this.mTexture.currentFrame).rect.width
    };
    BitmapChar.prototype.getHeight = function() {
        return this.mTexture.spriteSheet.getFrame(this.mTexture.currentFrame).rect.height
    };
    d.BitmapChar = BitmapChar
})(window);
(function(d) {
    BitmapFont = function(a, b, l) {
        this.mName = "unknown";
        this.mLineHeight = this.mSize = this.mBaseLine = l;
        this.mTexture = a;
        this.mChars = [];
        this.mHelperImage = new createjs.Bitmap(a);
        this.mCharLocationPool = [];
        b && this.parseFontXml(b);
        this.textHeight = this.textWidth = 0;
        this.previousWidth = []
    };
    BitmapFont.NATIVE_SIZE = -1;
    BitmapFont.MINI = "mini";
    BitmapFont.CHAR_SPACE = 32;
    BitmapFont.CHAR_TAB = 9;
    BitmapFont.CHAR_NEWLINE = 10;
    BitmapFont.CHAR_CARRIAGE_RETURN = 13;
    BitmapFont.prototype.parseFontXml = function(a) {
    	console.log('a: ', a);
        for (var b = a.childNodes[0].getElementsByTagName("chars")[0].getElementsByTagName("char"),
                l = [], f = {}, h = [], g = [], e = 0; e < b.length; e++) {

            var c = {};
            c.id = b[e].getAttribute("id");
            b[e].getAttribute("id");
            c.x = b[e].getAttribute("x");
            c.y = b[e].getAttribute("y");
            c.xAdvance = b[e].getAttribute("xadvance");
            c.xOffset = b[e].getAttribute("xoffset");
            c.yOffset = b[e].getAttribute("yoffset");
            c.width = b[e].getAttribute("width");
            c.height = b[e].getAttribute("height");
            l.push([c.x, c.y, c.width, c.height]);
            f["frame" + e] = [e];
            h.push(c)
        }
        spriteSheet = new createjs.SpriteSheet({
            images: [this.mTexture],
            frames: l,
            animations: f
        });
        for (c = 0; c <
            h.length; c++) b = new createjs.BitmapAnimation(spriteSheet), b.gotoAndStop(c), b.x = 800 * Math.random(), b.y = 100, b = new BitmapChar(h[c].id, b, h[c].xOffset, h[c].yOffset, h[c].xAdvance), this.addChar(h[c].id, b);
        if (null != a.childNodes[0].getElementsByTagName("kernings")[0])
            for (a = a.childNodes[0].getElementsByTagName("kernings")[0].getElementsByTagName("kerning"), h = 0; h < a.length; h++) c = {}, c.first = a[h].getAttribute("first"), c.second = a[h].getAttribute("second"), c.amount = a[h].getAttribute("amount"), g.push(c), c.second in
                this.mChars && this.getChar(c.second).addKerning(c.first, c.amount)
    };
    BitmapFont.prototype.getChar = function(a) {
        return this.mChars[a]
    };
    BitmapFont.prototype.addChar = function(a, b) {
        this.mChars[a] = b
    };
    BitmapFont.prototype.createSprite = function(a, b, l, f, h, g, e, c, d, m) {
        null == f && (f = -1);
        null == e && (e = "center");
        null == c && (c = "center");
        null == d && (d = !0);
        null == m && (m = !0);
        a = this.arrangeChars(a, b, l, f, e, c, d, m, g);
        b = a.length;
        l = new createjs.Container;
        for (f = 0; f < b; f++) g = a[f], e = g._char.createImage(), e.x = g.x + f * h, e.y = g.y, e.scaleX = e.scaleY =
            g.scale, l.addChild(e), g = g._char.getHeight() * g.scale, g > this.textHeight && (this.textHeight = g);
        return l
    };
    BitmapFont.prototype.arrangeChars = function(a, b, l, f, h, g, e, c, d) {
        null == f && (f = -1);
        null == h && (h = "center");
        null == g && (g = "center");
        null == e && (e = !0);
        null == c && (c = !0);
        if (null == l || 0 == l.length) return [];
        0 > f && (f *= -this.mSize);
        for (var m = [
                []
            ], y = !1, k = {}, q = 0, z = 0, p = 0, v = 0; !y;) {
            v = f / this.mSize;
            z = a / v;
            p = b / v;
            m = [];
            m.push([]);
            if (this.mLineHeight <= p)
                for (var x = -1, A = -1, w = 0, r = 0, s = [], q = l.length, n = 0; n < q; ++n) {
                    var B = !1,
                        u = l.charCodeAt(n),
                        t = this.getChar(u);
                    if (u == BitmapFont.CHAR_NEWLINE || u == BitmapFont.CHAR_CARRIAGE_RETURN) B = !0;
                    else if (null == t) console.log("[BitmapFont] Missing character: " + u);
                    else {
                        if (u == BitmapFont.CHAR_SPACE || u == BitmapFont.CHAR_TAB) x = n;
                        c && (w = t.getKerning(A) / 1 + w / 1);
                        k = new CharLocation(t);
                        k._char = t;
                        k.x = w / 1 + t.getXOffset() / 1;
                        k.y = r / 1 + t.getYOffset() / 1;
                        s.push(k);
                        w += t.getXAdvance() / 1;
                        A = u;
                        if (k.x + Number(t.getWidth()) > z) {
                            k = -1 == x ? 1 : n - x;
                            s.splice(s.length - k, k);
                            if (0 == s.length) break;
                            n -= k;
                            B = !0
                        }
                    }
                    if (n == q - 1) m.push(s), y = !0;
                    else if (B)
                        if (m.push(s),
                            x == n && s.pop(), r + 2 * this.mLineHeight <= p) s = [], w = 0, r += this.mLineHeight, A = x = -1;
                        else break
                }
            e && !y ? (f -= 1, m.length = 0) : y = !0
        }
        a = [];
        n = m.length;
        q = r + this.mLineHeight;
        r = 0;
        g == VAlign.BOTTOM ? r = p - q : g == VAlign.CENTER && (r = (p - q) / 2);
        this.previousWidth = [];
        for (g = 0; g < n; ++g)
            if (p = m[g], q = p.length, 0 != q) {
                b = 0;
                k = p[p.length - 1];
                k = k.x - k._char.getXOffset() / 1 + k._char.getXAdvance() / 1;
                h == HAlign.RIGHT ? b = z - k : h == HAlign.CENTER && (b = (z - k) / 2);
                for (l = this.width = 0; l < q; ++l) k = p[l], this.width += k._char.getXAdvance() / 1 + k._char.getXOffset() / 1 + 1, k.x = v * (k.x +
                    b), k.y = v * (k.y + r + (g - 1) * d), k.scale = v, 0 < k._char.getWidth() && 0 < k._char.getHeight() && a.push(k), this.mCharLocationPool.push(k);
                this.previousWidth.push(this.width)
            }
        this.width = this.previousWidth[0];
        for (n = 1; n < this.previousWidth.length; n++) this.previousWidth[n] > this.width && (this.width = this.previousWidth[n]);
        return a
    };
    BitmapFont.prototype.getName = function() {
        return this.mName
    };
    BitmapFont.prototype.getSize = function() {
        return this.mSize
    };
    BitmapFont.prototype.getLineHeight = function() {
        return this.mLineHeight
    };
    BitmapFont.prototype.setLineHeight =
        function(a) {
            this.mLineHeight = a
        };
    BitmapFont.prototype.getBaseLine = function() {
        return this.mBaseLine
    };
    BitmapFont.prototype.getWidth = function() {
        return this.width
    };
    BitmapFont.prototype.getHeight = function() {
        return this.textHeight
    };
    d.BitmapFont = BitmapFont
})(window);
(function(d) {
    BitmapTextField = function(a, b, l, f, h, g, e, c, d, m) {
        this.font = null;
        null == g && (g = 1);
        null == e && (e = 1);
        null == c && (c = "center");
        null == d && (d = "center");
        null == m && (m = !0);
        this.hAlign = c;
        this.vAlign = d;
        this.autoScale = m;
        this.color = "";
        this.initialize(a, b, l, f, h, g, e, c, d, m);
        this.containerWidth = a;
        this.containerHeight = b;
        this.fontSize = h;
        this.horizantalLetterSpacing = g;
        this.verticalLetterSpacing = e
    };
    BitmapTextField.bitmapFonts = [];
    d = BitmapTextField.prototype = new createjs.Container;
    d.BitmapTextField_initialize = d.initialize;
    d.initialize = function(a, b, d, f, h, g, e, c, C, m) {
        d = String(d);
        this.BitmapTextField_initialize();
        this.border = new createjs.Shape;
        this.border.graphics.setStrokeStyle(1);
        this.border.graphics.beginStroke(createjs.Graphics.getRGB(255, 0, 0));
        this.border.graphics.drawRect(0, 0, a, b);
        this.addChild(this.border);
        this.border.visible = !1;
        this.textContainer = new createjs.Container;
        this.addChild(this.textContainer);
        BitmapTextField.bitmapFonts[f] ? (this.font = BitmapTextField.bitmapFonts[f], a = this.font.createSprite(a, b, d, h, g, e,
            c, C, m, !0), this.actualWidth = this.font.getWidth(), this.textContainer.addChild(a)) : console.log("BitmapTextField: Font is not registered " + f)
    };
    d.setText = function(a) {
        a = String(a);
        this.textContainer.uncache();
        this.textContainer.removeAllChildren();
        a = this.font.createSprite(this.containerWidth, this.containerHeight, a, this.fontSize, this.horizantalLetterSpacing, this.verticalLetterSpacing, this.hAlign, this.vAlign, this.autoScale, !0);
        this.textContainer.addChild(a);
        "" != this.color && this.setColor(this.color);
        this.actualWidth =
            this.font.getWidth()
    };
    d.getWidth = function() {
        return this.containerWidth
    };
    d.getHeight = function() {
        return this.containerHeight
    };
    d.getActualWidth = function() {
        return this.actualWidth
    };
    d.showBorder = function(a) {
        null == a && (a = !0);
        this.border.visible = a
    };
    d.setColor = function(a) {
        function b(a) {
            return "#" == a.charAt(0) ? a.substring(1, 7) : a
        }
        var d = parseInt(b(a).substring(0, 2), 16),
            f = parseInt(b(a).substring(2, 4), 16),
            h = parseInt(b(a).substring(4, 6), 16);
        a != this.color && (this.colorFilter = new createjs.ColorFilter(0, 0, 0, 1, d, f, h,
            0));
        this.textContainer.filters = [this.colorFilter];
        this.textContainer.cache(0, 0, this.containerWidth, this.containerHeight);
        this.color = a
    };
    BitmapTextField.registerBitmapFont = function(a, b) {
        if (null == BitmapTextField.bitmapFonts[b]) return BitmapTextField.bitmapFonts[b] = a, b;
        console.log(b + " : is already registered")
    }
})(window);
(function(d) {
    CharLocation = function(a) {
        this._char = a;
        this._char = null;
        this.y = this.x = this.scale = 0
    };
    d.CharLocation = CharLocation
})(window);
(function(d) {
    HAlign = function() {};
    HAlign.CENTER = "center";
    HAlign.LEFT = "left";
    HAlign.RIGHT = "right";
    d.HAlign = HAlign
})(window);
(function(d) {
    VAlign = function() {};
    VAlign.BOTTOM = "bottom";
    VAlign.TOP = "top";
    VAlign.CENTER = "center";
    d.VAlign = VAlign
})(window);