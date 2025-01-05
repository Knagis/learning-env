declare global {
    function initGrid(rows: number, columns: number, size?: number): void;

    function setColor(x: number, y: number, color: string): void;
    function getColor(x: number, y: number): string;

    function onClick(callback: (x, y) => void): void;
    function onEnter(callback: (x, y) => void): void;
    function onLeave(callback: (x, y) => void): void;
}

const canvasEvents: EventTarget = globalThis.events;
const gridEvents: EventTarget = new EventTarget();
const canvas: HTMLCanvasElement = globalThis.canvas;
const context = canvas.getContext("2d")!;

let _offsetX = 100;
let _offsetY = 100;
let _rows = 0;
let _columns = 0;
let _size = 0;
const colors = new Array<string>();

let _lastX = -1;
let _lastY = -1;

class GridCellEvent extends Event {
    public constructor(type: string, public x: number, public y: number) {
        super(type);
    }
}

globalThis.initGrid = (rows, columns, size = 40) => {
    _rows = rows;
    _columns = columns;
    _size = size;

    context.strokeStyle = "black";
    context.lineWidth = 1;

    context.beginPath();
    for (let x = 0; x <= columns; x++) {
        context.moveTo(_offsetX + x * size + .5, _offsetY + .5);
        context.lineTo(_offsetX + x * size + .5, _offsetY + rows * size + .5);
    }
    for (let y = 0; y <= rows; y++) {
        context.moveTo(_offsetX + .5, _offsetY + y * size + .5);
        context.lineTo(_offsetX + columns * size + .5, _offsetY + y * size + .5);
    }
    context.stroke();
};

globalThis.getColor = (x, y) => {
    if (x >= 0 && x < _columns && y >= 0 && y < _rows) {
        return colors[y * _columns + x] || "white";
    }
    return "white";
};

globalThis.setColor = (x, y, color) => {
    context.fillStyle = color;

    if (x >= 0 && x < _columns && y >= 0 && y < _rows) {
        colors[y * _columns + x] = color;
    }

    context.beginPath();
    context.fillRect(_offsetX + x * _size + 1, _offsetY + y * _size + 1, _size - 1, _size - 1);
}

globalThis.onEnter = (callback) => {
    gridEvents.addEventListener("enter", (e: GridCellEvent) => {
        callback(e.x, e.y);
    });
}

globalThis.onLeave = (callback) => {
    gridEvents.addEventListener("leave", (e: GridCellEvent) => {
        callback(e.x, e.y);
    });
}

globalThis.onClick = (callback) => {
    gridEvents.addEventListener("click", (e: GridCellEvent) => {
        callback(e.x, e.y);
    });
}

canvasEvents.addEventListener("pointermove", (e: PointerEvent) => {
    let x = Math.floor((e.x - _offsetX) / _size);
    let y = Math.floor((e.y - _offsetY) / _size);

    if (x < 0 || x >= _columns || y < 0 || y >= _rows) {
        x = -1;
        y = -1;
    }

    if (_lastX !== x || _lastY !== y) {
        if (_lastX !== -1 && _lastY !== -1) {
            gridEvents.dispatchEvent(new GridCellEvent("leave", _lastX, _lastY));
        }

        if (x !== -1 && y !== -1) {
            gridEvents.dispatchEvent(new GridCellEvent("enter", x, y));
        }

        _lastX = x;
        _lastY = y;
    }
});

canvasEvents.addEventListener("click", (e: PointerEvent) => {
    const x = Math.floor((e.x - _offsetX) / _size);
    const y = Math.floor((e.y - _offsetY) / _size);

    if (x >= 0 && x < _columns && y >= 0 && y < _rows) {
        gridEvents.dispatchEvent(new GridCellEvent("click", x, y));
    }
});

export { };
