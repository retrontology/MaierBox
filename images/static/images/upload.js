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

function uploadImages() {
    for (let i = 0; i < files_store.length; i++) {
        uploadImage(files_store[i]);
    }
    resetUploadForm();
}

function createObjectURL(object) {
    return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
}

function revokeObjectURL(url) {
    return (window.URL) ? window.URL.revokeObjectURL(url) : window.webkitURL.revokeObjectURL(url);
}

function populateDropZone(images) {
    files_store = [];
    let drop_zone = document.getElementById('drop_zone');
    let root_div = document.createElement('div');
    root_div.id = 'drop_zone_images_container';
    root_div.classList.add('drop_zone_images_container');
    for (let i = 0; i < images.length; i++) {
        let image = images[i];
        files_store.push(image);
        let div = document.createElement('div');
        div.classList.add('drop_zone_image_container');
        let img = document.createElement('img');
        img.classList.add('drop_zone_image');
        div.appendChild(img);
        img.src = createObjectURL(image);
        root_div.appendChild(div);
    }
    drop_zone.appendChild(root_div);
    document.getElementById('drop_zone_submit').disabled = false;
}

function imagesChanged(event) {
    populateDropZone(event.target.files);
}

function imagesDrugOver(event) {
    event.preventDefault();
}

function imagesDragEnter(event) {
    event.preventDefault();
    event.target.classList.add("drop_zone_entered");
    event.target.classList.remove("drop_zone_left")
}

function imagesDragLeave(event) {
    event.preventDefault();
    event.target.classList.add("drop_zone_left");
    event.target.classList.remove("drop_zone_entered");
}

function imagesDropped(event) {
    event.preventDefault();
    populateDropZone(event.dataTransfer.files);
    imagesDragLeave(event);
}

function resetUploadForm(event) {
    files_store = [];
    document.getElementById('drop_zone_images_container').remove();
    document.getElementById('drop_zone_files').value = null;
    document.getElementById('drop_zone_submit').disabled = true;
}

var files_store = [];
