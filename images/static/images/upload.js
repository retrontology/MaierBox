function uploadSuccess(request){
    console.log(request.responseText);
}

function uploadError(request){
    console.log(request.responseText);
}

function uploadWebImage(image, watermark=null, category=null, tags=null) {
    const request = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("csrfmiddlewaretoken", getCSRF());
    formData.append("image", image);
    if (watermark != null)
        formData.append("watermark", watermark);
    if (category != null)
        formData.append("category", category);
    if (tags != null)
        formData.append("tags", tags);
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

class InputSelect {
    constructor(parent, image, type='text', label='', add=false, refresh=false) {

        // Init class variables
        this.parent = parent;
        this.image = image;
        this.type = type;
        this.items = [];
        this.prefix = label.toLowerCase();
        if (this.prefix != '' )
            this.label_text = this.prefix.charAt(0).toUpperCase() + this.prefix.slice(1);
        else
            this.label_text = '';

        // Build select container
        this.container = document.createElement('div');
        this.container.classList.add('sidebar_select');
        this.container.classList.add(`${this.prefix}_select`);
        this.parent.sidebar.appendChild(this.container);

        // Build select input container
        this.select_container = document.createElement('div');
        this.select_container.classList.add('sidebar_select_select_container');
        this.select_container.classList.add(`${this.prefix}_select_select_container`);
        this.container.appendChild(this.select_container);

        // Build select label
        this.label = document.createElement('div');
        this.label.classList.add('sidebar_select_label');
        this.label.classList.add(`${this.prefix}_select_label`);
        this.label.textContent = `${this.label_text}:`;
        this.select_container.appendChild(this.label);

        // Build select input
        if (this.type == 'select') {
            this.select = document.createElement('select');
            this.select_list = this.select;
        }
        else if (this.type == 'text') {
            this.select = document.createElement('input');
            this.select.type = 'text';
            this.select_list = document.createElement('datalist');
            this.select_list.classList.add('sidebar_select_datalist');
            this.select_list.classList.add(`${this.prefix}_select_datalist`);
            this.select_list.id = `${this.prefix}_tag_select_datalist`;
            this.select.setAttribute('list', this.select_list.id);
            this.select.addEventListener('keypress', (event) => this.keyPressed(event))
            this.select_container.appendChild(this.select_list);
        }
        this.select.classList.add('sidebar_select_select');
        this.select.classList.add(`${this.prefix}_select_select`);
        this.select.addEventListener('change', (event) => this.onChanged(event));
        this.select_container.appendChild(this.select);

        // Build select add button
        if (add != false && add != null) {
            this.add_endpoint = add;
            this.add_button = document.createElement('button');
            this.add_button.classList.add('sidebar_select_add_button');
            this.add_button.classList.add('sidebar_select_button');
            this.add_button.classList.add(`${this.prefix}_select_button`);
            this.add_button.addEventListener('click', (event) => this.add(event));
            this.select_container.appendChild(this.add_button);
            this.add_button_text = document.createElement('span');
            
            this.add_button_text.classList.add('sidebar_select_add_text');
            this.add_button_text.classList.add('sidebar_select_button_text');
            if (this.prefix != '') {
                this.add_button_text.classList.add(`${this.prefix}_select_button_text`);
                this.add_button_text.classList.add(`${this.prefix}_select_add_text`);
            }
            this.add_button_text.textContent = '+';
            this.add_button.appendChild(this.add_button_text);
        }

        // Build select refresh button
        if (refresh != false && refresh != null) {
            this.refresh_endpoint = refresh;
            this.refresh_button = document.createElement('button');
            this.refresh_button.classList.add('sidebar_select_refresh_button');
            this.refresh_button.classList.add('sidebar_select_button');
            if (this.prefix != '') {
                this.refresh_button.classList.add(`${this.prefix}_select_refresh_button`);
                this.refresh_button.classList.add(`${this.prefix}_select_button`);
            }
            this.refresh_button.addEventListener('click', (event) => this.refresh(event));
            this.select_container.appendChild(this.refresh_button);
            this.refresh_button_text = document.createElement('div');
            this.refresh_button_text.classList.add('sidebar_select_refresh_text');
            this.refresh_button_text.classList.add('sidebar_select_button_text');
            if (this.prefix != '') {
                this.refresh_button_text.classList.add(`${this.prefix}_select_refresh_text`);
                this.refresh_button_text.classList.add(`${this.prefix}_select_button_text`);
            }
            this.refresh_button_text.textContent = '↻';
            this.refresh_button.appendChild(this.refresh_button_text);
            this.refresh();
        }

    }

    // Save data to dataset of image
    loadData() {
        let data = this.image.dataset[this.prefix];
        if (data == null)
            this.select.value = '';
        else
            this.select.value = data;
    }

    // Load data from dataset of image
    saveData() {
        this.image.dataset[this.prefix] = this.select.value;
    }

    // Callback for when a key is pressed in the text field
    keyPressed(event) {
        if (event.key != "Enter")
            return;

        event.preventDefault();
        this.enterPressed(event);
    }

    // Empty callback for when the Enter key is pressed in the text box
    enterPressed(event) {}

    // Empty callback for when the select is changed. To be overwritten by subclasses
    onChanged(event) {}

    // Refresh list of existing items
    refresh(event) {
        this.clear();
        let option = document.createElement('option');
        option.textContent = '';
        this.select_list.appendChild(option);
        this.getItems(1);
    }

    // Function for adding option to select list from returned item
    addOption(item) {
        let option = document.createElement('option');
        option.textContent = item;
        this.select_list.appendChild(option);
    }

    // Get page of items
    getItems(page) {
        let endpoint = this.refresh_endpoint;
        if (page > 1)
            endpoint = `${endpoint}?page=${page}`
        const request = new XMLHttpRequest();
        request.open('GET', endpoint, true);
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                let response = JSON.parse(request.response);
                this.items.push(...response['items']);
                for (let i = 0; i < response['items'].length; i++)
                    this.addOption(response['items'][i]);
                if ('next' in response)
                    this.getItems(response['next']);
                else {
                    this.loadData();
                    this.refreshCallback();
                }
            }
        };
        request.send();
    }

    // Empty refresh callback to be overwritten by subclasses
    refreshCallback(response) {}

    // Add function for adding item via API
    add(event) {
        let value = this.select.value.toLowerCase();

        if (value == '' || this.validateSelect())
            return;

        const formData = new FormData();
        formData.append("csrfmiddlewaretoken", getCSRF());
        formData.append(this.prefix, value);
        const request = new XMLHttpRequest();
        request.open("POST", this.add_endpoint, true);
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                this.saveData();
                this.refresh();
                this.addCallback(request.response);
            }
                
        };
        request.send(formData);
    }

    // Empty add callback to be overwritten by subclasses
    addCallback(response) {}

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

    // Clear items, option list, and dataset
    clear() {
        this.items = [];
        let option_count = this.select_list.options.length;
        for (let i = 0; i < option_count; i++)
            this.select_list.options[0].remove();
    }

}

