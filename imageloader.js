pole_image = null;
pole_image_gray = null;
ring_images_flont = null;
ring_images_back = null;
ring_images_flont_gray = null;
ring_images_back_gray = null;
cannot_image = null;
cursors = null;
reset_image = null;
clear_image = null;

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
    cursors = await load_images(["images/cursor_neutral.png", "images/cursor_hover.png"]);
    ring_images_flont = await load_images(["images/ring1_flont.png", "images/ring2_flont.png", "images/ring3_flont.png", "images/ring4_flont.png", "images/ring5_flont.png"]);
    ring_images_back = await load_images(["images/ring1_back.png", "images/ring2_back.png", "images/ring3_back.png", "images/ring4_back.png", "images/ring5_back.png"]);
    pole_image = await load_images(["images/pole.png", "images/pole_base.png"]);
    ring_images_flont_gray = await load_images(["images/ring1_flont_gray.png", "images/ring2_flont_gray.png", "images/ring3_flont_gray.png", "images/ring4_flont_gray.png", "images/ring5_flont_gray.png"]);
    ring_images_back_gray = await load_images(["images/ring1_back_gray.png", "images/ring2_back_gray.png", "images/ring3_back_gray.png", "images/ring4_back_gray.png", "images/ring5_back_gray.png"]);
    pole_image_gray = await load_images(["images/pole_gray.png", "images/pole_base_gray.png"]);
    cannot_image = await load_images(["images/cannot.png"]);
    cannot_image = cannot_image[0];
    reset_image = await load_images(["images/reset.png", "images/reset_confirm.png", "images/reset_ok.png", "images/reset_ng.png"]);
    clear_image = await load_images(["images/clear.png"]);
    update();
}
load();
