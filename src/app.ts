import { Point } from './game/point';
import './style.scss';

enum Direction {
    Left, Right, Up, Down
}

enum Axis {
    x, y
}

interface snakeArray {
    x: number,
    y: number
}

class Snake {
    head: Point;
    snakeArray: snakeArray[];

    constructor() {
        this.head = new Point(80, 40);
        this.head.tail = new Point(70, 40);
        this.head.tail.tail = new Point(60, 40);
        this.head.tail.tail.tail = new Point(50, 40);
    }
}

class SnakeGame {
    canvas: HTMLCanvasElement;
    scoreOutput: HTMLElement;
    context: CanvasRenderingContext2D;
    snake: Snake;
    food: Point;
    score: number;
    speed: number = 70;
    step: number;
    direction: Direction;

    constructor(canvas: HTMLCanvasElement, scoreOutput: HTMLElement) {
        this.canvas = canvas;
        this.canvas.width = 500;
        this.canvas.height = 400;
        this.step = 10;
        this.scoreOutput = scoreOutput;
        this.context = this.canvas.getContext("2d");
    }

    restart(): void {
        this.snake = new Snake();
        this.snake.snakeArray = [];
        this.score = 0;
        this.food = new Point(
            this.spawnFood(Axis.x),
            this.spawnFood(Axis.y)
        );
        this.direction = Direction.Right;
    }

    start(): void {
        this.restart();
        setInterval(() => {
            this.tick()
        }, this.speed)
    }

    tick(): void {
        this.printScore();
        this.move();
        this.snakeLenght();
        this.draw();
        this.eat();
        if (this.snakeIsOutside() || this.snakeCollision())
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

        this.context.fillRect(this.food.x, this.food.y, this.food.width, this.food.height);
    }

    move(): void {
        this.snake.head.tail.tailFollows(this.snake.head);

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

    eat(): void {
        let snake = this.snake.head,
            food = this.food;

        if (snake.x === food.x && snake.y === food.y) {
            snake.tail.newTail();
            food.x = this.spawnFood(Axis.x);
            food.y = this.spawnFood(Axis.y);
            this.score++;
        }
    }

    printScore(): void {
        this.scoreOutput.innerHTML = 'Score: ' + this.score*10;
    }

    spawnFood(axis: Axis): number {
        let randomize = (range: number) => {
            return Math.floor(Math.floor((Math.random() * range))/10)*10
        };

        switch (axis) {
            case Axis.x:
                return randomize(this.canvas.width);

            case Axis.y:
                return randomize(this.canvas.height);
        }
    }

    snakeLenght(): void {
        this.snake.snakeArray = [];
        let snake = this.snake.head.tail;

         while (snake != null) {
             this.snake.snakeArray.push({x: snake.x, y: snake.y});
             snake = snake.tail
         }
    }

    snakeCollision(): boolean {
        let array = this.snake.snakeArray,
            snake = this.snake.head,
            result = false;

        array.forEach((elem) => {
            if (elem.x == snake.x && elem.y == snake.y) {
                result = true;
            }
        });

        return result;
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
            || this.snake.head.y <= -1
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

    var el = <HTMLCanvasElement> document.getElementById('game-canvas'),
        score = document.getElementById('score');
    game = new SnakeGame(el, score);
    game.start();
};