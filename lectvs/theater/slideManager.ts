class SlideManager {
    slides: Slide[];
    private theater: Theater;

    constructor(theater: Theater) {
        this.theater = theater;
        this.slides = [];
    }

    addSlide(slide: Slide) {
        World.Actions.setLayer(slide, Theater.LAYER_SLIDES);
        World.Actions.addWorldObjectToWorld(slide, this.theater);
        this.slides.push(slide);
        return slide;
    }

    clearSlides(exceptLast: number = 0) {
        let deleteCount = this.slides.length - exceptLast;
        for (let i = 0; i < deleteCount; i++) {
            World.Actions.removeWorldObjectFromWorld(this.slides[i]);
        }
        this.slides.splice(0, deleteCount);
    }
}