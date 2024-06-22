function update_watermark_preview(e) {
    text = document.getElementById("watermark_text").value;
    font = document.getElementById("watermark_font").value;
    size = document.getElementById("watermark_size").value*2;
    transparency = document.getElementById("watermark_transparency").value;

    watermark = document.getElementById("watermark");
    watermark.textContent = text;
    watermark.style.fontFamily = font;
    watermark.style.fontSize = `${size}px`;
    watermark.style.opacity = (100-transparency)/100;
}
