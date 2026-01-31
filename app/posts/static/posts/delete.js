async function delete_post_clicked(id) {
    if (confirm("Are you sure you wish to delete this post?") != true)
        return;
    
    const response = await fetch(`/posts/delete/${id}`, {
        method: 'DELETE',
        headers: {
            "X-CSRFToken": getCSRF()
        },
    });

    if (!response.ok)
        throw new Error(`Response status: ${response.status}`);

    window.location.href = '/posts';
}
