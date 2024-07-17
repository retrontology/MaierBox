async function delete_button_clicked(id) {
    if (confirm("Are you sure you wish to delete this image?") != true)
        return;
    
    const response = await fetch(`/images/delete/${id}`, {
        method: 'DELETE',
        headers: {
            "X-CSRFToken": getCSRF()
        },
    });

    if (!response.ok)
        throw new Error(`Response status: ${response.status}`);

    let url = '/';
    let referer = document.getElementById('header_return');
    if (referer != null) {
        url = referer.href;
    }

    window.location.href = url;

}