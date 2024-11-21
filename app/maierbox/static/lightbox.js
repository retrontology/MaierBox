class LightBoxImage {
    constructor(id) {
        this.id = id;
        this.thumbnail = `/media/images/thumbnail/${id}.jpg`;
        this.scaled = `/media/images/scaled/${id}.jpg`;
        this.full = `/media/images/full/${id}.jpg`;
    }
}

class LightBox {
    constructor() {
        this.index = 0;
        this.buildModal();
        this.populateImages();
    }

    buildModal() {
        this.base = document.createElement('div');
        this.base.classList.add('lightbox_base');
        document.body.appendChild(this.base);

        this.background = document.createElement('div');
        this.background.classList.add('lightbox_background');
        this.background.addEventListener('click', (event) => {event.preventDefault(); this.hide()});
        this.base.appendChild(this.background);

        this.container = document.createElement('div');
        this.container.classList.add('lightbox_container');
        this.base.appendChild(this.container);

        this.image_container = document.createElement('div');
        this.image_container.classList.add('lightbox_image_container');
        this.container.appendChild(this.image_container);

        this.gallery_container = document.createElement('div');
        this.gallery_container.classList.add('lightbox_gallery_container');
        this.base.appendChild(this.gallery_container);
    }

    populateImages() {
        this.images_container = document.getElementsByClassName('album_images_container')[0];
        this.images = [];
        for(let i = 0; i < this.images_container.childElementCount; i++) {
            let image_container = this.images_container.children[i];
            image_container.addEventListener('click', (event) => {
                event.preventDefault();
                this.select(i);
            });
            let image = new LightBoxImage(image_container.firstElementChild.firstElementChild.alt);
            this.images.push(image);
        }
    }

    select(index) {
        this.show();
    }

    show() {
        this.base.style.display = 'flex';
    }

    hide() {
        this.base.style.display = 'none';
    }
}