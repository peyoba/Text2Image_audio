/**
 * 事件总线骨架（未接入）。
 * 用于后续实现解耦的模块间通信，当前仅提供最小能力。
 */
export class EventBus {
  constructor() {
    this.handlers = new Map(); // 事件名 -> 订阅函数集合
  }

  on(eventName, handler) {
    if (typeof handler !== "function") return () => {};
    if (!this.handlers.has(eventName)) this.handlers.set(eventName, new Set());
    const set = this.handlers.get(eventName);
    set.add(handler);
    return () => {
      // 取消订阅
      try {
        set.delete(handler);
      } catch (_) {}
    };
  }

  emit(eventName, detail) {
    const set = this.handlers.get(eventName);
    if (!set || set.size === 0) return 0;
    let count = 0;
    for (const fn of set) {
      try {
        fn(detail);
        count++;
      } catch (_) {}
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
