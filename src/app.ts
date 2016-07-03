import { Point } from './game/point';
import './style.scss';

enum Direction {
    Left, Right, Up, Down
}

class SnakeGame {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    snake: Point;
    speed: number = 10;
    step: number;
    direction: Direction;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.width = 500;
        this.canvas.height = 400;
        this.step = 1;
        this.context = this.canvas.getContext("2d");
    }

    restart(): void {
        this.snake = new Point(90, 40);
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

        let snake = this.snake;
        this.context.fillRect(snake.x, snake.y, snake.width, snake.height)
    }

    move(): void {
        let snake = this.snake;

        switch (this.direction) {
            case Direction.Right:
                snake.x += this.step;
                break;
            case Direction.Down:
                snake.y -= this.step;
                break;
            case Direction.Left:
                snake.x -= this.step;
                break;
            case Direction.Up:
                snake.y += this.step;
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
        return this.snake.x <= 0
            || this.snake.y <= 0
            || this.snake.x >= this.canvas.width
            || this.snake.y >= this.canvas.height
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