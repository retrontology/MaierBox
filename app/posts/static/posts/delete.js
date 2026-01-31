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

    let returnUrl = '/';
    if (document.referrer) {
        try {
            const referrerUrl = new URL(document.referrer);
            if (referrerUrl.origin === window.location.origin &&
                referrerUrl.href !== window.location.href) {
                returnUrl = referrerUrl.href;
            }
        } catch (error) {
            returnUrl = '/';
        }
    }

    window.location.href = returnUrl;
}
