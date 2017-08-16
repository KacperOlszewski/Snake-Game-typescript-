import { Snake } from './utils/snake';
import { Food } from './utils/food';
import { constants } from './utils/game-constants';
import { CanvasController } from './utils/canvas-controller';
import { MovementController } from './utils/movement-controller';
import { CollisionController } from './utils/collision-controller';

export class SnakeGameComponent {
    private canvasController: CanvasController;
    private movementController: MovementController;
    private collisionsController: CollisionController;

    private score: number;
    private highScore: number;
    private points: number;
    private level: number;
    private bonusMode: boolean;
    private bonusModeDuration: number;
    private speed: number;
    private step = 10;
    private interval: any;
    private snake: Snake;
    private food: Food;

    constructor(
        private canvas: HTMLCanvasElement,
        private scoreOutput: HTMLElement,
        private levelOutput: HTMLElement,
        private gameWidth: number,
        private gameHeight: number

    ) {
        this.movementController = new MovementController(this.step);
        this.collisionsController = new CollisionController(this.step, this.gameWidth, this.gameHeight);
        this.init();
    }

    init() {
        this.setupGame();
        this.startGame();
    }

    stop() {
        this.stopGame();
        this.setHighScore();
    }

    private setupGame() {
        this.canvas.width = this.gameWidth;
        this.canvas.height = this.gameHeight;
        this.canvasController = new CanvasController(this.canvas);
    }

    private startGame(): void {
        this.restart();
        this.startInterval();
        this.printLevel();
        this.printScore();
        this.movementController.setListener();
    }

    private stopGame() {
        this.endInterval();
        this.movementController.endListener();
    }

    private restart(): void {
        this.snake = new Snake();
        this.food = new Food(this.gameWidth, this.gameHeight);

        this.snake.snakeArray = [];
        this.points = 0;
        this.score = 0;
        this.level = 1;
        this.speed = constants.initialSpeed;
        this.bonusMode = false;
        this.bonusModeDuration = 0;

        this.canvasController.inject(this.snake, this.food);
        this.movementController.inject(this.snake);
        this.collisionsController.inject(this.snake);
    }

    private startInterval() {
        this.interval = setInterval(() => {
            this.tick();
        }, this.speed);
    }

    private endInterval() {
        clearInterval(this.interval);
    }

    private tick(): void {
        this.move();
        this.updateSnakeSize();
        this.draw();
        this.transparentWallsMode();
        this.eat();
        this.bonusTimer();
        if (this.snakeIsOutside() || this.snakeEatItself()) {
            this.setHighScore();
            this.restart();
            this.printScore();
            this.printLevel();
            this.endInterval();
            this.startInterval();
        }
    }

    private draw(): void {
        this.canvasController.render(
            this.bonusMode,
            this.bonusModeDuration
        );
    }

    private move(): void {
        this.movementController.moveSnake();
    }

    private updateSnakeSize(): void {
        this.snake.snakeSize();
    }

    private eat(): void {
        const snake = this.snake.head,
            food = this.food;

        if (snake.x === food.x && snake.y === food.y) {
            snake.newTail();
            this.activateBonus(food.bonusFood);
            this.food.reShufflePosition();
            this.food.bonusFoodShuffle(this.level);
            this.points++;
            this.printScore();
            this.changeLevel();
        }
    }

    private changeLevel() {
        if (this.points % constants.levelJump === 0) {
            this.level++;
            this.speed = this.speed - 4;

            this.endInterval();
            this.startInterval();
            this.printLevel();
            this.newLevelPulse();
        }
    }

    private printScore(): void {
        this.score = this.points * 10;
        this.scoreOutput.innerHTML = `Score: ${this.score}`;
    }

    private printLevel(): void {
        this.levelOutput.innerHTML = `Level: ${this.level}`;
    }

    private setHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
    }

    private snakeEatItself(): boolean {
        return this.snake.eatsItself();
    }

    private snakeIsOutside(): boolean {
        if (this.bonusMode) {
            return false;
        }

        return this.collisionsController.snakeIsOutside();
    }

    private transparentWallsMode() {
        if (!this.bonusMode) {
            return;
        }

        this.collisionsController.moveSnakeOnWallCollision();
    }

    private activateBonus(bonusFood: boolean) {
        if (bonusFood) {
            this.bonusMode = true;
            this.canvas.className = constants.canvasBonusCss;
            this.bonusModeDuration = constants.bonusDuration;
        }
    }

    private bonusTimer() {
        if (this.bonusMode && this.bonusModeDuration <= 0) {
            this.canvas.className = '';
            this.bonusMode = false;
        } else {
            this.bonusModeDuration--;
        }
    }

    private newLevelPulse() {
        this.levelOutput.className = constants.newLevelCss;
        setTimeout(
            () => this.levelOutput.className = '', 200
        );
    }
}
