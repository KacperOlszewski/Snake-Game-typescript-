import {Point} from './point';

export class SnakeTail extends Point {
    tail: SnakeTail;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }

    tailFollows(parent: SnakeTail) {
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
            this.tail = new SnakeTail(this.x, this.y);
        }
    }
}
