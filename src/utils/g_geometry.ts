namespace G {
    export function overlapRectangles(rect1: Rectangle, rect2: Rectangle) {
        return rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top;
    }
}