/**
 * EventBus skeleton (not wired). Can be used later for decoupled communication.
 */
export class EventBus {
    constructor() {
        this.handlers = new Map(); // event -> Set<fn>
    }

    on(eventName, handler) {
        if (typeof handler !== 'function') return () => {};
        if (!this.handlers.has(eventName)) this.handlers.set(eventName, new Set());
        const set = this.handlers.get(eventName);
        set.add(handler);
        return () => {
            try { set.delete(handler); } catch (_) {}
        };
    }

    emit(eventName, detail) {
        const set = this.handlers.get(eventName);
        if (!set || set.size === 0) return 0;
        let count = 0;
        for (const fn of set) {
            try { fn(detail); count++; } catch (_) {}
        }
        return count;
    }

    clear(eventName) {
        if (eventName) {
            this.handlers.delete(eventName);
        } else {
            this.handlers.clear();
        }
    }
}

export const createEventBus = () => new EventBus();

/**
 * Event bus skeleton (not wired). Safe to import later.
 */
export class EventBus {
    constructor() {
        this.map = new Map();
    }

    on(eventName, handler) {
        if (!this.map.has(eventName)) this.map.set(eventName, new Set());
        this.map.get(eventName).add(handler);
        return () => this.off(eventName, handler);
    }

    off(eventName, handler) {
        const set = this.map.get(eventName);
        if (set) set.delete(handler);
    }

    emit(eventName, payload) {
        const set = this.map.get(eventName);
        if (!set) return;
        for (const handler of set) {
            try { handler(payload); } catch (_) {}
        }
    }
}

export const createEventBus = () => new EventBus();


