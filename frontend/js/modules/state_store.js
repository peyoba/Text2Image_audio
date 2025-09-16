/**
 * Lightweight state store skeleton (not wired). Safe to import later.
 */
export class StateStore {
    constructor(initialState = {}) {
        this.state = { ...initialState };
        this.listeners = new Set();
    }

    getState() {
        return { ...this.state };
    }

    setState(partial) {
        if (!partial || typeof partial !== 'object') return;
        this.state = { ...this.state, ...partial };
        for (const cb of this.listeners) {
            try { cb(this.getState()); } catch (_) {}
        }
    }

    subscribe(callback) {
        if (typeof callback !== 'function') return () => {};
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }
}

export const createStateStore = (initial) => new StateStore(initial);


