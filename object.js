
//ハノイの塔の各輪っかを表現するobject
class Ring {

    constructor(size, color) {
        this.size = size;
        this.color = color;
        this.isSelected = false;
    }

    //中心座標をもらって表示する
    show(x, y, canvas, realWidth, realHeight) {
        canvas.fillStyle = this.color;
        if (ring_images == null) {
            return;
        }
        canvas.drawImage(ring_images[this.size - 1], x - realWidth * 0.15, y, realWidth * 0.3, realHeight * 0.3);
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

    //表示させる
    show(x, y, canvas, realHeight, realWidth) {
        //棒を表示する(仮)
        canvas.fillStyle = "Black";
        if (pole_image == null) { return; }
        // 床
        canvas.drawImage(pole_image[1], x - realWidth * 0.15, y - realHeight * 0.08, realWidth * 0.3, realHeight * 0.3);
        // 棒
        canvas.drawImage(pole_image[0], x - realWidth * 0.15, y - realHeight * 0.24, realWidth * 0.3, realHeight * 0.3);
        for (var i = 0; i < this.rings.length; i++) {
            this.rings[i].show(x, y - realHeight * (i * 0.045 + 0.1), canvas, realWidth, realHeight);
        }
    }

}

class ScreenContext {
    width;
    height;

    realWidth;
    realHeight;

    //棒一覧
    poles = [];
    // マウスが掴んでる輪っかのインスタンス
    ring_in_mouce = null;
    //最後に掴んでる輪っかがいた棒
    last_pole = 0;

    //canvas取得
    canvas = document.getElementById("screen").getContext('2d');
    constructor() {

        // ポールを3本召喚
        this.poles.push(new Pole(0));
        this.poles.push(new Pole(1));
        this.poles.push(new Pole(2));

        //輪っかをn個召喚
        for (var i = ring_num - 1; i >= 0; i--) {
            this.poles[0].push(new Ring(i + 1, "blue"))
        }
    }

    onResize(width, height) {
        this.width = width;
        this.height = height;
        // width : heightが4:3を維持するように片方を制限
        var basis = Math.min(width / 4, height / 3);
        //使用する領域
        this.realWidth = basis * 4;
        this.realHeight = basis * 3;
    }

    show() {

        for (var i = 0; i < this.poles.length; i++) {
            this.poles[i].show(this.realWidth * (0.25 + i * 0.25), this.realHeight * 0.8, this.canvas, this.realHeight, this.realWidth);
        }
    }

}
