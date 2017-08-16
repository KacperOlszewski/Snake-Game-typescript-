import { SnakeGameComponent } from './game/snake-game.component';
import './style.scss';

window.onload = () => {
    const
        canvas = <HTMLCanvasElement>document.getElementById('game-canvas'),
        score = document.getElementById('score'),
        level = document.getElementById('level');

    const game = new SnakeGameComponent(canvas, score, level, 300, 300)
};