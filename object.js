
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
        if (x <= baseX - realWidth * (0.04 + this.size * 0.012) || x >= baseX + realWidth * (0.04 + this.size * 0.012) || y <= baseY || y >= baseY + realHeight * 0.1) {
            return null;
        }
        return this;
    }

    //中心座標をもらって表示する
    show(x, y, canvas, realWidth, realHeight) {
        canvas.fillStyle = this.color;
        if (ring_images == null) {
            return;
        }
        canvas.drawImage(ring_images[this.size - 1], x - realWidth * 0.15, y, realWidth * 0.3, realHeight * 0.45);
    }

    //中心座標をもらって表示する
    show_flont(x, y, canvas, realWidth, realHeight) {
        canvas.fillStyle = this.color;
        if (ring_images_flont == null) {
            return;
        }
        var m = this.isHovered ? 1.2 : 1;
        var m2 = this.isHovered ? realWidth * 0.02 : 0;
        canvas.drawImage(ring_images_flont[this.size - 1], x - realWidth * 0.15 * m, y - m2, realWidth * 0.3 * m, realHeight * 0.45 * m);
    }
    show_back(x, y, canvas, realWidth, realHeight) {
        canvas.fillStyle = this.color;
        if (ring_images_back == null) {
            return;
        }
        var m = this.isHovered ? 1.2 : 1;
        var m2 = this.isHovered ? realWidth * 0.02 : 0;
        canvas.drawImage(ring_images_back[this.size - 1], x - realWidth * 0.15 * m, y - m2, realWidth * 0.3 * m, realHeight * 0.45 * m);
    }


}

//ハノイの塔の棒を表現するobject
class Pole {
    position;
    //輪っか一覧
    rings;
    constructor(position) {
        this.position = position;
        this.rings = [];
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
            var collidedRing = this.rings[this.rings.length - 1].collide(x, y, baseX, baseY + realHeight * ((0 - this.rings.length) * 0.067 + 0.45), realWidth, realHeight);
            return collidedRing;
        }
        return null;

    }

    //表示させる
    show(canvas, realHeight, realWidth) {
        let x = realWidth * 0.25 * (1 + this.position);
        let y = realHeight * 0.44;
        //棒を表示する(仮)
        canvas.fillStyle = "Black";
        if (pole_image == null) { return; }
        // 床
        canvas.drawImage(pole_image[1], x - realWidth * 0.15, y + realHeight * 0.24, realWidth * 0.3, realHeight * 0.45);
        for (var i = 0; i < this.rings.length; i++) {
            if (this.rings.length <= i) {
                break;
            }
            this.rings[i].show_back(x, y - realHeight * (i * 0.067 - 0.2), canvas, realWidth, realHeight);
        }
        // 棒
        canvas.drawImage(pole_image[0], x - realWidth * 0.15, y, realWidth * 0.3, realHeight * 0.45);

        for (var i = 0; i < this.rings.length; i++) {
            if (this.rings.length <= i) {
                break;
            }
            this.rings[i].show_flont(x, y - realHeight * (i * 0.067 - 0.2), canvas, realWidth, realHeight);
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
    ctx = this.canvas.getContext('2d');
    constructor() {

        // ポールを3本召喚
        for (var i = 0; i < 3; i++) {
            this.poles.push(new Pole(i));
        }
        //輪っかをn個召喚
        for (var i = ring_num - 1; i >= 0; i--) {
            this.poles[0].push(new Ring(i + 1, "blue"))
        }


    }

    collide(event) {
        this.mouseX = event.layerX;
        this.mouseY = event.layerY;
        //何か掴んでるなら無視
        if (this.ring_in_mouce != null) {
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
    }

    catchObject(event) {
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

    }

    releaseObject(event) {
        if (this.ring_in_mouce == null) {
            return;
        }
        this.ring_in_mouce.isHovered = false;
        this.ring_in_mouce.isSelected = false;
        let done = false;
        for (var i = 0; i < 3; i++) {
            console.log(this.poles[i].collideOnlyWithPole(event), event.layerX, event.layerY);
            if (this.poles[i].collideOnlyWithPole(event.layerX, event.layerY, this.realWidth, this.realHeight) != null) {
                this.poles[i].push(this.ring_in_mouce);
                done = true;
                break;
            }
        }
        if (!done) {
            this.poles[this.last_pole].push(this.ring_in_mouce);

        }
        this.last_pole = 0;
        this.ring_in_mouce = null;
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

    show() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        //棒表示
        for (var i = 0; i < this.poles.length; i++) {
            this.poles[i].show(this.ctx, this.realHeight, this.realWidth);
        }

        //掴んでるring表示
        if (this.ring_in_mouce != null) {
            this.ring_in_mouce.show_back(this.mouseX, this.mouseY - this.realHeight * 0.26, this.ctx, this.realWidth, this.realHeight);
            this.ring_in_mouce.show_flont(this.mouseX, this.mouseY - this.realHeight * 0.26, this.ctx, this.realWidth, this.realHeight);

        }



    }

}
