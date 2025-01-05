const eventTarget = globalThis.events = new EventTarget();

class ForwardedEvent extends Event {
    public constructor(type: string, eventInitDict: any) {
        super(type, eventInitDict);

        const { type: foo, ...args } = eventInitDict;
        Object.assign(this, args);
    }
}

globalThis.addEventListener("message", e => {
    const type = e.data?.type;
    if (!type) {
        return;
    }

    if (type === "init") {
        (globalThis as any).canvas = e.data.canvas;
        const script = e.data.script;
        import(/* @vite-ignore */ e.data.script).then(() => {
            console.log("Loaded", e.data.script);
        });
    }

    eventTarget.dispatchEvent(new ForwardedEvent(type, e.data));
});

setInterval(() => {
    postMessage({ type: "ping" });
}, 100);
