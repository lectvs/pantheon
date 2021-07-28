class SlideManager {
    slides: Slide[];
    private theater: Theater;

    constructor(theater: Theater) {
        this.theater = theater;
        this.slides = [];
    }

    addSlide(slide: Slide) {
        slide.layer = Theater.LAYER_SLIDES;
        World.Actions.setLayer(slide, Theater.LAYER_SLIDES);
        this.theater.addWorldObject(slide);
        this.slides.push(slide);
        return slide;
    }

    clearSlides(exceptLast: number = 0) {
        let deleteCount = this.slides.length - exceptLast;
        for (let i = 0; i < deleteCount; i++) {
            this.slides[i].removeFromWorld();
        }
        this.slides.splice(0, deleteCount);
    }
}