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
    food: Point[];
    score: number;
    speed: number = 200;
    step: number;

    constructor(canvas: HTMLCanvasElement, scoreOutput: HTMLElement, playersConstruction: number) {
        this.canvas = canvas;
        this.canvas.width = 500;
        this.canvas.height = 450;
        this.step = 10;
        this.scoreOutput = scoreOutput;
        this.context = this.canvas.getContext("2d");
    }

    restart(): void {
        this.snakePositions = [];
        this.Players = [
            new Snake('Player 1' , 50, 50, Direction.Right),
            new Snake('Player 2', 100, 260, Direction.Right, 'BADA55')
        ];
        this.food = [
            new Point(this.spawnFood(Axis.x), this.spawnFood(Axis.y)),
            new Point(this.spawnFood(Axis.x), this.spawnFood(Axis.y)),
            new Point(this.spawnFood(Axis.x), this.spawnFood(Axis.y))
        ];
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
        this.food.forEach((food) => {
            this.context.fillRect(food.x, food.y, food.width, food.height);
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

                console.log(foodIndex);

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
            let body = snake.head.tail,
                head = snake.head;

            while (body != null) {
                this.snakePositions.push({x: body.x, y: body.y});
                body = body.tail;
            }


        });
    }

    snakeCollision(): boolean {
        return this.Players.some((elem, index) => {
            return elem.snakeCollision(this.snakePositions, this.snakeHead(index))
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

    changeDirection(e: KeyboardEvent) {
        var key = e.keyCode;

        switch (key) {
            case 39:
                if (this.Players[0].direction != Direction.Left)
                    this.Players[0].direction = Direction.Right;
                break;
            case 40:
                console.log(key);
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
    game = new SnakeGame(el, score, 2);
    game.start();
};