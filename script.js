//グローバル変数ゾーン

context = null;
ring_num = 5;


// =======================================================================



// ここから本実装

//初期化関数
function init() {

    context = new ScreenContext();

    context.show();

}

//更新関数
function update() {
    context.show();
}

// windowサイズが変更されたときに自動でcanvasをリサイズする関数
function resize() {
    var height = window.innerHeight;
    var width = window.innerWidth;
    var canvas = document.getElementById("screen");
    canvas.height = height - 80;
    canvas.width = width - 80;
    context.onResize(width - 80, height - 80);
    update();
}

window.onresize = resize;

window.onload = function () {
    init();
    resize();
    update();
}