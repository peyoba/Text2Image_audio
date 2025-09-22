/**
 * API 层骨架（未接入）。
 * 计划后续作为现有 APIClient 的适配层，统一对外接口。
 */
export const ApiStub = {
  generateImage: async (prompt, options) => {
    throw new Error("ApiStub.generateImage 尚未实现");
  },
  generateAudio: async (text, options) => {
    throw new Error("ApiStub.generateAudio 尚未实现");
  },
  optimizeText: async (text) => {
    throw new Error("ApiStub.optimizeText 尚未实现");
  },
  translateText: async (text, lang) => {
    throw new Error("ApiStub.translateText 尚未实现");
  },
};
