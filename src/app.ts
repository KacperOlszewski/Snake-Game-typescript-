import { Point } from './game/point';
import { Snake } from './game/snake';
import { Axis, Direction, snakeArray } from './game/helpers';
import './style.scss';


class SnakeGame {
    canvas: HTMLCanvasElement;
    scoreOutput: HTMLElement;
    context: CanvasRenderingContext2D;
    Players: Snake[];
    snake: Snake;
    snakePositions: snakeArray[];
    food: Point;
    score: number;
    speed: number = 80;
    step: number;

    constructor(canvas: HTMLCanvasElement, scoreOutput: HTMLElement) {
        this.canvas = canvas;
        this.canvas.width = 450;
        this.canvas.height = 300;
        this.step = 10;
        this.scoreOutput = scoreOutput;
        this.context = this.canvas.getContext("2d");
    }

    restart(): void {
        this.Players = [
            new Snake(50, 50, Direction.Right),
            new Snake(100, 120, Direction.Right, 'BADA55')
        ];
        this.snakePositions = [];
        this.food = new Point(
            this.spawnFood(Axis.x),
            this.spawnFood(Axis.y)
        );
    }

    start(): void {
        this.restart();
        setInterval(() => {
            this.tick()
        }, this.speed)
    }

    tick(): void {
        this.snakeLenght();
        this.move();
        if (this.snakeIsOutside() || this.snakeCollision()) {
            this.restart();
        }
        this.eat();
        this.draw();
    }

    draw(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "#000000";

        this.Players.forEach((player) => {
            let snake = player.head;

            while (snake != null) {
                this.context.fillRect(snake.x, snake.y, snake.width, snake.height);
                snake = snake.tail;
            }
        });

        this.context.fillRect(this.food.x, this.food.y, this.food.width, this.food.height);
    }

    move(): void {
        this.Players.forEach((snake) => {
            snake.move();
        });
    }

    eat(): void {
        const food = this.food;

        this.Players.some((snake) => {
            if (snake.eat(food)) {
                food.x = this.spawnFood(Axis.x);
                food.y = this.spawnFood(Axis.y);

                return true;
            } else {
                return false;
            }
        });
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
        this.snakePositions = [];

        this.Players.forEach((snake) => {
            let shlong = snake.head.tail;

            while (shlong != null) {
                this.snakePositions.push({x: shlong.x, y: shlong.y});
                shlong = shlong.tail;
            }
        });
    }

    snakeCollision(): boolean {
        return this.Players.some((elem) => {
            return elem.snakeCollision(this.snakePositions)
        });
    }

    snakeIsOutside(): boolean {
        return this.Players.some((snake) => {
            return snake.snakeIsOutside(this.canvas);
        });
    }

    changeDirection(e: KeyboardEvent) {
        var key = e.keyCode;

        switch (key) {
            case 39:
                if (this.Players[0].direction != Direction.Left)
                    this.Players[0].direction = Direction.Right;
                break;
            case 40:
                if (this.Players[0].direction != Direction.Down)
                    this.Players[0].direction = Direction.Up;
                break;
            case 37:
                if (this.Players[0].direction != Direction.Right)
                    this.Players[0].direction = Direction.Left;
                break;
            case 38:
                if (this.Players[0].direction != Direction.Up)
                    this.Players[0].direction = Direction.Down;
                break;

            case 68:
                if (this.Players[1].direction != Direction.Left)
                    this.Players[1].direction = Direction.Right;
                break;
            case 83:
                if (this.Players[1].direction != Direction.Down)
                    this.Players[1].direction = Direction.Up;
                break;
            case 65:
                if (this.Players[1].direction != Direction.Right)
                    this.Players[1].direction = Direction.Left;
                break;
            case 87:
                if (this.Players[1].direction != Direction.Up)
                    this.Players[1].direction = Direction.Down;
                break;
        }
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