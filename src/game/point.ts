export class Point {

    x: number;
    y: number;

    width: number;
    height: number;

    tail: Point;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
    }

    tailFollows(parent: Point) {
        if (this.tail != null) {
            this.tail.tailFollows(this);
        }
        this.x = parent.x;
        this.y = parent.y;
    }

    newTail() {
        if (this.tail != null) {
            this.tail.newTail();
        } else {
            this.tail = new Point(this.x, this.y);
        }
    }
}