class WatermarkSelect extends InputSelect {
    constructor(parent, image) {
        super(parent, image, 'select', 'watermark', false, '/watermarks/list');    }

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
            delete this.image.dataset['watermark'];
            return;
        }

        this.image.dataset['watermark'] = value;
    }
}

class CategorySelect extends InputSelect {
    constructor(parent, image) {
        super(parent, image, 'text', 'category', '/categories/add', '/categories/list');
    }

    addCallback(response) {
        this.showCorrect();
    }

    // Red out the select background to show non-valid categories
    showCorrect () {
        this.select.classList.remove('category_select_select_incorrect');
    }

    // Return the select background to normal to show valid categories
    showIncorrect() {
        this.select.classList.add('category_select_select_incorrect');
    }

    // Callback for when the category select is changed
    onChanged(event) {
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

    static validateCategory(category) {
        return true;
    }

}

class TagSelect extends InputSelect {
    constructor(parent, image) {

        // Initialize class variables
        super(parent, image, 'text', 'tag', true, '/tags/list');
        this.tags = [];

        // Build tag collection
        this.collection = document.createElement('div');
        this.collection.classList.add('tag_select_collection');
        this.container.appendChild(this.collection);

        // Populate tags
        this.loadData();

    }

    // Callback for when a key is pressed in the text field
    enterPressed(event) {
        this.add(event);
    }

    // Callback for when the add button is pressed
    add(event) {
        this.addTag(this.select.value);
    }

    // Add tag to the image
    addTag(tag) {
        tag = tag.toLowerCase();

        if (tag == '')
            return;

        if (this.tags.indexOf(tag) != -1) {
            this.select.value = '';
            return;
        }

        if (!TagSelect.validateTag(tag))
            return;
            
        this.tags.push(tag);
        let tag_container = document.createElement('div');
        tag_container.classList.add('tag_select_tag_container');
        this.collection.appendChild(tag_container);
        let tag_text = document.createElement('div');
        tag_text.classList.add('tag_select_tag_text');
        tag_text.textContent = tag;
        tag_container.appendChild(tag_text);
        let remove_button = document.createElement('div');
        remove_button.classList.add('tag_select_tag_remove');
        remove_button.addEventListener('click', (event) => this.removeTag(tag));
        remove_button.textContent = '❌';
        tag_container.appendChild(remove_button);
        this.select.value = '';
        this.saveData();
    }

