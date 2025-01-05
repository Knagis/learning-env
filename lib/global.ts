declare global {
    // hide globals we don't want to show up in intellisense

    /** @deprecated */
    module globalThis {
    }

    /** @deprecated */
    // @ts-expect-error
    module undefined {}
}

export {};
