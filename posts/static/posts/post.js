class PostUploadForm {
    constructor(root) {

        // Set class variables
        this.container = root;

        // Build post title
        this.title_container = document.createElement('div');
        this.title_container.classList.add('pending_post_title_container');
        this.container.appendChild(this.title_container);
        this.title_content = document.createElement('div');
        this.title_content.setAttribute('contenteditable', '');
        this.title_content.classList.add('pending_post_title_content');
        this.title_container.appendChild(this.title_content);

        // Build post content
        this.post_container = document.createElement('div');
        this.post_container.classList.add('pending_post_container');
        this.container.appendChild(this.post_container);
        this.post_content = document.createElement('input');
        this.post_content.type = 'textarea';
        this.post_content.classList.add('pending_post_content');
        this.post_container.appendChild(this.post_content);
        this.post_editor = new SimpleMDE({
            element: this.post_content,
            toolbar: [
                'bold', 'italic', 'strikethrough', '|',
                'heading-1', 'heading-2', 'heading-3', '|',
                'code', 'quote', 'unordered-list', 'ordered-list', 'clean-block', '|',
                'link', 'image', 'table', 'horizontal-rule', '|',
                'preview'
            ]
        });
        
        // Build image upload
        let image_upload = document.createElement('div');
        image_upload.id = 'image_upload_form';
        image_upload.classList.add('image_upload_form');
        this.container.appendChild(image_upload);
        this.image_upload_form = new ImageUploadForm(image_upload);
        this.image_upload_form.parent = this;
        this.image_upload_form.drop_zone.submitClicked = this.submitClicked;
        this.image_upload_form.drop_zone.submit_button.disabled = false;

    }

    

    async submitClicked(event) {
        let title = this.parent.parent.title_content.textContent;
        let content = this.parent.parent.post_editor.value();
        let images = await this.uploadImages();

        const formData = new FormData();
        formData.append("csrfmiddlewaretoken", getCSRF());
        formData.append('title', title);
        formData.append('content', content);
        if (images.length > 0)
            formData.append('images', images);

        const response = await fetch('/posts/create', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        let json = await response.json();
        location.href = `/posts/view/${json['post']}`;
    };
}