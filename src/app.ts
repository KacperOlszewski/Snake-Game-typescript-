import { SnakeGameComponent } from './game/snake-game.component';
import './style.scss';

window.onload = () => {
    const
        canvas = <HTMLCanvasElement>document.getElementById('game-canvas'),
        score = document.getElementById('score'),
        level = document.getElementById('score');

    const game = new SnakeGameComponent(canvas, score, level)
};