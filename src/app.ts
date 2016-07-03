import { Point } from './game/point';
import './style.scss';

enum Direction {
    Left, Right, Up, Down
}

class Snake {
    head: Point;

    constructor() {
        this.head = new Point(80, 40);
        this.head.tail = new Point(70, 40);
        this.head.tail.tail = new Point(60, 40);
        this.head.tail.tail.tail = new Point(50, 40);
    }
}

class SnakeGame {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    snake: Snake;
    speed: number = 80;
    step: number;
    direction: Direction;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.width = 500;
        this.canvas.height = 400;
        this.step = 10;
        this.context = this.canvas.getContext("2d");
    }

    restart(): void {
        this.snake = new Snake();
        this.direction = Direction.Right;
    }

    start(): void {
        this.restart();
        setInterval(() => {
            this.tick()
        }, this.speed)
    }

    tick(): void {
        this.move();
        this.draw();
        if (this.snakeIsOutside())
            this.restart();
    }

    draw(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "#000000";

        let snake = this.snake.head;

        while (snake != null) {
            this.context.fillRect(snake.x, snake.y, snake.width, snake.height);
            snake = snake.tail;
        }
    }

    move(): void {
        this.snake.head.tail.moveToPoint(this.snake.head);

        switch (this.direction) {
            case Direction.Right:
                this.snake.head.x += this.step;
                break;
            case Direction.Down:
                this.snake.head.y -= this.step;
                break;
            case Direction.Left:
                this.snake.head.x -= this.step;
                break;
            case Direction.Up:
                this.snake.head.y += this.step;
        }
    }

    changeDirection(e: KeyboardEvent) {
        var key = e.keyCode;

        switch (key) {
            case 39:
                if (this.direction != Direction.Left)
                    this.direction = Direction.Right;
                break;
            case 40:
                if (this.direction != Direction.Down)
                    this.direction = Direction.Up;
                break;
            case 37:
                if (this.direction != Direction.Right)
                    this.direction = Direction.Left;
                break;
            case 38:
                if (this.direction != Direction.Up)
                    this.direction = Direction.Down;
                break;
        }
    }

    snakeIsOutside(): boolean {
        return this.snake.head.x <= 0
            || this.snake.head.y <= 0
            || this.snake.head.x >= this.canvas.width
            || this.snake.head.y >= this.canvas.height
    }
}

function keyboardListener(e: KeyboardEvent) {
    game.changeDirection(e)
}

var game: SnakeGame;

window.onload = () => {
    document.onkeydown = keyboardListener;

    var el = <HTMLCanvasElement> document.getElementById('game-canvas');
    game = new SnakeGame(el);
    game.start();
};