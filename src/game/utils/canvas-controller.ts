import { Snake } from './snake';
import { Food } from './food';
import { randomBlue } from '../snake-game.helpers';
import { constants } from './game-constants';

export class CanvasController {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private snake: Snake;
    private food: Food;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
    }

    inject(snake: Snake, food: Food) {
        this.snake = snake;
        this.food = food;
    }

    render(bonusMode: boolean, bonusModeTimeLeft: number): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTimer(bonusMode, bonusModeTimeLeft);
        this.drawSnake(bonusMode);
        this.drawFood();

    }

    private drawSnake(bonusMode: boolean) {
        let snake = this.snake.head;

        this.context.fillStyle = constants.snakeColor;

        while (snake != null) {
            this.context.fillRect(snake.x, snake.y, snake.width, snake.height);
            this.context.fillStyle = bonusMode ? randomBlue() : constants.snakeColor;
            snake = snake.tail;
        }
    }

    private drawFood() {
        this.context.fillStyle = this.food.bonusFood ? constants.bonusFoodColor : constants.foodColor;
        this.context.fillRect(this.food.x, this.food.y, this.food.width, this.food.height);
    }

    private drawTimer(isBonusMode: boolean, bonusModeTimeLeft: number) {
        if (isBonusMode) {
            this.context.beginPath();
            this.context.arc(
                this.canvas.width - 25,
                this.canvas.height - 25,
                10,
                2 * (constants.bonusDuration - bonusModeTimeLeft / constants.bonusDuration) * Math.PI,
                2 * Math.PI
            );
            this.context.lineWidth = 2;
            this.context.strokeStyle = constants.snakeColor;
            this.context.stroke();
            this.context.closePath();
        }
    }
}
