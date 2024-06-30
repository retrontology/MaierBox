function uploadSuccess(request){
    console.log(request.responseText);
}

function uploadError(request){
    console.log(request.responseText);
}

function uploadImage(image, watermark=null, category=null) {
    const request = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("csrfmiddlewaretoken", getCSRF());
    formData.append("image", image);
    if (watermark != null)
        formData.append("watermark", watermark);
    if (category != null)
        formData.append("category", category);
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

class WatermarkSelect {
    constructor(sidebar) {

        // Init class variables
        this.parent = sidebar;
        this.image = this.parent.image;
        this.watermarks = [];

        // Build watermark select container
        this.container = document.createElement('div');
        this.container.classList.add('sidebar_select');
        this.container.classList.add('watermark_select');
        this.parent.sidebar.appendChild(this.container);

        // Build watermark select label
        this.label = document.createElement('span');
        this.label.classList.add('sidebar_select_label');
        this.label.classList.add('watermark_select_label');
        this.label.textContent = 'Watermark:';
        this.container.appendChild(this.label);

        // Build watermark select input container
        this.select_container = document.createElement('div');
        this.select_container.classList.add('sidebar_select_select_container');
        this.select_container.classList.add('watermark_select_select_container');
        this.container.appendChild(this.select_container);

        // Build watermark select input
        this.select = document.createElement('select');
        this.select.classList.add('sidebar_select_select');
        this.select.classList.add('watermark_select_select');
        this.select.addEventListener('change', (event) => this.selectChanged(event));
        this.select_container.appendChild(this.select);

        // Build watermark select refresh button
        this.refresh_button = document.createElement('button');
        this.refresh_button.classList.add('sidebar_select_refresh_button');
        this.refresh_button.classList.add('watermark_select_refresh_button');
        this.refresh_button.classList.add('sidebar_select_button');
        this.refresh_button.classList.add('watermark_select_button');
        this.refresh_button.addEventListener('click', (event) => this.refreshWatermarks(event));
        this.select_container.appendChild(this.refresh_button);
        this.refresh_button_text = document.createElement('span');
        this.refresh_button_text.classList.add('sidebar_select_refresh_text');
        this.refresh_button_text.classList.add('watermark_select_refresh_text');
        this.refresh_button_text.classList.add('sidebar_select_button_text');
        this.refresh_button_text.classList.add('watermark_select_button_text');
        this.refresh_button_text.textContent = '↻';
        this.refresh_button.appendChild(this.refresh_button_text);

        // Populate categories
        this.refreshWatermarks();

    }

    // Clear watermarks and option list
    clearWatermarks() {
        this.watermarks = [];
        let option_count = this.select.options.length;
        for (let i = 0; i < option_count; i++)
            this.select.options[0].remove();
    }

    // Refresh list of existing watermarks
    refreshWatermarks(event) {
        const request = new XMLHttpRequest();
        request.open("GET", "/watermarks/list", true);
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200)
                this.refreshCallback(request.response);
        };
        request.send();
    }

    // Refresh callback to handle response and populate watermarks
    refreshCallback(response) {
        this.clearWatermarks();
        this.watermarks = JSON.parse(response)['watermarks'];
        let none_option = document.createElement('option');
        none_option.textContent = 'None';
        none_option.value = '';
        this.select.appendChild(none_option);
        for (let index in this.watermarks) {
            let option = document.createElement('option');
            option.textContent = `(${index}) ${this.watermarks[index]['text']}`;
            option.value = index;
            this.select.appendChild(option);
            if ('watermark' in this.image.dataset && this.image.dataset['watermark'] == index) {
                this.select.value = index;
            }
        }
    }

    // Callback for when the watermark select is changed
    selectChanged(event) {
        let value = this.select.value;

        if (value == '') {
            delete this.image.dataset['watermark'];
            return;
        }

        this.image.dataset['watermark'] = value;
    }
}

