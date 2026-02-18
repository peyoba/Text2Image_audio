/**
 * 高清图片缓存管理模块
 * 实现不压缩的高清图片存储，24小时自动过期
 */

/**
 * 高清图片缓存管理器
 */
class HDImageCacheManager {
  constructor(env) {
    this.env = env;
    this.maxImagesPerDay = 3; // 每天3张高清图片
    this.maxImageSize = 2 * 1024 * 1024; // 2MB限制（高清图片）
    this.cacheExpiration = 86400; // 24小时
  }

  /**
   * 生成缓存键
   * @param {string} userId - 用户ID
   * @returns {string} 缓存键
   */
  getCacheKey(userId) {
    const today = new Date().toISOString().split("T")[0];
    return `hd_images:${userId}:${today}`;
  }

  /**
   * 生成图片ID
   * @returns {string} 图片ID
   */
  generateImageId() {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 保存高清图片
   * @param {string} userId - 用户ID
   * @param {Object} imageData - 图片数据
   * @returns {Promise<Object>} 保存结果
   */
  async saveHDImage(userId, imageData) {
    try {
      const cacheKey = this.getCacheKey(userId);
      // eslint-disable-next-line no-unused-vars
      const today = new Date().toISOString().split("T")[0];

      // 获取今天的图片列表
      const dailyImages = (await this.env.IMAGES_CACHE.get(cacheKey, "json")) || [];

      // 检查文件大小（base64解码后）
      const sizeInBytes = Math.ceil((imageData.data.length * 3) / 4);
      if (sizeInBytes > this.maxImageSize) {
        throw new Error("图片太大，请重试（最大2MB）");
      }

      // 检查数量限制
      if (dailyImages.length >= this.maxImagesPerDay) {
        // 删除最旧的图片
        dailyImages.shift();
      }

      // 保存高清图片（不压缩）
      const newImage = {
        id: this.generateImageId(),
        prompt: imageData.prompt,
        data: imageData.data, // 原始高清base64数据
        width: imageData.width,
        height: imageData.height,
        seed: imageData.seed,
        model: imageData.model,
        negative: imageData.negative,
        created_at: new Date().toISOString(),
        size: sizeInBytes,
        quality: "HD", // 标记为高清
      };

      dailyImages.push(newImage);

      // 保存到KV（24小时过期）
      await this.env.IMAGES_CACHE.put(cacheKey, JSON.stringify(dailyImages), {
        expirationTtl: this.cacheExpiration,
      });

      return {
        success: true,
        id: newImage.id,
        prompt: newImage.prompt,
        created_at: newImage.created_at,
        size: newImage.size,
        quality: newImage.quality,
      };
    } catch (error) {
      console.error("保存高清图片错误:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 获取高清图片
   * @param {string} userId - 用户ID
   * @param {string} imageId - 图片ID
   * @returns {Promise<Object>} 图片数据
   */
  async getHDImage(userId, imageId) {
    try {
      const cacheKey = this.getCacheKey(userId);
      const dailyImages = (await this.env.IMAGES_CACHE.get(cacheKey, "json")) || [];

      const image = dailyImages.find((img) => img.id === imageId);
      if (!image) {
        throw new Error("图片不存在或已过期");
      }

      return {
        success: true,
        image: image,
      };
    } catch (error) {
      console.error("获取高清图片错误:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 获取用户今天的图片列表（不包含图片数据，只返回元数据）
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 图片列表
   */
  async getDailyImageList(userId) {
    try {
      const cacheKey = this.getCacheKey(userId);
      const dailyImages = (await this.env.IMAGES_CACHE.get(cacheKey, "json")) || [];

      // 只返回元数据，不包含图片数据
      const imageList = dailyImages.map((img) => ({
        id: img.id,
        prompt: img.prompt,
        width: img.width,
        height: img.height,
        seed: img.seed,
        model: img.model,
        created_at: img.created_at,
        size: img.size,
        quality: img.quality,
      }));

      return {
        success: true,
        images: imageList,
        count: imageList.length,
        maxCount: this.maxImagesPerDay,
      };
    } catch (error) {
      console.error("获取图片列表错误:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 删除指定图片
   * @param {string} userId - 用户ID
   * @param {string} imageId - 图片ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteImage(userId, imageId) {
    try {
      const cacheKey = this.getCacheKey(userId);
      let dailyImages = (await this.env.IMAGES_CACHE.get(cacheKey, "json")) || [];

      const originalLength = dailyImages.length;
      dailyImages = dailyImages.filter((img) => img.id !== imageId);

      if (dailyImages.length === originalLength) {
        throw new Error("图片不存在");
      }

      // 保存更新后的列表
      await this.env.IMAGES_CACHE.put(cacheKey, JSON.stringify(dailyImages), {
        expirationTtl: this.cacheExpiration,
      });

      return {
        success: true,
        message: "图片删除成功",
      };
    } catch (error) {
      console.error("删除图片错误:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 获取用户图片统计信息
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 统计信息
   */
  async getUserImageStats(userId) {
    try {
      const cacheKey = this.getCacheKey(userId);
      const dailyImages = (await this.env.IMAGES_CACHE.get(cacheKey, "json")) || [];

      const totalSize = dailyImages.reduce((sum, img) => sum + img.size, 0);

      return {
        success: true,
        stats: {
          totalImages: dailyImages.length,
          maxImages: this.maxImagesPerDay,
          remainingImages: this.maxImagesPerDay - dailyImages.length,
          totalSize: totalSize,
          maxSize: this.maxImagesPerDay * this.maxImageSize,
          today: new Date().toISOString().split("T")[0],
        },
      };
    } catch (error) {
      console.error("获取统计信息错误:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

/**
 * 中间件：验证图片访问权限
 * @param {Request} request - HTTP请求
 * @param {Object} env - 环境变量
 * @returns {Promise<Object|null>} 用户信息或null
 */
async function authenticateImageAccess(request, env) {
  const { extractTokenFromRequest, validateUserToken } = await import("./auth.js");

  const token = extractTokenFromRequest(request);
  if (!token) {
    return null;
  }

  const result = await validateUserToken(token, env);
  return result.success ? result.user : null;
}

// 导出模块
export { HDImageCacheManager, authenticateImageAccess };
