
//ハノイの塔の各輪っかを表現するobject
class Ring {

    constructor(size, color) {
        this.size = size;
        this.color = color;
        this.isSelected = false;
        this.isHovered = false;
    }

    //衝突判定をする
    collide(x, y, baseX, baseY, realWidth, realHeight) {
        // 輪っかを掴めない場合
        if (x <= baseX - realWidth * (0.04 + this.size * 0.012) || x >= baseX + realWidth * (0.04 + this.size * 0.012) || y <= baseY || y >= baseY + realHeight * (0.1 + this.size * 0.02)) {
            return null;
        }
        return this;
    }

    //中心座標をもらって表示する
    show(x, y, canvas, realWidth, realHeight, image_list) {
        if (image_list == null) {
            return;
        }
        var m = this.isHovered ? 1.2 : 1;
        var m2 = this.isHovered ? realWidth * 0.02 : 0;
        canvas.drawImage(image_list[this.size - 1], x - realWidth * 0.15 * m, y - m2, realWidth * 0.3 * m, realHeight * 0.45 * m);
    }






}

//ハノイの塔の棒を表現するobject
class Pole {
    position;
    //輪っか一覧
    rings;
    // 最初に使う偽物輪っか
    pseudo_rings;
    constructor(position) {
        this.position = position;
        this.rings = [];
        this.isHovered = false;
        this.isCannot = false;
        this.pseudo_rings = [];
        //偽物の輪っかを召喚
        for (var i = ring_num - 1; i >= 0; i--) {
            this.pseudo_rings.push(new Ring(i + 1, "blue"))
        }
    }

    // 一個取り出す
    pop() {
        //取り出せない時はnullを返す
        if (this.rings.length == 0) {
            return null;
        }
        //頂点を取り出す
        return this.rings.pop();
    }

    //一個覗く
    peek() {
        //取り出せない時はnullを返す
        if (this.rings.length == 0) {
            return null;
        }
        //頂点を取り出す
        return this.rings[this.rings.length - 1];

    }

    // 一個追加する
    push(ring) {
        this.rings.push(ring);
    }

    // pole本体のみと比較
    collideOnlyWithPole(x, y, realWidth, realHeight) {
        let baseX = realWidth * 0.25 * (1 + this.position);
        let baseY = realHeight * 0.44;
        // そもそも棒にも箸にも掛からない場合
        if (x <= baseX - realWidth * 0.12 || x >= baseX + realWidth * 0.12 || y <= baseY || y >= baseY + realHeight * 0.53) {
            return null;
        }
        return this;
    }

    // 当たったring取得
    collide(x, y, realWidth, realHeight) {
        let baseX = realWidth * 0.25 * (1 + this.position);
        let baseY = realHeight * 0.44;
        // そもそも棒にも箸にも掛からない場合
        if (x <= baseX - realWidth * 0.12 || x >= baseX + realWidth * 0.12 || y <= baseY || y >= baseY + realHeight * 0.53) {
            return null;
        }
        // 以下一番上のringに問い合わせ
        if (this.rings.length != 0) {
            var collidedRing = this.rings[this.rings.length - 1].collide(x, y, baseX, baseY + realHeight * ((0 - this.rings.length) * 0.06 + 0.4), realWidth, realHeight);
            return collidedRing;
        }
        return null;

    }
    //該当ringを上に嵌められるか
    canPush(ring) {
        let topSize = 1000;
        if (this.rings.length != 0) {
            topSize = this.rings[this.rings.length - 1].size;
        }
        return topSize > ring.size;
    }

    //表示させる
    show(canvas, realHeight, realWidth, ring) {
        let x = realWidth * 0.25 * (1 + this.position);
        let y = realHeight * 0.44;

        if (pole_image == null) { return; }
        // 床
        let m = this.isHovered ? 1.1 : 1;
        let m2 = this.isHovered ? 1.05 : 1;
        // おける場合はうっすらと表示


        // グレースケールかどうか判定
        if (this.canPutRing(ring)) {
            canvas.drawImage(pole_image[1], x - realWidth * 0.15 * m, y + realHeight * 0.24, realWidth * 0.3 * m, realHeight * 0.45 * m);

        } else {
            canvas.drawImage(pole_image_gray[1], x - realWidth * 0.15 * m, y + realHeight * 0.24, realWidth * 0.3 * m, realHeight * 0.45 * m);

        }
        for (var i = 0; i < this.rings.length; i++) {
            if (this.rings.length <= i) {
                break;
            }
            this.rings[i].show(x, y - realHeight * (i * 0.067 - 0.2), canvas, realWidth, realHeight, this.canPutRing(ring) ? ring_images_back : ring_images_back_gray);

        }
        // 棒
        if (this.canPutRing(ring)) {

            canvas.drawImage(pole_image[0], x - realWidth * 0.15 * m, y, realWidth * 0.3 * m, realHeight * 0.45 * m2);
        } else {
            canvas.drawImage(pole_image_gray[0], x - realWidth * 0.15 * m, y, realWidth * 0.3 * m, realHeight * 0.45 * m2);

        }
        for (var i = 0; i < this.rings.length; i++) {
            if (this.rings.length <= i) {
                break;
            }
            this.rings[i].show(x, y - realHeight * (i * 0.067 - 0.2), canvas, realWidth, realHeight, this.canPutRing(ring) ? ring_images_flont : ring_images_flont_gray);
        }

    }

