class AppEventEmitter {
    private listeners: { [key: string]: Function[] } = {};

    on(event: string, listener: Function) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
    }

    off(event: string, listener: Function) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(
            (l) => l !== listener
        );
    }

    emit(event: string, ...args: any[]) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach((listener) => listener(...args));
    }
}

export const eventEmitter = new AppEventEmitter();
