declare global {
    function drawCircle(x: number, y: number, r: number, stroke: string, fill: string): void;
}

const canvas: HTMLCanvasElement = globalThis.canvas;
const context = canvas.getContext("2d")!;

globalThis.drawCircle = (x, y, r, stroke, fill) => {
    context.strokeStyle = stroke;
    context.fillStyle = fill;

    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.fill();
    context.stroke();
};

export {};
