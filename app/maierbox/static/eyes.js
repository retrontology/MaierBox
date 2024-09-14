class Eye {
    constructor(base) {
        this.closed = false;
        this.fucked = false;

        this.base = base;
        this.eye = document.createElement('div');
        this.lids = document.createElement('div');
        this.lid_top = document.createElement('div');
        this.lid_bottom = document.createElement('div');
        this.iris = document.createElement('div');
        this.pupil = document.createElement('div');

        this.eye.classList.add('eye');
        this.lids.classList.add('lids');
        this.lid_top.classList.add('lid', 'lid_top_open');
        this.lid_bottom.classList.add('lid', 'lid_bottom_open');
        this.iris.classList.add('iris');
        this.pupil.classList.add('pupil');

        this.base.appendChild(this.eye);
        this.eye.appendChild(this.lids);
        this.lids.appendChild(this.lid_top);
        this.lids.appendChild(this.lid_bottom);
        this.eye.appendChild(this.iris);
        this.iris.appendChild(this.pupil);

        this.eye.addEventListener('mousedown', (event) => this.onMouseDown(event));
    }

    lookAt(x, y) {
        // Get position and size of the eye
        let pos = this.eye.getBoundingClientRect();
        let size = pos.height/2;
        let aspectRatio = pos.width / pos.height;

        // Calculate the center coordinates of the eye
        let center_x = (pos.left + pos.right) / 2;
        let center_y = (pos.top + pos.bottom) / 2;

        // Calculate how far away the cursor is from the eye and scale according to window size
        let distance = Math.sqrt(Math.pow(x-center_x, 2) + Math.pow(y-center_y, 2));
        let smallest = (this.base.clientWidth/2 > this.base.clientHeight) ? this.base.clientHeight : this.base.clientWidth/2;
        let scale = (distance < smallest) ? Math.abs(distance/smallest) : 1;

        // Calculate the angle at which the cursor is positioned relative to the eye
        let angle = Math.atan((y-center_y)/(x-center_x));

        // Change the position of the irises
        let polarity = x-center_x;
        polarity = Math.abs(polarity)/polarity;

        if (this.fucked) {
            polarity =  polarity * -1;
            scale = 1;
        }
        
        let look_x = Math.cos(angle) * polarity * scale * size;
        let look_y = Math.sin(angle) * polarity * scale * size;
        this.iris.style.left = look_x;
        this.iris.style.top = look_y;
    }

    onMouseDown(event) {
        this.fucked = true;
        this.eye.style.backgroundImage = 'url("/static/veins.jpg")'
        this.iris.style.background = 'rgb(86, 22, 22)'
        var audio = new Audio('/static/scream.mp3');
        audio.play();
        this.lookAt(event.clientX, event.clientY);
    }

    close() {
        if (!this.fucked) {
            this.lid_top.classList.remove('lid_top_open');
            this.lid_bottom.classList.remove('lid_bottom_open');
            this.lid_top.classList.add('lid_top_closed');
            this.lid_bottom.classList.add('lid_bottom_closed');
            this.closed = true;
        }
    }

    open() {
        this.lid_top.classList.remove('lid_top_closed');
        this.lid_bottom.classList.remove('lid_bottom_closed');
        this.lid_top.classList.add('lid_top_open');
        this.lid_bottom.classList.add('lid_bottom_open');
        this.closed = false;
    }

    onTransitionEnd(event) {
        if (this.closed)
            this.open();
    }
}

class Eyes {

    constructor() {
        this.base = document.createElement('div');
        this.left_eye = new Eye(this.base);
        this.right_eye = new Eye(this.base);

        this.base.classList.add('base');

        document.body.appendChild(this.base);

        this.base.addEventListener("mousemove", (event) => this.onMouseMove(event));
        this.base.addEventListener("mousedown", (event) => this.onMouseDown(event));
        this.base.addEventListener("mouseup", (event) => this.onMouseUp(event));
    }

    // Adjust margins of irises according to position of mouse and eyes
    onMouseMove(event) {
        this.left_eye.lookAt(event.clientX, event.clientY);
        this.right_eye.lookAt(event.clientX, event.clientY);
    }

    onMouseDown(event) {
        this.left_eye.close();
        this.right_eye.close();
    }

    onMouseUp(event) {
        this.left_eye.open();
        this.right_eye.open();
    }

}
