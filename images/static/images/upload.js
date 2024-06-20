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

function uploadImages(images) {
    for (let i = 0; i < images.length; i++) {
        uploadImage(images[i]);
    }
}

function imagesChanged(event) {
    uploadImages(event.target.files);
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
    uploadImages(event.dataTransfer.files);
    imagesDragLeave(event);
}
