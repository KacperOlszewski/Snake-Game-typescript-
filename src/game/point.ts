export class Point {

    x: number;
    y: number;

    width: number;
    height: number;

    tail: Point[];

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
    }
}