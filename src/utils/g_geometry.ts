namespace G {
    export function rectContains(rect: Rect, contains: Rect) {
        return rect.x <= contains.x && rect.x + rect.width  >= contains.x + contains.width
            && rect.y <= contains.y && rect.y + rect.height >= contains.y + contains.height;
    }

    export function overlapRectangles(rect1: Rectangle, rect2: Rectangle) {
        return rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top;
    }
}