    showPseudoRing(canvas, realHeight, realWidth) {
        let x = realWidth * 0.25 * (1 + this.position);
        let y = realHeight * 0.44;
        canvas.globalAlpha = 0.3;
        for (var i = 0; i < this.pseudo_rings.length; i++) {
            if (this.pseudo_rings.length <= i) {
                break;
            }
            this.pseudo_rings[i].show(x, y - realHeight * (i * 0.067 - 0.2), canvas, realWidth, realHeight, ring_images_back);
            this.pseudo_rings[i].show(x, y - realHeight * (i * 0.067 - 0.2), canvas, realWidth, realHeight, ring_images_flont);

        }
        canvas.globalAlpha = 1;
    }

    showCannot(canvas, realHeight, realWidth) {
        let x = realWidth * 0.25 * (1 + this.position);
        let y = realHeight * 0.44;
        // おけない場合
        if (this.isCannot) {
            canvas.drawImage(cannot_image, x - realWidth * 0.2, y, realWidth * 0.4, realHeight * 0.4);

        }
    }

    showCan(canvas, realHeight, realWidth, ring) {
        let x = realWidth * (0.25 * (1 + this.position) - 0.12);
        let y = realHeight * 0.42;
        // おける場合
        if (this.rings.length == 0 || (this.rings[this.rings.length - 1].size > ring.size)) {
            canvas.fillStyle = "#DDDDFF";
            canvas.globalAlpha = 0.6;
            canvas.fillRect(x, y, realWidth * 0.24, realHeight * 0.59);
            canvas.globalAlpha = 1;

        }
    }

    canPutRing(ring) {
        if (ring == null) {
            return true;
        }
        if (this.rings.length == 0) {
            return true;
        }
        return this.rings[this.rings.length - 1].size > ring.size;
    }

}

class ResetButton {
    positionX;
    positionY;
    isHovered;
    constructor() {
        this.positionX = 0.6;
        this.positionY = 0.1;
        this.isHovered = false;
    }


    show(realWidth, realHeight, ctx) {
        if (reset_image == null) {
            return;
        }
        let m = this.isHovered ? 1.2 : 1;
        let m2 = this.isHovered ? 0.02 : 0;
        ctx.drawImage(reset_image[0], realWidth * (this.positionX - 0.1 - m2), realHeight * (this.positionY - 0.1 - m2), realWidth * 0.2 * m, realHeight * 0.2 * m);
    }

    //衝突判定
    collide(x, y, realWidth, realHeight) {
        if (x < realWidth * (this.positionX - 0.08) || x > realWidth * (this.positionX + 0.08)
            || y < realHeight * (this.positionY - 0.05) || y > realHeight * (this.positionY + 0.05)) {
            return false;
        }
        return true;
    }

    onClick(ctx) {
        ctx.mode = "reset_confirm";
    }

}

class ResetConfirm {
    positionX = 0.15;
    positionY = 0.1;
    hoveredOK = false;
    hoveredNG = false;

    constructor() {

    }

    show(realWidth, realHeight, ctx) {
        if (reset_image == null) {
            return;
        }
        ctx.drawImage(reset_image[1], realWidth * (this.positionX), realHeight * (this.positionY), realWidth * 0.6, realHeight * 0.6);
        let m = this.hoveredOK ? 1.2 : 1;
        let m2 = this.hoveredOK ? 0.022 : 0;
        ctx.drawImage(reset_image[2], realWidth * (this.positionX + 0.1 - m2), realHeight * (this.positionY + 0.32 - m2), realWidth * 0.2 * m, realHeight * 0.2 * m);
        let m3 = this.hoveredNG ? 1.2 : 1;
        let m4 = this.hoveredNG ? 0.022 : 0;
        ctx.drawImage(reset_image[3], realWidth * (this.positionX + 0.3 - m4), realHeight * (this.positionY + 0.32 - m4), realWidth * 0.2 * m3, realHeight * 0.2 * m3);
    }

