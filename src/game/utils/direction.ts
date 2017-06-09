export enum Direction {
    Left = 37,
    Right = 39,
    Up = 40,
    Down = 38
}

const oppositeDirectionMap: any = {
    [Direction.Left]: Direction.Right,
    [Direction.Right]: Direction.Left,
    [Direction.Up]: Direction.Down,
    [Direction.Down]: Direction.Up
};

export function getOppositeDirection(direction: Direction) {
    return oppositeDirectionMap[direction];
}
