/**
 * API layer skeleton (not wired). Use as an adapter over existing APIClient later.
 */
export const ApiStub = {
    generateImage: async (prompt, options) => {
        throw new Error('ApiStub.generateImage not implemented');
    },
    generateAudio: async (text, options) => {
        throw new Error('ApiStub.generateAudio not implemented');
    },
    optimizeText: async (text) => {
        throw new Error('ApiStub.optimizeText not implemented');
    },
    translateText: async (text, lang) => {
        throw new Error('ApiStub.translateText not implemented');
    }
};


