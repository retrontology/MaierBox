function uploadSuccess(request){
    console.log(request.responseText);
}

function uploadError(request){
    console.log(request.responseText);
}

function uploadImage(image) {
    const request = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("csrfmiddlewaretoken", getCSRF());
    request.open("POST", '/images/upload', true);
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            if (request.status === 200)
                uploadSuccess(request);
            else
                uploadError(request);
        }
        
    };
    request.send(formData);
}

function createObjectURL(object) {
    return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
}

function revokeObjectURL(url) {
    return (window.URL) ? window.URL.revokeObjectURL(url) : window.webkitURL.revokeObjectURL(url);
}

class CategorySelect {
    constructor(image_upload_form) {

    }
}

class TagSelect {
    constructor(image_upload_form) {
        
    }
}

class DropZone {
    constructor(image_upload_form) {

        // Init class variables
        this.parent = image_upload_form;
        this.root = image_upload_form.root;

        // Init images
        this.files = [];
        this.images = [];

        // Create drop zone container
        this.drop_zone_container = document.createElement('div');
        this.drop_zone_container.classList.add('drop_zone_container');
        this.root.appendChild(this.drop_zone_container);

        // Create drop zone
        this.drop_zone = document.createElement('div');
        this.drop_zone.classList.add('drop_zone_left', 'drop_zone');
        this.drop_zone.addEventListener('drop', (event) => this.imagesDropped(event));
        this.drop_zone.addEventListener('dragover', (event) => this.imagesDrugOver(event));
        this.drop_zone.addEventListener('dragenter', (event) => this.imagesDragEnter(event));
        this.drop_zone.addEventListener('dragleave', (event) => this.imagesDragLeave(event));
        this.drop_zone_container.appendChild(this.drop_zone);

        // Create button container
        this.button_container = document.createElement('div');
        this.button_container.classList.add('drop_zone_button_container');
        this.drop_zone_container.appendChild(this.button_container);

        // Create hidden file input
        this.files_input = document.createElement('input');
        this.files_input.classList.add('drop_zone_files');
        this.files_input.type = 'file';
        this.files_input.multiple = true;
        this.files_input.addEventListener('change', (event) => this.imagesChanged(event));
        this.button_container.appendChild(this.files_input);

        // Create the image select button
        this.select_button = document.createElement('button');
        this.select_button.classList.add('drop_zone_select');
        this.select_button.addEventListener('click', (event) => this.selectImages(event));
        this.select_button.textContent = 'Select Images';
        this.button_container.appendChild(this.select_button);

        // Create the submit button
        this.submit_button = document.createElement('button');
        this.submit_button.classList.add('drop_zone_submit');
        this.submit_button.addEventListener('click', (event) => this.uploadImages(event));
        this.submit_button.textContent = 'Submit';
        this.submit_button.disabled = true;
        this.button_container.appendChild(this.submit_button);
    }

    // Upload all images in the form
    uploadImages(event) {
        for (let i = 0; i < this.files.length; i++) {
            uploadImage(this.files[i]);
        }
        this.resetForm();
    }

    // Reset the images of the form
    resetImages() {
        this.files = [];
        this.images = [];
        if (this.images_container != null)
            this.images_container.remove();
    }
    
    // Reset the entire form
    resetForm() {
        this.resetImages();
        this.files_input.value = null;
        this.submit_button.disabled = true;
    }

    // Populate the images container with selected images
    populateImages(images) {
        this.resetImages();
        this.images_container = document.createElement('div');
        this.images_container.classList.add('drop_zone_images_container');
        for (let i = 0; i < images.length; i++) {
            let image = images[i];
            this.files.push(image);
            let image_container = document.createElement('div');
            image_container.classList.add('drop_zone_image_container');
            image_container.dataset['index'] = i;
            image_container.addEventListener('click', (event) => this.imageClicked(event));
            image_container.addEventListener('dragstart', (event) => event.preventDefault());
            let img = document.createElement('img');
            img.classList.add('drop_zone_image');
            img.loading = 'lazy';
            image_container.appendChild(img);
            img.src = createObjectURL(image);
            let delete_button = document.createElement('div');
            delete_button.classList.add('drop_zone_image_delete');
            delete_button.addEventListener('click', (event) => this.removeImage(event));
            delete_button.textContent = '❌';
            image_container.appendChild(delete_button);
            this.images_container.appendChild(image_container);
            this.images.push(image_container);
        }
        this.drop_zone.appendChild(this.images_container);
        this.submit_button.disabled = false;
    }

