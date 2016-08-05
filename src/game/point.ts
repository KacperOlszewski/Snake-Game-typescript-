export class Point {

    x: number;
    y: number;

    width: number;
    height: number;

    tail: Point;

    constructor(x: number, y: number, size: number = 9) {
        this.x = x;
        this.y = y;
        this.width = size;
        this.height = size;
    }

    tailFollows(parent: Point) {
        if (this.tail != null) {
            this.tail.tailFollows(this);
        }
        this.x = parent.x;
        this.y = parent.y;
    }

    newTail() {
        if (this.tail != null) {
            this.tail.newTail();
        } else {
            this.tail = new Point(this.x, this.y);
        }
    }
}

describe('_getElementDimensions', () => {
    it('should fetch', () => {
        let elementsMock = [{
            getBoundingClientRect: function () { return { height: 120, top: 700 }; }
        }];
        this.documentMock.nativeDocument = {
            getElementsByClassName: jasmine.createSpy('getElementsByClassName'),
            body: {
                offsetHeight: 900
            }
        };
        this.documentMock.nativeDocument.getElementsByClassName.and.returnValue(elementsMock);

        this.LessonFlowDirectiveInstance.onClick();

        expect(this.Renderer.setElementStyle).toHaveBeenCalledWith(
            elementsMock[0],
            'top',
            '600px'
        );
    });
});