class PostUploadForm {
    constructor(root) {

        this.container = root;
        this.post_container = document.createElement('div');
        this.post_container.classList.add('pending_post_container');
        this.container.appendChild(this.post_container);
        this.post_content = document.createElement('input');
        this.post_content.type = 'textarea';
        this.post_content.classList.add('pending_post_content');
        this.post_container.appendChild(this.post_content);
        this.post_editor = new SimpleMDE({ element: this.post_content });
        
        let image_upload = document.createElement('div');
        image_upload.id = 'image_upload_form';
        image_upload.classList.add('image_upload_form');
        this.container.appendChild(image_upload);
        this.image_upload_form = new ImageUploadForm(image_upload);
        this.image_upload_form.drop_zone.submitClicked = this.submitClicked;

    }

    submitClicked(event) {

    };
}