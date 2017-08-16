import { Snake } from './snake';

export class CollisionController {
    private snake: Snake;

    constructor(
        private step: number,
        private gameWidth: number,
        private gameHeight: number
    ) {}

    inject(snake: Snake) {
        this.snake = snake;
    }

    snakeIsOutside(): boolean {
        return this.snake.head.x < 0
            || this.snake.head.y < -1
            || this.snake.head.x >= this.gameWidth
            || this.snake.head.y >= this.gameHeight;
    }

    moveSnakeOnWallCollision() {
        if (this.snake.head.x < 0) {
            this.snake.head.x = this.gameWidth - this.step;
        } else if (this.snake.head.x >= this.gameWidth) {
            this.snake.head.x = 0;
        } else if (this.snake.head.y < 0) {
            this.snake.head.y = this.gameHeight - this.step;
        } else if (this.snake.head.y >= this.gameHeight) {
            this.snake.head.y = 0;
        }
    }
}
