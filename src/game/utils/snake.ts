import { SnakeTail } from './snake-tail';
import { Direction } from './direction';

interface SnakeArray {
    x: number;
    y: number;
}

export class Snake {
    head: SnakeTail;
    snakeArray: SnakeArray[];
    direction: Direction;

    constructor() {
        this.head = new SnakeTail(80, 40);
        this.head.tail = new SnakeTail(70, 40);
        this.head.tail.tail = new SnakeTail(60, 40);
        this.head.tail.tail.tail = new SnakeTail(50, 40);

        this.direction = Direction.Right;
    }

    snakeSize(): void {
        this.snakeArray = [];
        let snake = this.head.tail;

        while (snake != null) {
            this.snakeArray.push({x: snake.x, y: snake.y});
            snake = snake.tail;
        }
    }

    eatsItself() {
        return this.snakeArray.some((elem) => (elem.x === this.head.x && elem.y === this.head.y));
    }
}
