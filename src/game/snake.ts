import { Point } from './point';
import { Direction, snakeArray } from './helpers';

export class Snake {
    head: Point;
    snakeArray: snakeArray[];
    direction: Direction;
    color: string;
    score: number = 0;
    size: number;

    constructor(
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

    snakeCollision(snakePositions: snakeArray[]): boolean {
        return snakePositions.some((elem) => {
            return elem.x == this.head.x && elem.y == this.head.y
        });
    }

    snakeIsOutside(boundries: HTMLCanvasElement): boolean {
        return this.head.x <= 0
            || this.head.y <= -1
            || this.head.x >= boundries.width
            || this.head.y >= boundries.height;
    }

}