    // Remove image from form at index
    removeImage(event) {
        let index = event.target.parentElement.dataset['index']
        if (this.images[index].classList.contains('drop_zone_image_selected')) {
            this.images[index].classList.remove('drop_zone_image_selected');
            this.selected = null;
            if (this.parent.sidebar != null)
                this.parent.sidebar.remove();
        }
        this.images[index].remove();
        this.images.splice(index,1);
        this.files.splice(index,1);
        for (let i = 0; i < this.images.length; i++) {
            this.images[i].dataset['index'] = i;
            if (this.images[i].classList.contains('drop_zone_image_selected'))
                this.selected = i;
        }
        if (this.images.length == 0)
            this.resetForm();
    }
    
    // Event callback for clicking the "Select Images" button
    selectImages(event) {
        this.files_input.click();
    }

    // Event callback for clicking on an image
    imageClicked(event) {
        if (event.target.classList.contains('drop_zone_image_delete'))
            return;
        let target = (event.target.tagName == 'IMG') ? event.target.parentElement : event.target;
        if (this.parent.sidebar != null)
            this.parent.sidebar.remove();
        if (target.classList.contains('drop_zone_image_selected')) {
            this.selected = null;
            target.classList.remove('drop_zone_image_selected');
        }
        else {
            this.selected = target.dataset['index'];
            this.parent.sidebar = new ImageUploadSidebar(this.parent, target);
            for (let i = 0; i < this.images.length; i++) {
                let image = this.images[i];
                image.classList.remove('drop_zone_image_selected');
            }
            target.classList.add('drop_zone_image_selected');
        }
    }
    
    // Event callback for when the images are selected by the "Select Images" button
    imagesChanged(event) {
        this.resetImages();
        this.populateImages(event.target.files);
    }
    
    // Event callback for when files are drug over the drop zone
    imagesDrugOver(event) {
        event.preventDefault();
    }
    
    // Event callback for when files being drug enter the drop zone
    imagesDragEnter(event) {
        event.preventDefault();
        event.target.classList.add("drop_zone_entered");
        event.target.classList.remove("drop_zone_left")
    }
    
    // Event callback for when files being drug leave the drop zone
    imagesDragLeave(event) {
        event.preventDefault();
        event.target.classList.add("drop_zone_left");
        event.target.classList.remove("drop_zone_entered");
    }
    
    // Event callback for when files are dropped on the drop zone
    imagesDropped(event) {
        event.preventDefault();
        this.resetForm();
        this.populateImages(event.dataTransfer.files);
        this.imagesDragLeave(event);
    }
}

class ImageUploadSidebar {
    constructor(image_upload_form) {

        // Init class variables
        this.parent = image_upload_form;
        this.image = this.parent.drop_zone.images[this.parent.drop_zone.selected];
        this.parent.sidebar = this;

        // Build sidebar
        this.sidebar_container = document.createElement('div');
        this.sidebar_container.classList.add('drop_zone_sidebar_container');
        this.parent.root.appendChild(this.sidebar_container);

        this.sidebar = document.createElement('div');
        this.sidebar.classList.add('drop_zone_sidebar');
        this.sidebar_container.appendChild(this.sidebar);
    }

    remove() {
        this.parent.sidebar = null;
        this.sidebar_container.remove();
    }
}

class ImageUploadForm {
    constructor(root) {
        // Get root element
        this.root = document.getElementById(root);
        this.root.classList.add('drop_zone_root');

        // Init DropZone
        this.drop_zone = new DropZone(this);

        // Init sidebar
        this.sidebar = null;
    }
}