    collide(x, y, realWidth, realHeight) {
        this.hoveredOK = false;
        this.hoveredNG = false;
        if (x > realWidth * (this.positionX + 0.12) && x < realWidth * (this.positionX + 0.28)
            && y > realHeight * (this.positionY + 0.34) && y < realHeight * (this.positionY + 0.5)) {
            this.hoveredOK = true;
        } else if (x > realWidth * (this.positionX + 0.32) && x < realWidth * (this.positionX + 0.48)
            && y > realHeight * (this.positionY + 0.34) && y < realHeight * (this.positionY + 0.5)) {
            this.hoveredNG = true;
        }
    }
    onClick(context) {
        if (this.hoveredOK) {
            //リセット処理
            //棒からringを没収する
            let ring_list = [];
            for (var i = 1; i <= 5; i++) {
                for (var j = 0; j < context.poles.length; j++) {
                    let ring = context.poles[j].peek();
                    if (ring != null && ring.size == i) {
                        ring_list.push(context.poles[j].pop());
                    }
                }
            }
            //全部左に寄せる
            for (var i = 4; i >= 0; i--) {
                context.poles[0].push(ring_list[i]);

            }
            context.initialized = true;
            context.mode = "normal";
            context.isClear = false;

        } else if (this.hoveredNG) {
            context.mode = "normal";
        }
    }

}

class ScreenContext {
    width;
    height;

    realWidth;
    realHeight;

    mouseX;
    mouseY;

    //ボタン一覧
    buttons = [];
    //リセット確認
    reset_confirm = null;

    // 現在のモード
    mode = "normal";

    //クリア判定
    isClear = false;

    initialized = true;

    //棒一覧
    poles = [];
    // マウスが掴んでる輪っかのインスタンス
    ring_in_mouce = null;
    //最後にマウスが重なってた輪っかのインスタンス
    last_hovered = null;
    //最後に掴んでる輪っかがいた棒
    last_pole = 0;

    //canvas取得
    canvas = document.getElementById("screen");
    ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    constructor() {

        // ポールを3本召喚
        for (var i = 0; i < 3; i++) {
            this.poles.push(new Pole(i));
        }
        //輪っかをn個召喚
        for (var i = ring_num - 1; i >= 0; i--) {
            this.poles[0].push(new Ring(i + 1, "blue"))
        }

        //ボタン追加
        this.buttons.push(new ResetButton());
        this.reset_confirm = new ResetConfirm();

    }

    collide(event) {
        this.mouseX = event.layerX;
        this.mouseY = event.layerY;
        if (this.mode == "normal") {
            //ポールの当たり判定を消す
            for (var i = 0; i < this.poles.length; i++) {
                this.poles[i].isHovered = false;
                this.poles[i].isCannot = false;
            }
            //何か掴んでるならポールだけと当たり判定を見る
            if (this.ring_in_mouce != null) {
                for (var i = 0; i < this.poles.length; i++) {
                    if (this.poles[i].collideOnlyWithPole(event.layerX, event.layerY, this.realWidth, this.realHeight) != null) {
                        if (this.poles[i].canPush(this.ring_in_mouce)) {
                            this.poles[i].isHovered = true;
                        } else {
                            this.poles[i].isCannot = true;
                        }
                    }
                }
                return;
            }
            //まずはpoleに当たり判定を問い合わせ
            let hitRing = null;
            for (var i = 0; i < this.poles.length; i++) {
                hitRing = this.poles[i].collide(event.layerX, event.layerY, this.realWidth, this.realHeight);
                if (hitRing != null) {
                    break;
                }
            }
            if (this.last_hovered != null) {
                this.last_hovered.isHovered = false;
            }
            this.last_hovered = hitRing;
            if (hitRing != null) {
                hitRing.isHovered = true;
            }

            // その他ボタンに問い合わせ
            for (var i = 0; i < this.buttons.length; i++) {
                this.buttons[i].isHovered = false;
                if (this.buttons[i].collide(event.layerX, event.layerY, this.realWidth, this.realHeight)) {
                    this.buttons[i].isHovered = true;
                    break;
                }
            }
        } else if (this.mode == "reset_confirm") {
            this.reset_confirm.collide(event.layerX, event.layerY, this.realWidth, this.realHeight);
        }

    }

