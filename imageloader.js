pole_image = null;
ring_images = null;
ring_images_flont = null;
ring_images_back = null;

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
    ring_images_flont = await load_images(["images/ring1_flont.png", "images/ring2_flont.png", "images/ring3_flont.png", "images/ring4_flont.png", "images/ring5_flont.png"]);
    ring_images_back = await load_images(["images/ring1_back.png", "images/ring2_back.png", "images/ring3_back.png", "images/ring4_back.png", "images/ring5_back.png"]);
    pole_image = await load_images(["images/pole.png", "images/pole_base.png"]);
    update();
}
load();
