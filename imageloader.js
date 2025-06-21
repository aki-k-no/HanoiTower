pole_image = null;
ring_images = null;

function load_images(list) {
    async function load(src) {
        const image = new Image();
        image.src = src;
        await image.decode();
        return image;
    }
    return Promise.all(list.map(src => load(src)));
}

async function load() {
    ring_images = await load_images(["images/ring1.png", "images/ring2.png", "images/ring3.png", "images/ring4.png", "images/ring5.png"]);
    pole_image = await load_images(["images/pole.png", "images/pole_base.png"]);
    update();
}
load();
