class WatermarkSelect extends InputSelect {
    constructor(parent, image) {
        super(parent, image, 'select', 'watermark', false, '/watermarks/list');
        this.items = watermark_list;
        if (this.items.length == 0)
            this.refresh();
        else
            this.populateOptions();
    }

    addOption(item) {
        let option = document.createElement('option');
        option.textContent = `(${item['id']}) ${item['text']}`;
        option.value = item['id'];
        this.select_list.appendChild(option);
    }

    // Callback for when the watermark select is changed
    onChanged(event) {
        let value = this.select.value;

        if (value == '') {
            delete this.image.watermark;
            return;
        }

        this.image.watermark = value;
    }
}

class DropZoneImage {
    constructor(parent) {
        this.parent = parent;
        this.selected = false;
        this.uploaded = true;

        this.container = document.createElement('div');
        this.container.classList.add('dropzone_image_container');
        this.container.addEventListener('click', (event) => this.imageClicked(event));
        this.container.addEventListener('dragstart', (event) => this.imageDragStart(event));
        this.img = document.createElement('img');
        this.img.classList.add('dropzone_image_image');
        this.img.loading = 'lazy';
        this.img.src = this.url;
        this.container.appendChild(this.img);
        this.remove_button = document.createElement('div');
        this.remove_button.classList.add('dropzone_image_delete');
        this.remove_button.addEventListener('click', (event) => this.removeClicked(event));
        this.remove_button.textContent = '❌';
        this.container.appendChild(this.remove_button);
        this.parent.appendChild(this.container);
    }

    select(event) {
        this.container.classList.add('dropzone_image_selected');
        this.selected = true;
    }

    deselect(event) {
        this.container.classList.remove('dropzone_image_selected');
        this.selected = false;
    }

    toggleSelect(event) {
        if (this.selected)
            this.deselect(event);
        else
            this.select(event);
    }

    imageClicked(event) {
        this.toggleSelect(event);
    }

    imageDragStart(event) {
        event.preventDefault();
    }

    removeClicked(event) {
        this.remove();
    }

    remove() {
        this.container.remove();
    }

    showUploading() {
        this.removeUploaded();
        this.removeFailed();
        this.uploading_container = document.createElement('div');
        this.uploading_container.classList.add('dropzone_image_status_container');
        this.uploading_container.classList.add('dropzone_image_uploading_container');
        this.container.appendChild(this.uploading_container);
        this.uploading_icon = document.createElement('div');
        this.uploading_icon.classList.add('dropzone_image_status_icon');
        this.uploading_icon.classList.add('dropzone_image_uploading_icon');
        this.uploading_icon.textContent = '◠';
        this.uploading_container.appendChild(this.uploading_icon);
    }

    removeUploading() {
        if (this.uploading_container != null) {
            this.uploading_icon.remove();
            delete this.uploading_icon;
            this.uploading_container.remove();
            delete this.uploading_container;
        }
    }

    showUploaded() {
        this.removeUploading();
        this.removeFailed();
        this.uploaded_container = document.createElement('div');
        this.uploaded_container.classList.add('dropzone_image_status_container');
        this.uploaded_container.classList.add('dropzone_image_uploaded_container');
        this.container.appendChild(this.uploaded_container);
        this.uploaded_icon = document.createElement('div');
        this.uploaded_icon.classList.add('dropzone_image_status_icon');
        this.uploaded_icon.classList.add('dropzone_image_uploaded_icon');
        this.uploaded_icon.textContent = '✔';
        this.uploaded_container.appendChild(this.uploaded_icon);
    }

    removeUploaded() {
        if (this.uploaded_container != null) {
            this.uploaded_icon.remove();
            delete this.uploaded_icon;
            this.uploaded_container.remove();
            delete this.uploaded_container;
        }
    }

    showFailed() {
        this.removeUploading();
        this.removeUploaded();
        this.failed_container = document.createElement('div');
        this.failed_container.classList.add('dropzone_image_status_container');
        this.failed_container.classList.add('dropzone_image_failed_container');
        this.container.appendChild(this.failed_container);
        this.failed_icon = document.createElement('div');
        this.failed_icon.classList.add('dropzone_image_status_icon');
        this.failed_icon.classList.add('dropzone_image_failed_icon');
        this.failed_icon.textContent = '❌';
        this.failed_container.appendChild(this.failed_icon);
    }

    removeFailed() {
        if (this.failed_container != null) {
            this.failed_icon.remove();
            delete this.failed_icon;
            this.failed_container.remove();
            delete this.failed_container;
        }
    }
}

class PendingImage extends DropZoneImage {

    constructor(parent, image) {
        super(parent);
        this.image = image;
        this.url = createObjectURL(this.image);
        this.img.src = this.url;
        this.uploaded = false;
    }

