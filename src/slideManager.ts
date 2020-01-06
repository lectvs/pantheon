class SlideManager {
    slides: Slide[];
    private theater: Theater;

    constructor(theater: Theater) {
        this.theater = theater;
        this.slides = [];
    }

    addSlideByConfig(config: Slide.Config) {
        let slide = new Slide(config);
        this.theater.addWorldObject(slide);
        this.theater.setLayer(slide, Theater.LAYER_SLIDES);
        this.slides.push(slide);
        return slide;
    }

    clearSlides(exceptLast: number = 0) {
        let deleteCount = this.slides.length - exceptLast;
        for (let i = 0; i < deleteCount; i++) {
            this.theater.removeWorldObject(this.slides[i]);
        }
        this.slides.splice(0, deleteCount);
    }
}