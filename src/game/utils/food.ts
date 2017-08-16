import { Point } from './point';
import { randomize } from '../snake-game.helpers';

export class Food extends Point {
    bonusFood = false;

    constructor(private canvasWidth: number, private canvasHeight: number) {
        super();
        this.reShufflePosition();
        this.bonusFoodShuffle(1);
    }

    reShufflePosition() {
        this.x = randomize(this.canvasWidth);
        this.y = randomize(this.canvasHeight);
    }

    bonusFoodShuffle(level: number) {
        this.bonusFood = randomize(200) <= level * 10;
    }
}
