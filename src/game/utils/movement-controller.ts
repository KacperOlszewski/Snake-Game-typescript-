import { Observable, Subscription } from 'rxjs';

import { Snake } from './snake';
import { Direction, getOppositeDirection } from './direction';
import { keyDownObservableStream, filterKeys } from '../snake-game.helpers';

export class MovementController {

    private keyStream: Observable<Direction>;
    private keyStreamSubscription: Subscription;

    private snake: Snake;
    private moveSequence: Direction[];

    constructor(private step: number) {
        this.keyStream = keyDownObservableStream()
            .filter(filterKeys(37, 38, 39, 40))
            .filter((dir: Direction) => this.prevent180Turn(dir));
    }

    inject(snake: Snake) {
        this.snake = snake;
        this.moveSequence = [];
    }

    setListener() {
        this.keyStreamSubscription = this.keyStream.subscribe(
            e => this.changeDirection(e)
        );
    }

    endListener() {
        this.keyStreamSubscription.unsubscribe();
    }

    moveSnake(): void {
        this.snake.head.tail.tailFollows(this.snake.head);

        const nextMove = this.getNextMove();

        switch (nextMove) {
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

        this.moveSequence.shift();
    }

    private changeDirection(direction: Direction) {
        if (this.moveSequence[0]) {
            this.moveSequence[1] = direction;
        } else {
            this.moveSequence.push(direction);
        }
        this.snake.direction = direction;
    }

    private prevent180Turn(direction: Direction) {
        const lastMove = this.getLastMove();
        const lastMoveOpposite = getOppositeDirection(lastMove);

        return direction !== lastMoveOpposite;
    }

    private getNextMove() {
        return this.moveSequence[0] ?
            this.moveSequence[0] :
            this.snake.direction;
    }

    private getLastMove() {
        return this.moveSequence[0] ?
            this.moveSequence[this.moveSequence.length - 1] :
            this.snake.direction;
    }
}