class CategorySelect {
    constructor(sidebar) {

        // Init class variables
        this.parent = sidebar;
        this.image = this.parent.image;
        this.categories = [];
        
        // Build category select container
        this.container = document.createElement('div');
        this.container.classList.add('sidebar_select');
        this.container.classList.add('category_select');
        this.parent.sidebar.appendChild(this.container);

        // Build category select label
        this.label = document.createElement('span');
        this.label.classList.add('sidebar_select_label');
        this.label.classList.add('category_select_label');
        this.label.textContent = 'Category:';
        this.container.appendChild(this.label);

        // Build category select input container
        this.select_container = document.createElement('div');
        this.select_container.classList.add('sidebar_select_select_container');
        this.select_container.classList.add('category_select_select_container');
        this.container.appendChild(this.select_container);

        // Build category select input and datalist
        this.select_list = document.createElement('datalist');
        this.select_list.classList.add('sidebar_select_datalist');
        this.select_list.classList.add('category_select_datalist');
        this.select_list.id = 'category_select_datalist';
        this.select = document.createElement('input');
        this.select.type = 'text';
        this.select.setAttribute('list', this.select_list.id);
        this.select.classList.add('sidebar_select_select');
        this.select.classList.add('category_select_select');
        this.select.addEventListener('change', (event) => this.selectChanged(event));
        this.select_container.appendChild(this.select);
        this.select_container.appendChild(this.select_list);

        // Build category select add button
        this.add_button = document.createElement('button');
        this.add_button.classList.add('sidebar_select_add_button');
        this.add_button.classList.add('category_select_add_button');
        this.add_button.classList.add('sidebar_select_button');
        this.add_button.classList.add('category_select_button');
        this.add_button.addEventListener('click', (event) => this.addCategory(event));
        this.select_container.appendChild(this.add_button);
        this.add_button_text = document.createElement('span');
        this.add_button_text.classList.add('category_select_add_text');
        this.add_button_text.classList.add('sidebar_select_add_text');
        this.add_button_text.classList.add('category_select_button_text');
        this.add_button_text.classList.add('sidebar_select_button_text');
        this.add_button_text.textContent = '+';
        this.add_button.appendChild(this.add_button_text);

        // Build category select refresh button
        this.refresh_button = document.createElement('button');
        this.refresh_button.classList.add('sidebar_select_refresh_button');
        this.refresh_button.classList.add('category_select_refresh_button');
        this.refresh_button.classList.add('sidebar_select_button');
        this.refresh_button.classList.add('category_select_button');
        this.refresh_button.addEventListener('click', (event) => this.refreshCategories(event));
        this.select_container.appendChild(this.refresh_button);
        this.refresh_button_text = document.createElement('span');
        this.refresh_button_text.classList.add('sidebar_select_refresh_text');
        this.refresh_button_text.classList.add('category_select_refresh_text');
        this.refresh_button_text.classList.add('sidebar_select_button_text');
        this.refresh_button_text.classList.add('category_select_button_text');
        this.refresh_button_text.textContent = '↻';
        this.refresh_button.appendChild(this.refresh_button_text);

        // Populate categories
        this.refreshCategories();
    }

    // Red out the select background to show non-valid categories
    showCorrect () {
        this.select.classList.remove('category_select_select_incorrect');
    }

    // Return the select background to normal to show valid categories
    showIncorrect() {
        this.select.classList.add('category_select_select_incorrect');
    }

    // Clear categories and option list
    clearCategories(event) {
        this.categories = [];
        let option_count = this.select_list.options.length;
        for (let i = 0; i < option_count; i++)
            this.select_list.options[0].remove();
    }

    // Refresh list of existing categories
    refreshCategories(event) {
        const request = new XMLHttpRequest();
        request.open("GET", "/categories/list", true);
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200)
                this.refreshCallback(request.response);
        };
        request.send();
    }

    // Refresh callback to handle response and populate categories
    refreshCallback(response) {
        this.clearCategories();
        this.categories = JSON.parse(response)['categories'];
        for (let i = 0; i < this.categories.length; i++) {
            let option = document.createElement('option');
            option.textContent = this.categories[i];
            this.select_list.appendChild(option);
            if ('category' in this.image.dataset && this.image.dataset['category'] == this.categories[i]) {
                this.select.value = this.categories[i];
                this.showCorrect();
            }
        }
    }

    // Validate the text input (whether it equals an option)
    validateSelect() {
        let value = this.select.value.toLowerCase();
        let match = false;
        for (let i = 0; i < this.select_list.options.length; i++) {
            let option = this.select_list.options[i].value;
            if (value == option) {
                match = true;
                break;
            }  
        }
        return match;
    }

    // Callback for when the category select is changed
    selectChanged(event) {
        let value = this.select.value.toLowerCase();

        if (value == '') {
            delete this.image.dataset['category'];
            this.showCorrect();
            return;
        }

        if (!this.validateSelect()) {
            this.showIncorrect();
            return;
        }

        this.showCorrect();
        this.image.dataset['category'] = value;
    }

    // Add category listed in text input
    addCategory(event) {
        let category = this.select.value.toLowerCase();

        if (category == '' || this.validateSelect())
            return;

        const formData = new FormData();
        formData.append("csrfmiddlewaretoken", getCSRF());
        formData.append("category", category);
        const request = new XMLHttpRequest();
        request.open("POST", "/categories/add", true);
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200)
                this.addCallback(request.response);
        };
        request.send(formData);
    }

    // Add category callback
    addCallback(response) {
        let category = JSON.parse(response)['category'];
        this.image.dataset['category'] = category;
        this.refreshCategories();
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
            let category = this.images[i].dataset['category'];
            let watermark = this.images[i].dataset['watermark'];
            uploadImage(this.files[i], watermark, category);
        }
        this.resetForm();
    }

    // Reset the images of the form
    resetImages() {
        this.files = [];
        this.images = [];
        this.selected = null;
        if (this.parent.sidebar != null)
            this.parent.sidebar.remove()
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
        this.container = document.createElement('div');
        this.container.classList.add('drop_zone_sidebar_container');
        this.parent.root.appendChild(this.container);

        this.sidebar = document.createElement('div');
        this.sidebar.classList.add('drop_zone_sidebar');
        this.container.appendChild(this.sidebar);

        this.watermark_select = new WatermarkSelect(this);
        this.category_select = new CategorySelect(this);
    }

    remove() {
        this.parent.sidebar = null;
        this.container.remove();
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
