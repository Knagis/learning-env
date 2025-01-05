const modules = import.meta.glob("../src/*.ts");
const sidebar = document.getElementById("sidebar");

let current = location.hash.substring(1);

for (const path in modules) {
    if (!modules[current]) {
        current = path;
    }
    const url = document.createElement("a");
    url.textContent = path.substring(7);
    url.addEventListener("click", e => {
        location.href = "#" + path;
        location.reload();
    });
    sidebar.appendChild(url);

    if (current === path) {
        url.classList.add("selected");

    }
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const worker = new Worker(new URL("./worker.entry.ts", import.meta.url), { type: "module" });
const offscreen = canvas.transferControlToOffscreen();
worker.postMessage({ type: "init", script: current, canvas: offscreen }, [ offscreen ]);

let lastPing = performance.now();
worker.addEventListener("message", e => {
    if (e.data?.type === "ping") {
        lastPing = performance.now();
    }
});
const interval = setInterval(() => {
    if (performance.now() - lastPing > 1000) {
        worker.terminate();
        clearInterval(interval);
        document.getElementById("hang-popup").style.display = "block";
    }
}, 1000);

function forwardEvent(e: MouseEvent | PointerEvent) {
    worker.postMessage({ type: e.type, x: e.pageX, y: e.pageY });
}
canvas.addEventListener("click", forwardEvent);
canvas.addEventListener("pointermove", forwardEvent);
