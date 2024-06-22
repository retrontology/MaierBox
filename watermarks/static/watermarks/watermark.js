function update_watermark_preview(e) {
    text = document.getElementById("watermark_text").value;
    family = document.getElementById("watermark_font").selectedOptions[0].dataset['family'];
    family = document.getElementById("watermark_font").selectedOptions[0].dataset['style'];
    size = document.getElementById("watermark_size").value*2;
    transparency = document.getElementById("watermark_transparency").value;

    watermark = document.getElementById("watermark");
    watermark.textContent = text;
    watermark.style.fontFamily = family;
    watermark.style.fontStyle = 0;
    watermark.style.fontSize = `${size}px`;
    watermark.style.opacity = (100-transparency)/100;
}