    catchObject(event) {
        if (this.mode == "normal") {
            this.initialized = false;
            //まずはpoleに当たり判定を問い合わせ
            let hitRing = null;
            for (var i = 0; i < this.poles.length; i++) {
                hitRing = this.poles[i].collide(event.layerX, event.layerY, this.realWidth, this.realHeight);
                if (hitRing != null) {
                    // 一個抜く
                    this.poles[i].pop();
                    this.last_pole = i;
                    break;
                }
            }
            if (this.ring_in_mouce != null) {
                this.ring_in_mouce.isHovered = false;
                this.ring_in_mouce.isSelected = false;
            }
            this.ring_in_mouce = hitRing;
            if (hitRing != null) {

                this.ring_in_mouce.isSelected = true;
            }
            // ボタンチェック
            for (var i = 0; i < this.buttons.length; i++) {
                if (this.buttons[i].collide(event.layerX, event.layerY, this.realWidth, this.realHeight)) {
                    this.buttons[i].onClick(this);
                    break;
                }
            }
        } else if (this.mode == "reset_confirm") {
            this.reset_confirm.onClick(this);
        }

    }

    releaseObject(event) {
        if (this.mode == "normal") {

            if (this.ring_in_mouce == null) {
                return;
            }
            this.ring_in_mouce.isHovered = false;
            this.ring_in_mouce.isSelected = false;
            let done = false;
            for (var i = 0; i < 3; i++) {
                if (this.poles[i].collideOnlyWithPole(event.layerX, event.layerY, this.realWidth, this.realHeight) != null) {
                    if (this.poles[i].canPush(this.ring_in_mouce)) {

                        this.poles[i].push(this.ring_in_mouce);
                        done = true;
                        break;
                    }
                }
            }
            if (!done) {
                this.poles[this.last_pole].push(this.ring_in_mouce);

            }
            this.last_pole = 0;
            this.ring_in_mouce = null;

            //クリア判定
            if (this.checkClear()) {
                this.isClear = true;
            } else {
                this.isClear = false;
            }
        }
    }

    //クリアしたかチェック
    checkClear() {
        //3つ目のポールに全部入ってればok
        return this.poles[2].rings.length == 5 || this.poles[1].rings.length == 5;
    }


    onResize(width, height) {
        this.width = width;
        this.height = height;
        // width : heightが2:1を維持するように片方を制限
        var basis = Math.min(width / 2, height / 1);
        //使用する領域
        this.realWidth = basis * 2;
        this.realHeight = basis * 1;
    }

    showMouse() {
        if (cursors != null) {
            let image = cursors[0];
            if (this.last_hovered != null) {
                image = cursors[1];
            }
            this.ctx.drawImage(image, this.mouseX - this.realWidth * 0.02, this.mouseY - this.realHeight * 0.03, this.realWidth * 0.05, this.realHeight * 0.08);
        }
    }

    show() {
        this.ctx.clearRect(0, 0, this.width, this.height);


        //棒表示
        for (var i = 0; i < this.poles.length; i++) {
            if (this.ring_in_mouce != null) {
                this.poles[i].showCan(this.ctx, this.realHeight, this.realWidth, this.ring_in_mouce);
            }
            this.poles[i].show(this.ctx, this.realHeight, this.realWidth, this.ring_in_mouce);
        }

        //初期状態ならうっすらとRingを表示
        if (this.initialized) {
            this.poles[2].showPseudoRing(this.ctx, this.realHeight, this.realWidth);
        }

        //掴んでるring表示
        if (this.ring_in_mouce != null) {
            this.ring_in_mouce.show(this.mouseX, this.mouseY - this.realHeight * 0.26, this.ctx, this.realWidth, this.realHeight, ring_images_back);
            this.ring_in_mouce.show(this.mouseX, this.mouseY - this.realHeight * 0.26, this.ctx, this.realWidth, this.realHeight, ring_images_flont);

        }

        //ボタン表示
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].show(this.realWidth, this.realHeight, this.ctx);
        }

        //クリア表示
        if (this.isClear) {
            this.ctx.drawImage(clear_image[0], this.realWidth * 0.3, this.realHeight * 0.2, this.realWidth * 0.4, this.realHeight * 0.4);
        }
        // リセット確認
        if (this.mode == "reset_confirm") {
            this.ctx.fillStyle = "black";
            this.ctx.globalAlpha = 0.4;
            this.ctx.rect(0, 0, this.realWidth, this.realHeight);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
            this.reset_confirm.show(this.realWidth, this.realHeight, this.ctx);
        }


        //マウスポインター表示
        this.showMouse();


        if (this.mode == "normal") {

            //不可表示
            for (var i = 0; i < this.poles.length; i++) {
                this.poles[i].showCannot(this.ctx, this.realHeight, this.realWidth);
            }
        }



    }

}
