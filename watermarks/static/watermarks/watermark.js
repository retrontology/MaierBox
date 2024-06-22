function update_watermark_preview() {
    let preview = document.getElementById("watermark_preview");
    let preview_style = getComputedStyle(preview);
    let height = preview.offsetHeight - (parseInt(preview_style.borderTopWidth) + parseInt(preview_style.borderBottomWidth));
    let width = preview.offsetWidth - (parseInt(preview_style.borderLeftWidth) + parseInt(preview_style.borderRightWidth));
    let smallest = height;
    if (width < height)
        smallest = width;
    let ratio = smallest/100;

    let text = document.getElementById("watermark_text").value;
    let family = document.getElementById("watermark_font").selectedOptions[0].dataset['family'];
    let style = document.getElementById("watermark_font").selectedOptions[0].dataset['style'];
    let size = document.getElementById("watermark_size").value*ratio;
    let transparency = document.getElementById("watermark_transparency").value;

    watermark = document.getElementById("watermark");
    watermark.textContent = text;
    watermark.style.font = `${style} ${size}px ${family}`;
    watermark.style.opacity = (100-transparency)/100;
}

function on_preview_resize(entries, observer) {
    update_watermark_preview();
}