function updateCategoryDisplay(category) {
    const categoryContainer = document.querySelector('.webimage_category');
    if (!categoryContainer)
        return;

    if (category == null || category === '') {
        categoryContainer.innerHTML = '';
        return;
    }

    categoryContainer.innerHTML = '';
    const span = document.createElement('span');
    span.textContent = 'Category:';
    const link = document.createElement('a');
    link.href = `/categories/images/${encodeURIComponent(category)}`;
    link.textContent = category;
    span.appendChild(link);
    categoryContainer.appendChild(span);
}

function updateTagsDisplay(tags) {
    const tagsContainer = document.querySelector('.webimage_tags');
    if (!tagsContainer)
        return;

    if (!tags || tags.length === 0) {
        tagsContainer.innerHTML = '';
        return;
    }

    tagsContainer.innerHTML = '';
    const label = document.createElement('span');
    label.classList.add('webimage_tags_label');
    label.textContent = 'Tags:';
    tagsContainer.appendChild(label);
    for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        const link = document.createElement('a');
        link.classList.add('webimage_tags_tag');
        link.href = `/tags/images/${encodeURIComponent(tag)}`;
        link.textContent = tag;
        tagsContainer.appendChild(link);
    }
}

async function saveCategory(imageId, category) {
    const csrfToken = getCSRF();
    const formData = new FormData();
    if (csrfToken)
        formData.append('csrfmiddlewaretoken', csrfToken);
    formData.append('category', category ?? '');
    const response = await fetch(`/images/update-category/${imageId}`, {
        method: 'POST',
        headers: csrfToken ? { 'X-CSRFToken': csrfToken } : {},
        body: formData
    });
    if (!response.ok)
        throw new Error(`Response status: ${response.status}`);
    return response.json();
}

async function saveTags(imageId, tags) {
    const csrfToken = getCSRF();
    const formData = new FormData();
    if (csrfToken)
        formData.append('csrfmiddlewaretoken', csrfToken);
    formData.append('tags', (tags || []).join(','));
    const response = await fetch(`/images/update-tags/${imageId}`, {
        method: 'POST',
        headers: csrfToken ? { 'X-CSRFToken': csrfToken } : {},
        body: formData
    });
    if (!response.ok)
        throw new Error(`Response status: ${response.status}`);
    return response.json();
}

function initImageEdit() {
    const context = window.webimageEditContext;
    if (!context)
        return;

    const editButton = document.querySelector('.webimage_edit_button');
    const panel = document.getElementById('webimage_edit_panel');
    const sidebarContainer = document.getElementById('webimage_edit_sidebar');
    const classifiers = document.getElementById('webimage_classifiers');
    const categoryDisplay = document.getElementById('webimage_category_display');
    const tagsDisplay = document.getElementById('webimage_tags_display');
    const saveButton = document.querySelector('.webimage_edit_save');
    const cancelButton = document.querySelector('.webimage_edit_cancel');

    if (!editButton || !panel || !sidebarContainer || !saveButton || !cancelButton)
        return;

    let editInitialized = false;
    let editActive = false;
    const imageData = {
        category: context.category || '',
        tags: context.tags || []
    };
    let categorySelect = null;
    let tagSelect = null;

    function syncFromContext() {
        imageData.category = context.category || '';
        imageData.tags = context.tags ? context.tags.slice() : [];
        if (categorySelect)
            categorySelect.loadData();
        if (tagSelect)
            tagSelect.loadData();
    }

    function toggleEditMode(enable) {
        editActive = enable;
        if (editActive)
            panel.classList.add('is_active');
        else
            panel.classList.remove('is_active');
        if (classifiers)
            classifiers.classList.toggle('is_editing', editActive);
        if (categoryDisplay)
            categoryDisplay.classList.toggle('is_hidden', editActive);
        if (tagsDisplay)
            tagsDisplay.classList.toggle('is_hidden', editActive);
    }

    editButton.addEventListener('click', () => {
        if (!editInitialized) {
            const sidebarParent = { sidebar: sidebarContainer };
            categorySelect = new CategorySelect(sidebarParent, imageData);
            tagSelect = new TagSelect(sidebarParent, imageData);
            editInitialized = true;
        }
        syncFromContext();
        toggleEditMode(!editActive);
    });

    cancelButton.addEventListener('click', () => {
        syncFromContext();
        toggleEditMode(false);
    });

    saveButton.addEventListener('click', async () => {
        try {
            const category = imageData.category || '';
            const tags = imageData.tags || [];
            await saveCategory(context.id, category);
            await saveTags(context.id, tags);

            context.category = category;
            context.tags = tags.slice();

            updateCategoryDisplay(category);
            updateTagsDisplay(tags);
            toggleEditMode(false);
        } catch (error) {
            console.error(error);
            alert('Could not save image metadata.');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initImageEdit();
});
