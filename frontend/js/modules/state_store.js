/**
 * 轻量级状态存储骨架（未接入）。
 * 仅提供基础的状态读写与订阅能力，后续逐步接入以避免回归。
 */
export class StateStore {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.listeners = new Set(); // 订阅者集合
  }

  getState() {
    return { ...this.state }; // 返回浅拷贝，避免外部直接修改
  }

  setState(partial) {
    if (!partial || typeof partial !== "object") return; // 忽略非法入参
    this.state = { ...this.state, ...partial };
    // 广播变更
    for (const cb of this.listeners) {
      try {
        cb(this.getState());
      } catch (_) {}
    }
  }

  subscribe(callback) {
    if (typeof callback !== "function") return () => {};
    this.listeners.add(callback);
    // 返回取消订阅函数
    return () => this.listeners.delete(callback);
  }
}

export const createStateStore = (initial) => new StateStore(initial);