    // Remove tag from the image
    removeTag(tag) {
        let index = this.tags.indexOf(tag);
        if (index == -1)
            return;

        this.tags.splice(index, 1);
        for (let i = 0; i < this.collection.children.length; i++) {
            let tag_container = this.collection.children[i];
            if(tag == tag_container.firstChild.textContent)
                tag_container.remove();
        }

        this.saveData();
    }

    // Serialize tags into csv for the image dataset
    saveData(event) {
        if (this.tags.length > 0) {
            let tags = this.tags.join(',');
            this.image.dataset['tags'] = tags;
        }
        else
            delete this.image.dataset['tags'];
    }

    // Deserialize tags from csv in image dataset
    loadData(event) {
        let tags = this.image.dataset['tags'];
        if (tags != null) {
            tags = tags.split(',');
            for (let i in tags)
                this.addTag(tags[i]);
        }
        
    }

    // Clear all the tags
    clearTags(event) {

    }

    static validateTag(tag) {
        return true;
    }
}

class PendingImage {
    constructor(parent, image, index) {
        this.parent = parent;
        this.image = image;
        this.index = index;
        this.selected = false;
        this.url = createObjectURL(this.image);

        this.container = document.createElement('div');
        this.container.classList.add('pending_image_container');
        this.container.addEventListener('click', (event) => this.imageClicked(event));
        this.container.addEventListener('dragstart', (event) => this.imageDragStart(event));
        this.img = document.createElement('img');
        this.img.classList.add('pending_image_image');
        this.img.loading = 'lazy';
        this.img.src = this.url;
        this.container.appendChild(this.img);
        this.remove_button = document.createElement('div');
        this.remove_button.classList.add('pending_image_delete');
        this.remove_button.addEventListener('click', (event) => this.removeClicked(event));
        this.remove_button.textContent = '❌';
        this.container.appendChild(this.remove_button);
        this.parent.appendChild(this.container);
    }

    select(event) {
        if (!this.selected) {
            this.container.classList.add('pending_image_selected');
            this.selected = true;
            return true;
        }
        else
            return false;
    }

    deselect(event) {
        if (this.selected) {
            this.container.classList.remove('pending_image_selected');
            this.selected = false;
            return true;
        }
        else
            return false;
    }

    imageClicked(event) {}

    imageDragStart(event) {
        event.preventDefault();
    }

    removeClicked(event) {
        this.remove();
    }

    remove() {
        this.container.remove();
        delete this.url;
        delete this.image;
        delete this.container;
    }

    upload(event) {

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
        this.submit_button.addEventListener('click', (event) => this.submitClicked(event));
        this.submit_button.textContent = 'Submit';
        this.submit_button.disabled = true;
        this.button_container.appendChild(this.submit_button);
    };

    submitClicked(event) {
        this.uploadImages(event)
    }

    uploadImage(index) {
        let image = this.images[i];
        let file = this.files[i];
        let category = this.images[i].dataset['category'];
        let watermark = this.images[i].dataset['watermark'];
        let tags = this.images[i].dataset['tags'];
        uploadWebImage(this.files[i], watermark, category, tags);
    }

    // Upload all images in the form
    uploadImages(event) {
        for (let i = 0; i < this.files.length; i++) {
            let category = this.images[i].dataset['category'];
            let watermark = this.images[i].dataset['watermark'];
            let tags = this.images[i].dataset['tags'];
            this.uploadImage(this.files[i], watermark, category, tags);
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
            let image = new PendingImage(this.images_container, images[i], i);
            image.index = i;
            this.images.push(image);
        }
        this.drop_zone.appendChild(this.images_container);
        this.submit_button.disabled = false;
    }

    // Remove image from form at index
    removeImage(index) {
        
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
        for (let i in this.drop_zone.images) {
            let image = this.drop_zone.images[i];

            if (this.image.dataset['watermark'] == null)
                delete image.dataset['watermark']
            else
                image.dataset['watermark'] = this.image.dataset['watermark'];

            if (this.image.dataset['category'] == null)
                delete image.dataset['category']
            else
                image.dataset['category'] = this.image.dataset['category']

            if (this.image.dataset['tags'] == null)
                delete image.dataset['tags']
            else
                image.dataset['tags'] = this.image.dataset['tags']
        }
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

class PostUploadForm extends ImageUploadForm {
    constructor(root) {
        super(root);
        this.drop_zone.submitClicked = this.submitClicked;
    }

    submitClicked(event) {

    }
}
