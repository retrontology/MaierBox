function delete_button_clicked(id) {
    if (confirm("Are you sure you wish to delete this image?") == true)
        window.location.href = `/images/delete/${id}`;
}