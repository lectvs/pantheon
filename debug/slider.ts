function addSlider(startValue: number, set: (v: number) => void, min: number, max: number, step: number) {
    let slider = document.createElement('input');
    slider.type = 'range';
    slider.min = `${min}`;
    slider.max = `${max}`;
    slider.step = `${step}`;
    slider.value = `${startValue}`;
    slider.oninput = function() {
        set(parseFloat(slider.value));
    }
    document.body.appendChild(slider);
}