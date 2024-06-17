function getCSRF() {
    let name = 'csrftoken=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookies = decodedCookie.split(';');
    for(let i = 0; i <cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}

function uploadSuccess(data){
    
}

function uploadError(data){
    
}

function uploadImage(image) {
    let data = {
        'image': image,
        'csrfmiddlewaretoken': getCSRF(),
    };
    $.ajax({
        url: '/images/upload',
        dataType: 'json',
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        success: uploadSuccess, 
        error: uploadError,
    });
    return false;
}

function button_clicked() {
    const form = document.getElementById("files_form");
    const submitter = document.getElementById("upload_button");
    const formData = new FormData(form, submitter);

    
}

$(':button').on('click', button_clicked);