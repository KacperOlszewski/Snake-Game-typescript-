import { Observable } from 'rxjs/Rx';

export function keyDownObservableStream() {
    return Observable
        .fromEvent(document, 'keydown')
        .map((e: KeyboardEvent) => e.keyCode);
}

export function filterKeys(...keyCodes: number[]) {
    return (keyCode: number) => {
        return keyCodes.some(arrow => keyCode === arrow);
    };
}

export function randomize(range: number) {
    return Math.floor(Math.floor((Math.random() * range)) / 10) * 10;
}

export function randomBlue() {
    const opacity = 0.35 + Math.random() * 0.65;
    return `rgba(0,127,163,${opacity})`;
}
