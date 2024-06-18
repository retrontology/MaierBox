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

async function uploadImage(image) {

    const formData = new FormData();
    formData.append("image", image);
    formData.append("csrfmiddlewaretoken", getCSRF());
  
    try {
      const response = await fetch("/images/upload", {
        method: "POST",
        // Set the FormData instance as the request body
        body: formData,
      });
      console.log(await response.json());
    } catch (e) {
      console.error(e);
    }
  }
  

function images_changed(images) {
    
    for (let image in images.files) {
        uploadImage(image)
    }
}
