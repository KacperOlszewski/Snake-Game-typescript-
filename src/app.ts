import { Point } from './game/point';
import { Snake } from './game/snake';
import { Axis, Direction, snakeArray } from './game/helpers';
import './style.scss';


class SnakeGame {
    playerNumber: number;
    canvas: HTMLCanvasElement;
    scoreOutput: HTMLElement;
    context: CanvasRenderingContext2D;
    Players: Snake[];
    snakePositions: snakeArray[];
    food: Point[];
    score: number;
    speed: number = 1100;
    step: number;

    constructor(playersConstruction: number, canvas: HTMLCanvasElement, scoreOutput: HTMLElement) {
        this.playerNumber = playersConstruction;
        this.canvas = canvas;
        this.canvas.width = 500;
        this.canvas.height = 450;
        this.step = 10;
        this.scoreOutput = scoreOutput;
        this.context = this.canvas.getContext("2d");
    }

    restart(): void {
        this.snakePositions = [];
        this.Players = [];
        this.food = [];

        for (let i = 0; i < this.playerNumber; i++) {
            let X = this.spawnFood(Axis.x),
                Y = this.spawnFood(Axis.y),
                direction = X < this.canvas.width/2 ? Direction.Right : Direction.Left;

            this.Players.push(new Snake(i, X, Y, direction, this.getRandomColor()));
        }

        for (let i = 0; i <= this.playerNumber; i++) {
            let X = this.spawnFood(Axis.x),
                Y = this.spawnFood(Axis.y);

            this.food.push(new Point(X, Y));
        }
    }

    start(): void {
        this.restart();
        setInterval(() => {
            this.tick()
        }, this.speed)
    }

    tick(): void {
        this.draw();
        this.move();
        this.snakeCollision();
        this.snakeLenght();
        if (this.snakeIsOutside()) {
            this.restart();
        }
        this.eat();
    }

    draw(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.Players.forEach((player) => {
            this.context.beginPath();
            this.context.fillStyle = player.color;

            let snake = player.head;

            while (snake != null) {
                this.context.fillRect(snake.x, snake.y, snake.width, snake.height);
                snake = snake.tail;
            }
            this.context.closePath();
        });
        this.food.forEach((food) => {
            this.context.beginPath();
            this.context.fillStyle = '#5bc236';
            this.context.fillRect(food.x, food.y, food.width, food.height);
            this.context.closePath();
        });
    }

    move(): void {
        this.Players.forEach((snake) => {
            snake.move();
        });
    }

    eat(): void {
        this.Players.forEach((snake) => {
            if (snake.eat(this.food) > -1) {
                let foodIndex = snake.eat(this.food);

                this.food[foodIndex].x = this.spawnFood(Axis.x);
                this.food[foodIndex].y = this.spawnFood(Axis.y);
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
            let body = snake.head.tail;

            while (body != null) {
                this.snakePositions.push({x: body.x, y: body.y});
                body = body.tail;
            }
        });
    }

    snakeCollision(): void {
        this.Players.forEach((elem, index) => {
            if (elem.snakeCollision(this.snakePositions, this.snakeHead(index))) {
                this.Players.length <= 2 ? this.restart() : this.Players.splice(index, 1)
            }
        });
    }

    snakeHead(snakeNumber: number): snakeArray[] {
        let heads: snakeArray[] = [];

        for (let i = 0; i < this.Players.length; i++) {
            if (i != snakeNumber) {
                heads.push({
                    x: this.Players[i].head.x,
                    y: this.Players[i].head.y
                })
            }
        }
        return heads;
    }

    snakeIsOutside(): boolean {
        return this.Players.some((snake) => {
            return snake.snakeIsOutside(this.canvas);
        });
    }

    getRandomColor() {
        let letters = '0123456789ABCDEF',
            color = '#';

        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
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
    game = new SnakeGame(5, el, score);
    game.start();
};