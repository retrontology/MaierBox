class LightBoxImage {
    constructor(id, index) {

        this.index = index;
        this.id = id;

        this.thumbnail = `/media/images/thumbnail/${id}.jpg`;
        this.scaled = `/media/images/scaled/${id}.jpg`;
        this.full = `/media/images/full/${id}.jpg`;
        this.page = `/images/view/${id}`;

        this.container = document.createElement('div');
        this.container.classList.add('lightbox_gallery_image_container');

        this.img = document.createElement('img');
        this.img.src = this.thumbnail;
        this.img.loading = 'lazy';
        this.img.classList.add('lightbox_gallery_image');
        this.container.appendChild(this.img);
    }
}

class SwipeEvent {

    static THRESHOLD = 50;

    static RIGHT = 'right';
    static LEFT = 'left';
    static UP = 'up';
    static DOWN = 'down';

    constructor(event) {
        this.direction = null;
        this.start_event = event;
    }

    endSwipe(event) {
        this.end_event = event;

        let start = this.start_event.changedTouches[0];
        let end = this.end_event.changedTouches[0];

        if (!start || !end) { return; }

        let d_x = start.screenX - end.screenX;
        let d_y = start.screenY - end.screenY;
        let abs_x = Math.abs(d_x);
        let abs_y = Math.abs(d_y);

        let biggest = abs_x > abs_y ? abs_x : abs_y;
        if (biggest <= SwipeEvent.THRESHOLD) { return; }
        
        if (abs_x > abs_y) {
            if (d_x > 0) {
                this.direction = SwipeEvent.LEFT;
            }
            else {
                this.direction = SwipeEvent.RIGHT;
            }
        }
        else {
            if (d_y > 0) {
                this.direction = SwipeEvent.UP;
            }
            else {
                this.direction = SwipeEvent.DOWN;
            }
        }

        return this.direction;
    }
}

class LightBox {
    constructor() {
        this.index = 0;
        this.swipe_event = null;
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
        document.addEventListener('keydown', (event) => {
            if (this.base.style.display != 'none') {
                switch (event.key) {
                    case 'ArrowRight':
                        this.next();
                        break;
                    case 'ArrowLeft':
                        this.previous();
                        break;
                }
            }
        })
        this.base.appendChild(this.container);

        this.main_container = document.createElement('div');
        this.main_container.classList.add('lightbox_main_container');
        this.main_container.addEventListener('touchstart', (event) => this.startSwipe(event));
        this.main_container.addEventListener('touchend', (event) => this.endSwipe(event));
        this.container.appendChild(this.main_container);

        this.previous_container = document.createElement('div');
        this.previous_container.classList.add('lightbox_button_container');
        this.main_container.appendChild(this.previous_container);

        this.previous_button = document.createElement('button');
        this.previous_button.classList.add('lightbox_button', 'lightbox_button_previous');
        this.previous_button.textContent = '◀';
        this.previous_button.onclick = (event) => {this.previous()};
        this.previous_container.appendChild(this.previous_button);

        this.image_container = document.createElement('div');
        this.image_container.classList.add('lightbox_image_container');
        this.main_container.appendChild(this.image_container);

        this.img = document.createElement('img');
        this.img.classList.add('lightbox_image');
        this.image_container.appendChild(this.img);

        this.next_container = document.createElement('div');
        this.next_container.classList.add('lightbox_button_container');
        this.main_container.appendChild(this.next_container);

        this.next_button = document.createElement('button');
        this.next_button.classList.add('lightbox_button', 'lightbox_button_next');
        this.next_button.textContent = '▶';
        this.next_button.onclick = (event) => {this.next()};
        this.next_container.appendChild(this.next_button);

        this.gallery_container = document.createElement('div');
        this.gallery_container.classList.add('lightbox_gallery_container');
        this.container.appendChild(this.gallery_container);

        this.gallery = document.createElement('div');
        this.gallery.classList.add('lightbox_gallery');
        this.gallery_container.appendChild(this.gallery);
    }

    clearImages() {
        this.images = [];
        while (this.gallery.lastChild) {
            this.gallery.removeChild(this.gallery.lastChild);
        }
    }

    populateImages() {
        this.clearImages();
        this.images_container = document.getElementsByClassName('album_images_container')[0];
        for(let i = 0; i < this.images_container.childElementCount; i++) {
            let image_container = this.images_container.children[i];
            image_container.addEventListener('click', (event) => {
                event.preventDefault();
                this.select(i);
            });
            let image = new LightBoxImage(image_container.firstElementChild.firstElementChild.alt, i);
            image.container.addEventListener('click', (event) => {
                event.preventDefault();
                this.select(i);
            });
            this.images.push(image);
            this.gallery.appendChild(image.container);
        }
    }

    select(index) {
        this.img.src = '/static/loading.svg';
        this.images[this.index].img.classList.remove('lightbox_gallery_image_selected');
        this.index = index;
        this.images[this.index].img.classList.add('lightbox_gallery_image_selected');
        this.img.src = this.images[index].scaled;
        this.img.onclick = (event) => {
            event.preventDefault();
            window.open(this.images[index].page).focus();
        }
        this.show();
        this.images[index].container.scrollIntoView({ behavior: "smooth", inline: "center" });
        
    }

    show() {
        this.base.style.display = 'flex';
        this.base.style.opacity = 1;
        document.body.style.overflow = 'hidden';
    }

    hide() {
        this.base.style.display = 'none';
        this.base.style.opacity = 0;
        document.body.style.overflow = 'auto';
    }

    next() {
        if (this.index != this.images.length - 1) {
            this.select(this.index+1)
        }
    }

    previous() {
        if (this.index > 0) {
            this.select(this.index-1)
        }
    }

    startSwipe(event) {
        this.swipe_event = new SwipeEvent(event);
    }

    endSwipe(event) {
        if (!this.swipe_event){ return; }

        let direction = this.swipe_event.endSwipe(event)
        switch(direction) {
            case SwipeEvent.RIGHT:
              this.previous();
              break;
            case SwipeEvent.LEFT:
              this.next();
              break;
        }

        this.swipe_event = null;
    }
}
