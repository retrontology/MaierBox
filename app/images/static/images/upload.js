class InputSelect {
    constructor(parent, image, type='text', label='', add=false, refresh=false) {

        // Init class variables
        this.parent = parent;
        this.image = image;
        this.type = type;
        this.items = [];
        this.prefix = label.toLowerCase();
        this.label_text = this.prefix.charAt(0).toUpperCase() + this.prefix.slice(1);

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
            this.add_button_text.classList.add(`${this.prefix}_select_button_text`);
            this.add_button_text.classList.add(`${this.prefix}_select_add_text`);
            this.add_button_text.textContent = '+';
            this.add_button.appendChild(this.add_button_text);
        }

        // Build select refresh button
        if (refresh != false && refresh != null) {
            this.refresh_endpoint = refresh;
            this.refresh_button = document.createElement('button');
            this.refresh_button.classList.add('sidebar_select_refresh_button');
            this.refresh_button.classList.add('sidebar_select_button');
            this.refresh_button.classList.add(`${this.prefix}_select_refresh_button`);
            this.refresh_button.classList.add(`${this.prefix}_select_button`);
            this.refresh_button.addEventListener('click', (event) => this.refresh(event));
            this.select_container.appendChild(this.refresh_button);
            this.refresh_button_text = document.createElement('div');
            this.refresh_button_text.classList.add('sidebar_select_refresh_text');
            this.refresh_button_text.classList.add('sidebar_select_button_text');
            this.refresh_button_text.classList.add(`${this.prefix}_select_refresh_text`);
            this.refresh_button_text.classList.add(`${this.prefix}_select_button_text`);
            this.refresh_button_text.textContent = '↻';
            this.refresh_button.appendChild(this.refresh_button_text);
        }
    }

    // Save data to image
    loadData() {
        let data = this.image[this.prefix];
        if (data == null)
            this.select.value = '';
        else
            this.select.value = data;
    }

    // Load data from image
    saveData() {
        this.image[this.prefix] = this.select.value;
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
        this.getItems(1);
    }

    // Update option list to reflect current items
    populateOptions() {
        this.clearOptions();
        let option = document.createElement('option');
        option.textContent = '';
        this.select_list.appendChild(option);
        for (let i = 0; i < this.items.length; i++)
            this.addOption(this.items[i]);
        this.loadData();
    }

    // Function for adding option to select list from returned item
    addOption(item) {
        let option = document.createElement('option');
        option.textContent = item;
        this.select_list.appendChild(option);
    }

    // Get page of items
    async getItems(page) {
        let endpoint = this.refresh_endpoint;
        if (page > 1)
            endpoint = `${endpoint}?page=${page}`
        const response = await fetch(endpoint, {
            method: 'GET',
        });            
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        let data = await response.json();
        this.items.push(...data['items']);
        if ('next' in data)
            this.getItems(data['next']);
        else {
            this.populateOptions();
            this.refreshCallback();
        }
    }

    // Empty refresh callback to be overwritten by subclasses
    refreshCallback(response) {}

    // Add function for adding item via API
    async add(event) {
        let value = this.select.value.toLowerCase();

        if (value == '' || this.validateSelect())
            return;

        const formData = new FormData();
        formData.append("csrfmiddlewaretoken", getCSRF());
        formData.append(this.prefix, value);

        const response = await fetch(this.add_endpoint, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        this.saveData();
        this.refresh();
        this.addCallback(response);
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

    // Clear items, option list
    clear() {
        this.clearItems();
        this.clearOptions();
    }

    clearItems() {
        this.items.length = 0;
    }

    clearOptions() {
        let option_count = this.select_list.options.length;
        for (let i = 0; i < option_count; i++)
            this.select_list.options[0].remove();
    }

}

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

class CategorySelect extends InputSelect {
    constructor(parent, image) {
        super(parent, image, 'text', 'category', '/categories/add', '/categories/list');
        this.items = category_list;
        if (this.items.length == 0)
            this.refresh();
        else
            this.populateOptions();
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
            delete this.image.category;
            this.showCorrect();
            return;
        }

        if (!this.validateSelect()) {
            this.showIncorrect();
            return;
        }

        this.showCorrect();
        this.image.category = value;
    }

    static validateCategory(category) {
        return true;
    }

}

class TagSelect extends InputSelect {
    constructor(parent, image) {

        // Initialize class variables
        super(parent, image, 'text', 'tag', true, '/tags/list');
        this.items = tag_list;

        // Build tag collection
        this.collection = document.createElement('div');
        this.collection.classList.add('tag_select_collection');
        this.container.appendChild(this.collection);

        // Build tags
        this.tags = [];
        if (this.items.length == 0)
            this.refresh();
        else
            this.populateOptions();
    }

    // Callback for when a key is pressed in the text field
    enterPressed(event) {
        this.add(event);
    }

    // Callback for when the add button is pressed
    add(event) {
        let tag = this.select.value.toLowerCase();

        if (tag == '')
            return;

        if (this.tags.indexOf(tag) != -1) {
            this.select.value = '';
            return;
        }

        if (!TagSelect.validateTag(tag))
            return;
            
        this.tags.push(tag);
        this.addTagElement(tag);
        this.select.value = '';
        this.saveData();
    }

    // Add tag element to DOM
    addTagElement(tag) {
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
    }

    // Remove tag from the image
    removeTag(tag) {
        let index = this.tags.indexOf(tag);
        if (index == -1)
            return;

        this.tags.splice(index, 1);
        let child_count = this.collection.children.length;
        for (let i = 0; i < child_count; i++) {
            let tag_container = this.collection.children[i];
            if(tag == tag_container.firstChild.textContent)
                tag_container.remove();
        }

        this.saveData();
    }

    // Serialize tags into csv for the image
    saveData(event) {
        this.image.tags = this.tags;
    }

    // Deserialize tags from csv in image
    loadData(event) {
        this.clearTags();
        if (this.image.tags == null)
            this.tags = [];
        else
            this.tags = this.image.tags;
        for (let i in this.tags)
            this.addTagElement(this.tags[i]);
    }

    // Clear all the tags
    clearTags(event) {
        let child_count = this.collection.children.length;
        for (let i = 0; i < child_count; i++)
            this.collection.children[0].remove();
    }

    static validateTag(tag) {
        return true;
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
            if (this.images[i].upload != true)
                image_ids.push(await this.images[i].upload());
        }
        return image_ids;
    }

    // Reset the images of the form
    resetImages() {
        this.images = [];
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

    addImage(image) {
        let index = this.images.length;
        image.removeClicked = (event) => {
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
category_list = [];
tag_list = [];
