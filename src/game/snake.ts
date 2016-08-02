import { Point } from './point';
import { Direction, snakeArray } from './helpers';

export class Snake {
    name: string;
    head: Point;
    snakeArray: snakeArray[];
    direction: Direction;
    color: string;
    score: number = 0;
    size: number;

    constructor(
        name: string,
        x: number,
        y: number,
        direction: Direction,
        color: string = "#000000",
        size: number = 10
    ) {
        this.head = new Point(x, y);
        this.head.tail = new Point(x - 10, y);
        this.head.tail.tail = new Point(x - 20, y);
        this.head.tail.tail.tail = new Point(x - 30, y);

        this.direction = direction;
        this.color = color;
        this.size = size;
    }

    move() {
        this.head.tail.tailFollows(this.head);

        switch (this.direction) {
            case Direction.Right:
                this.head.x += this.size;
                break;
            case Direction.Down:
                this.head.y -= this.size;
                break;
            case Direction.Left:
                this.head.x -= this.size;
                break;
            case Direction.Up:
                this.head.y += this.size;
        }
    }

    eat(food: Point): boolean {
        const snake = this.head;

        if (snake.x === food.x && snake.y === food.y) {
            snake.tail.newTail();
            this.score++;

            return true;
        }

        return false;
    }

    snakeCollision(snakePositions: snakeArray[], snakeHeads: snakeArray[]): boolean {
        const collisions = snakePositions.concat(snakeHeads);

        return collisions.some((elem) => {
            return elem.x == this.head.x && elem.y == this.head.y;
        });
    }

    snakeIsOutside(canvas: HTMLCanvasElement): boolean {
        return this.head.x <= 0
            || this.head.y <= -1
            || this.head.x >= canvas.width
            || this.head.y >= canvas.height;
    }

    SnakeLost() {
        console.log(this.name + ' has lost');
    }
}