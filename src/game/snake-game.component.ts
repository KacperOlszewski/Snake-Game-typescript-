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
    private gameWidth = constants.gameWidth;
    private gameHeight = constants.gameHeight;
    private interval: any;
    private snake: Snake;
    private food: Food;

    constructor(
        private canvas: HTMLCanvasElement,
        private scoreOutput: HTMLElement,
        private levelOutput: HTMLElement
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

    setupGame() {
        this.canvas.width = this.gameWidth;
        this.canvas.height = this.gameHeight;

        this.canvasController = new CanvasController(this.canvas);
    }

    startGame(): void {
        this.restart();
        this.startInterval();
        this.printLevel();
        this.printScore();
        this.movementController.setListener();
    }

    stopGame() {
        this.endInterval();
        this.movementController.endListener();
    }

    restart(): void {
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

    startInterval() {
        this.interval = setInterval(() => {
            this.tick();
        }, this.speed);
    }

    endInterval() {
        clearInterval(this.interval);
    }

    tick(): void {
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

    draw(): void {
        this.canvasController.render(
            this.bonusMode,
            this.bonusModeDuration
        );
    }

    move(): void {
        this.movementController.moveSnake();
    }

    updateSnakeSize(): void {
        this.snake.snakeSize();
    }

    eat(): void {
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

    changeLevel() {
        if (this.points % constants.levelJump === 0) {
            this.level++;
            this.speed = this.speed - 4;

            this.endInterval();
            this.startInterval();
            this.printLevel();
            this.newLevelPulse();
        }
    }

    printScore(): void {
        this.score = this.points * 10;
        this.scoreOutput.innerHTML = `Score: ${this.score}`;
    }

    printLevel(): void {
        this.levelOutput.innerHTML = `Level: ${this.level}`;
    }

    setHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
    }

    snakeEatItself(): boolean {
        return this.snake.eatsItself();
    }

    snakeIsOutside(): boolean {
        if (this.bonusMode) {
            return false;
        }

        return this.collisionsController.snakeIsOutside();
    }

    transparentWallsMode() {
        if (!this.bonusMode) {
            return;
        }

        this.collisionsController.moveSnakeOnWallCollision();
    }

    activateBonus(bonusFood: boolean) {
        if (bonusFood) {
            this.bonusMode = true;
            this.bonusModeDuration = constants.bonusDuration;
        }
    }

    bonusTimer() {
        if (this.bonusMode) {
            (this.bonusModeDuration <= 0) ?
                this.bonusMode = false :
                this.bonusModeDuration--;
        }
    }

    newLevelPulse() {
        this.scoreOutput.className = "apply-pulse";
        setTimeout(
            () => this.scoreOutput.className = "", 200
        );
    }
}
