const COMMON_RATIOS = ['1:1', '3:2', '4:3', '5:4', '7:5', '10:8', '11:8.5'];
const PREVIEW_WIDTH = 400;

function greatest_common_factor(a, b) {
    if (!b) {
        return a;
    }

    return greatest_common_factor(b, a % b);
}

function update_watermark_preview() {
    let container = document.getElementById("watermark_container");
    let height = container.offsetHeight
    let width = container.offsetWidth
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
    // let container = document.getElementById("watermark_container");
    // let width = container.offsetWidth;
    // let height = container.offsetHeight;
    // let factor = greatest_common_factor(width, height);
    // let size = document.getElementById("watermark_preview_size");
    let ratio = document.getElementById("watermark_preview_ratio");
    // size.textContent = `${width}×${height}`;
    // ratio.textContent = `${width/factor}:${height/factor}`;
    ratio.textContent = document.getElementById("watermark_control_ratio").value;
    update_watermark_preview();
}

function on_ratio_changed(e) {
    let ratio = document.getElementById("watermark_control_ratio").value;
    let orientation = document.getElementById("watermark_control_orientation").value;
    let preview = document.getElementById("watermark_preview");
    let [coeff_w, coeff_h] = ratio.split(':');
    let width = PREVIEW_WIDTH;
    let height = width * coeff_h / coeff_w;
    if (orientation === "Landscape") {
        preview.style.width = `${width}px`;
        preview.style.height = `${height}px`;
    }
    else if (orientation === "Portrait") {
        preview.style.width = `${height}px`;
        preview.style.height = `${width}px`;
    }
}

function populate_ratios(select) {
    for (let ratio in COMMON_RATIOS) {
        let option = document.createElement('option');
        option.textContent = COMMON_RATIOS[ratio];
        select.appendChild(option)
    }
    on_ratio_changed(null);
}