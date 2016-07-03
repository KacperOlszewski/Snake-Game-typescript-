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

    moveToPoint(parent: Point) {
        if (this.tail != null) {
            this.tail.moveToPoint(this);
        }
        this.x = parent.x;
        this.y = parent.y;
    }
}