    async upload(event) {
        try {
            const formData = new FormData();
            formData.append("csrfmiddlewaretoken", getCSRF());
            formData.append("image", this.image);
            if (this.watermark != null)
                formData.append("watermark", this.watermark);
            if (this.category != null)
                formData.append("category", this.category);
            if (this.tags != null && this.tags.length > 0)
                formData.append("tags", this.tags);
            this.showUploading();
            const response = await fetch('/images/upload', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            let json = await response.json();
            this.uploaded = true;
            this.id = json['response'];
            this.showUploaded();
            return this.id;
        } catch (error) {
            this.showFailed();
        }
    }
}

class DropZone {
    constructor(image_upload_form) {

        // Init class variables
        this.parent = image_upload_form;
        this.root = image_upload_form.root;

        // Init images
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
        this.images_container = document.createElement('div');
        this.images_container.classList.add('drop_zone_images_container');
        this.drop_zone.appendChild(this.images_container);

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
        this.submit_button.addEventListener('click', (event) => this.submitClicked(event));
        this.submit_button.textContent = 'Submit';
        this.submit_button.disabled = true;
        this.button_container.appendChild(this.submit_button);
    };

    submitClicked(event) {
        this.submit_button.disabled = true;
        this.uploadImages(event)
    }

    // Upload all images in the form
    async uploadImages(event) {
        let image_ids = [];
        for (let i = 0; i < this.images.length; i++) {
            if (this.images[i].uploaded == true) {
                this.images[i].showUploaded();
                image_ids.push(this.images[i].id);
            }
            else
                image_ids.push(await this.images[i].upload());
        }
        return image_ids;
    }

    // Reset the images of the form (BROKEN)
    resetImages() {
        this.images = [];
        if (this.parent.sidebar != null)
            this.parent.sidebar.remove()
        if (this.images_container != null)
            this.images_container.remove();
    }
    
    // Reset the entire form (BROKEN)
    resetForm() {
        this.resetImages();
        this.files_input.value = null;
        this.submit_button.disabled = true;
    }

    addImage(image) {
        let index = this.images.length;
        image.removeClicked = (event) => {
            event.preventDefault();
            image.remove();
            this.images.splice(index, 1);
        };
        image.imageClicked = (event) => {
            if (this.parent.sidebar != null)
                this.parent.sidebar.remove();
            if (image.selected) {
                image.deselect(event);
            }
            else {
                image.select();
                this.parent.sidebar = new ImageUploadSidebar(this.parent, image);
                for (let j = 0; j < this.images.length; j++) {
                    if (j != index) 
                        this.images[j].deselect();
                }
            }
        }
        this.images.push(image);
    }

    // Populate the images container with selected images
    populateImages(images) {
        for (let i = 0; i < images.length; i++) {
            let image = new PendingImage(this.images_container, images[i]);
            this.addImage(image);
        }
        this.drop_zone.appendChild(this.images_container);
        this.submit_button.disabled = false;
    }

    // Event callback for clicking the "Select Images" button
    selectImages(event) {
        this.files_input.click();
    }
    
    // Event callback for when the images are selected by the "Select Images" button
    imagesChanged(event) {
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
        this.populateImages(event.dataTransfer.files);
        this.imagesDragLeave(event);
    }
}

class ImageUploadSidebar {
    constructor(parent, image) {

        // Init class variables
        this.parent = parent;
        this.image = image;
        this.drop_zone = this.parent.drop_zone

        // Build sidebar
        this.container = document.createElement('div');
        this.container.classList.add('drop_zone_sidebar_container');
        this.parent.root.appendChild(this.container);

        this.sidebar = document.createElement('div');
        this.sidebar.classList.add('drop_zone_sidebar');
        this.container.appendChild(this.sidebar);

        this.watermark_select = new WatermarkSelect(this, this.image);
        this.category_select = new CategorySelect(this, this.image);
        this.tag_select = new TagSelect(this, this.image);

        this.set_all_container = document.createElement('div');
        this.set_all_container.classList.add('drop_zone_setall_container');
        this.sidebar.appendChild(this.set_all_container);
        this.set_all = document.createElement('button');
        this.set_all.classList.add('sidebar_setall');
        this.set_all.textContent = 'Set All';
        this.set_all.addEventListener('click', (event) => this.setAll(event));
        this.set_all_container.appendChild(this.set_all);
    }

    // Deletes the sidebar from the DOM
    remove() {
        this.parent.sidebar = null;
        this.container.remove();
    }

    // Takes the current values of the selection fields and applies them to all images
    setAll(event) {
        if (confirm("Are you sure you want to set all image classifiers equal to the currently selected image?") != true)
            return;

        for (let i in this.drop_zone.images) {
            let image = this.drop_zone.images[i];

            if (this.image.watermark == null)
                delete image.watermark
            else
                image.watermark = this.image.watermark;

            if (this.image.category == null)
                delete image.category
            else
                image.category = this.image.category

            if (this.image.tags == null)
                delete image.tags
            else
                image.tags = JSON.parse(JSON.stringify(this.image.tags));
        }
    }
}

class ImageUploadForm {
    constructor(root) {
        // Get root element
        this.root = root;
        this.root.classList.add('drop_zone_root');

        // Init DropZone
        this.drop_zone = new DropZone(this);

        // Init sidebar
        this.sidebar = null;
    }
}

watermark_list = [];
