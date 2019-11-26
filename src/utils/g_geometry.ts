namespace G {
    export function expandRectangle(rect: Rect, amount: number) {
        rect.x -= amount;
        rect.y -= amount;
        rect.width += 2*amount;
        rect.height += 2*amount;
    }

    export function overlapRectangles(rect1: Rect, rect2: Rect) {
        return rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
    }

    export function rectContains(rect: Rect, contains: Rect) {
        return rect.x <= contains.x && rect.x + rect.width  >= contains.x + contains.width
            && rect.y <= contains.y && rect.y + rect.height >= contains.y + contains.height;
    }
}