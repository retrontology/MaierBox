if (typeof category_list === 'undefined') {
    category_list = [];
}

if (typeof tag_list === 'undefined') {
    tag_list = [];
}

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
        for (let i = this.collection.children.length - 1; i >= 0; i--) {
            let tag_container = this.collection.children[i];
            if (tag_container && tag_container.firstChild && tag == tag_container.firstChild.textContent) {
                tag_container.remove();
                break;
            }
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
