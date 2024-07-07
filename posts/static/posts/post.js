class PostUploadForm {
    constructor(root) {

        this.container = root;
        this.post_container = document.createElement('div');
        this.post_container.classList.add('pending_post_container');
        this.container.appendChild(this.post_container);
        this.post_content = document.createElement('div');
        //this.post_content.type = 'textarea';
        this.post_content.setAttribute('contenteditable', 'true');
        this.post_content.classList.add('pending_post_content');
        this.post_content.addEventListener("paste", function(e) {
            // cancel paste
            e.preventDefault();
        
            // get text representation of clipboard
            var text = (e.originalEvent || e).clipboardData.getData('text/plain');
        
            // insert text manually
            document.execCommand("insertHTML", false, text);
        });
        this.post_container.appendChild(this.post_content);

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