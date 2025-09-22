/**
 * 用户认证模块
 * 处理用户注册、登录、JWT token生成和验证
 */

import { createHash, randomBytes } from "node:crypto";

// --- Standard JWT (HS256 + base64url, WebCrypto) ---
function base64urlEncode(bytes) {
  const str = typeof bytes === "string" ? bytes : String.fromCharCode(...new Uint8Array(bytes));
  return btoa(str).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64urlEncodeJSON(obj) {
  return base64urlEncode(JSON.stringify(obj));
}

function base64urlDecodeToString(b64url) {
  const b64 = b64url
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(b64url.length / 4) * 4, "=");
  return atob(b64);
}

async function hmacSha256(keyRaw, data) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(keyRaw),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return new Uint8Array(sig);
}

async function generateJWT(payload, secret, expiresIn = 604800) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claims = { ...payload, iat: now, exp: now + expiresIn };
  const encodedHeader = base64urlEncodeJSON(header);
  const encodedClaims = base64urlEncodeJSON(claims);
  const signingInput = `${encodedHeader}.${encodedClaims}`;
  const signature = await hmacSha256(secret, signingInput);
  const encodedSignature = base64urlEncode(signature);
  return `${encodedHeader}.${encodedClaims}.${encodedSignature}`;
}

async function verifyJWT(token, secret) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [encodedHeader, encodedClaims, encodedSignature] = parts;
    const signingInput = `${encodedHeader}.${encodedClaims}`;
    const sigBytes = await hmacSha256(secret, signingInput);
    const expected = base64urlEncode(sigBytes);
    if (expected !== encodedSignature) return null;
    const claimsStr = base64urlDecodeToString(encodedClaims);
    const claims = JSON.parse(claimsStr);
    const now = Math.floor(Date.now() / 1000);
    if (claims.exp && claims.exp < now) return null;
    return claims;
  } catch (e) {
    console.error("JWT验证错误:", e);
    return null;
  }
}

// Legacy custom JWT verification (compat only during transition)
function legacyVerifyJWT(token, secret) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [encodedHeader, encodedClaims, signature] = parts;
    const expectedSignature = createHash("sha256")
      .update(`${encodedHeader}.${encodedClaims}.${secret}`)
      .digest("hex");
    const decodedSignature = atob(signature);
    if (decodedSignature !== expectedSignature) return null;
    const claims = JSON.parse(atob(encodedClaims));
    const now = Math.floor(Date.now() / 1000);
    if (claims.exp && claims.exp < now) return null;
    return claims;
  } catch (_) {
    return null;
  }
}

/**
 * 生成密码哈希
 * @param {string} password - 明文密码
 * @param {string} salt - 盐值
 * @returns {string} 哈希后的密码
 */
function hashPassword(password, salt) {
  return createHash("sha256")
    .update(password + salt)
    .digest("hex");
}

/**
 * 生成随机盐值
 * @returns {string} 随机盐值
 */
function generateSalt() {
  return randomBytes(16).toString("hex");
}

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {Object} 验证结果
 */
function validatePassword(password) {
  const minLength = 6;
  const errors = [];
  if (!password || password.length < minLength) {
    errors.push(`密码长度至少${minLength}位`);
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 用户注册处理
 * @param {Object} userData - 用户数据
 * @param {Object} env - 环境变量
 * @returns {Promise<Object>} 注册结果
 */
export async function handleUserRegistration(userData, env) {
  try {
    const { username, email, password } = userData;

    // 验证输入数据
    if (!username || !email || !password) {
      return {
        success: false,
        error: "请填写所有必填字段",
      };
    }

    // 验证邮箱格式
    if (!validateEmail(email)) {
      return {
        success: false,
        error: "邮箱格式不正确",
      };
    }

    // 验证密码强度
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: passwordValidation.errors.join(", "),
      };
    }

    // 检查用户是否已存在
    const existingUser = await env.USERS.get(email);
    if (existingUser) {
      return {
        success: false,
        error: "该邮箱已被注册",
      };
    }

    // 生成盐值和密码哈希
    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);

    // 创建用户对象
    const user = {
      id: randomBytes(16).toString("hex"),
      username: username.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: hashedPassword,
      salt: salt,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
      isActive: true,
    };

    // 存储用户数据
    await env.USERS.put(email, JSON.stringify(user));

    // 生成JWT token
    const token = await generateJWT(
      { userId: user.id, email: user.email },
      env.JWT_SECRET || "your-secret-key",
      604800
    );

    // 返回用户信息（不包含敏感数据）
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };

    return {
      success: true,
      message: "注册成功",
      token: token,
      user: userResponse,
    };
  } catch (error) {
    console.error("用户注册错误:", error);
    return {
      success: false,
      error: "注册失败，请稍后重试",
    };
  }
}

/**
 * 用户登录处理
 * @param {Object} credentials - 登录凭据
 * @param {Object} env - 环境变量
 * @returns {Promise<Object>} 登录结果
 */
export async function handleUserLogin(credentials, env) {
  try {
    const { email, password } = credentials;

    // 验证输入数据
    if (!email || !password) {
      return {
        success: false,
        error: "请填写邮箱和密码",
      };
    }

    // 获取用户数据
    const userData = await env.USERS.get(email);
    if (!userData) {
      return {
        success: false,
        error: "邮箱或密码错误",
      };
    }

    const user = JSON.parse(userData);

    // 验证密码
    const hashedPassword = hashPassword(password, user.salt);
    if (hashedPassword !== user.passwordHash) {
      return {
        success: false,
        error: "邮箱或密码错误",
      };
    }

    // 检查用户状态
    if (!user.isActive) {
      return {
        success: false,
        error: "账户已被禁用",
      };
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date().toISOString();
    await env.USERS.put(email, JSON.stringify(user));

    // 生成JWT token
    const token = await generateJWT(
      { userId: user.id, email: user.email },
      env.JWT_SECRET || "your-secret-key",
      604800
    );

    // 返回用户信息（不包含敏感数据）
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };

    return {
      success: true,
      message: "登录成功",
      token: token,
      user: userResponse,
    };
  } catch (error) {
    console.error("用户登录错误:", error);
    return {
      success: false,
      error: "登录失败，请稍后重试",
    };
  }
}

/**
 * 验证token并获取用户信息
 * @param {string} token - JWT token
 * @param {Object} env - 环境变量
 * @returns {Promise<Object>} 验证结果
 */
export async function validateUserToken(token, env) {
  try {
    if (!token) {
      return {
        success: false,
        error: "缺少认证token",
        cause: "no_authorization_token",
      };
    }

    // 标准HS256验证，失败再尝试旧制式；不再允许“仅解析载荷放行”
    let claims = await verifyJWT(token, env.JWT_SECRET || "your-secret-key");
    let needIssueNewToken = false;
    const allowLegacy =
      String(env.JWT_ALLOW_LEGACY === undefined ? "true" : env.JWT_ALLOW_LEGACY).toLowerCase() !==
      "false";
    if (!claims) {
      if (allowLegacy) {
        const legacyClaims = legacyVerifyJWT(token, env.JWT_SECRET || "your-secret-key");
        if (!legacyClaims) {
          return {
            success: false,
            error: "token无效或已过期",
            cause: "jwt_invalid_or_expired",
          };
        }
        console.warn(
          "[Auth Warning] 使用了 legacy JWT 验证路径。建议设置 JWT_ALLOW_LEGACY=false 后逐步迁移。"
        );
        claims = legacyClaims;
        needIssueNewToken = true; // 触发轮转
      } else {
        return {
          success: false,
          error: "token无效或已过期",
          cause: "jwt_invalid_or_expired",
        };
      }
    }

    // 获取用户数据（统一按小写邮箱作为KV键），兼容旧键（原始大小写）
    const emailRaw = claims.email || "";
    const emailKey = emailRaw.toLowerCase();
    let userData = await env.USERS.get(emailKey);
    if (!userData) {
      // 兼容旧版本：尝试原始大小写键
      const legacyData = await env.USERS.get(emailRaw);
      if (legacyData) {
        // 迁移到小写键，保持向后兼容
        await env.USERS.put(emailKey, legacyData);
        userData = legacyData;
      } else {
        // KV 可能因最终一致性暂未可见：当签名有效但用户不存在时，基于claims构建最小用户并回填KV，避免首次Google登录后短时间401
        const minimalUser = {
          id: claims.userId,
          username: emailKey.split("@")[0],
          email: emailKey,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          isActive: true,
          authProvider: "google",
        };
        try {
          await env.USERS.put(emailKey, JSON.stringify(minimalUser));
        } catch (_) {}
        userData = JSON.stringify(minimalUser);
      }
    }
    if (!userData) {
      return {
        success: false,
        error: "用户不存在",
        cause: "user_not_found",
      };
    }

    const user = JSON.parse(userData);

    // 检查用户状态
    if (!user.isActive) {
      return {
        success: false,
        error: "账户已被禁用",
        cause: "user_disabled",
      };
    }

    // 返回用户信息（不包含敏感数据）
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };

    let rotatedToken;
    if (needIssueNewToken) {
      try {
        rotatedToken = await generateJWT(
          { userId: user.id, email: user.email },
          env.JWT_SECRET || "your-secret-key",
          604800
        );
      } catch (_) {}
    }

    return {
      success: true,
      user: userResponse,
      token: rotatedToken || undefined,
    };
  } catch (error) {
    console.error("Token验证错误:", error);
    return {
      success: false,
      error: "token验证失败",
      cause: "internal_error",
    };
  }
}

/**
 * 从请求头中提取token
 * @param {Request} request - HTTP请求
 * @returns {string|null} token或null
 */
export function extractTokenFromRequest(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // 兜底：尝试从 Cookie 中提取 auth_token
    try {
      const cookie = request.headers.get("Cookie") || request.headers.get("cookie") || "";
      const match = cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
      if (match) {
        return decodeURIComponent(match[1]);
      }
    } catch (_) {}
    return null;
  }
  return authHeader.substring(7);
}

/**
 * 中间件：验证用户认证
 * @param {Request} request - HTTP请求
 * @param {Object} env - 环境变量
 * @returns {Promise<Object|null>} 用户信息或null
 */
export async function authenticateUser(request, env) {
  const token = extractTokenFromRequest(request);
  if (!token) {
    return null;
  }

  const result = await validateUserToken(token, env);
  return result.success ? result.user : null;
}

/**
 * 生成重置密码token
 * @param {string} email - 用户邮箱
 * @returns {string} 重置token
 */
function generateResetToken(email) {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const data = `${email}:${timestamp}:${randomStr}`;
  return btoa(data).replace(/[+/=]/g, "");
}

/**
 * 验证重置密码token
 * @param {string} token - 重置token
 * @param {number} maxAge - token最大有效期（毫秒）
 * @returns {Object|null} 解码后的数据或null
 */
function verifyResetToken(token, maxAge = 24 * 60 * 60 * 1000) {
  // 24小时默认
  try {
    const decoded = atob(token);
    const [email, timestamp, randomStr] = decoded.split(":");

    if (!email || !timestamp || !randomStr) {
      return null;
    }

    const tokenTime = parseInt(timestamp);
    const now = Date.now();

    if (now - tokenTime > maxAge) {
      return null; // token已过期
    }

    return { email, timestamp: tokenTime, randomStr };
  } catch (error) {
    return null;
  }
}

/**
 * 处理忘记密码请求
 * @param {Object} requestData - 请求数据
 * @param {Object} env - 环境变量
 * @returns {Promise<Object>} 处理结果
 */
export async function handleForgotPassword(requestData, env) {
  try {
    const { email } = requestData;

    // 验证输入数据
    if (!email) {
      return {
        success: false,
        error: "请输入邮箱地址",
      };
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "邮箱格式不正确",
      };
    }

    // 检查用户是否存在
    const userData = await env.USERS.get(email);
    if (!userData) {
      // 为了安全，即使用户不存在也返回成功信息
      return {
        success: true,
        message: "如果该邮箱已注册，您将收到重置密码的链接",
      };
    }

    const user = JSON.parse(userData);

    // 生成重置token
    const resetToken = generateResetToken(email);

    // 存储重置token（可以存储在KV中，设置过期时间）
    const resetData = {
      email: email,
      token: resetToken,
      createdAt: new Date().toISOString(),
      used: false,
    };

    // 使用24小时过期的key存储重置token
    await env.RESET_TOKENS.put(resetToken, JSON.stringify(resetData), {
      expirationTtl: 24 * 60 * 60, // 24小时
    });

    // TODO: 这里应该发送邮件给用户
    // 目前返回重置链接（生产环境中应该通过邮件发送）
    const resetUrl = `${env.FRONTEND_URL || "https://aistone.org"}/reset-password?token=${resetToken}`;

    return {
      success: true,
      message: "重置密码链接已发送到您的邮箱",
      resetUrl: resetUrl, // 开发环境返回链接，生产环境删除此行
    };
  } catch (error) {
    console.error("忘记密码错误:", error);
    return {
      success: false,
      error: "请求失败，请稍后重试",
    };
  }
}

/**
 * 处理重置密码请求
 * @param {Object} requestData - 请求数据
 * @param {Object} env - 环境变量
 * @returns {Promise<Object>} 处理结果
 */
export async function handleResetPassword(requestData, env) {
  try {
    const { token, newPassword } = requestData;

    // 验证输入数据
    if (!token || !newPassword) {
      return {
        success: false,
        error: "缺少必要参数",
      };
    }

    // 验证密码强度
    if (newPassword.length < 6) {
      return {
        success: false,
        error: "密码长度至少6位",
      };
    }

    // 验证重置token
    const resetData = await env.RESET_TOKENS.get(token);
    if (!resetData) {
      return {
        success: false,
        error: "重置链接无效或已过期",
      };
    }

    const reset = JSON.parse(resetData);

    // 检查token是否已被使用
    if (reset.used) {
      return {
        success: false,
        error: "该重置链接已被使用",
      };
    }

    // 获取用户数据
    const userData = await env.USERS.get(reset.email);
    if (!userData) {
      return {
        success: false,
        error: "用户不存在",
      };
    }

    const user = JSON.parse(userData);

    // 生成新的盐值和密码哈希
    const salt = generateSalt();
    const passwordHash = hashPassword(newPassword, salt);

    // 更新用户密码
    user.passwordHash = passwordHash;
    user.salt = salt;
    user.updatedAt = new Date().toISOString();

    // 保存更新后的用户数据
    await env.USERS.put(reset.email, JSON.stringify(user));

    // 标记重置token为已使用
    reset.used = true;
    reset.usedAt = new Date().toISOString();
    await env.RESET_TOKENS.put(token, JSON.stringify(reset));

    return {
      success: true,
      message: "密码重置成功，请使用新密码登录",
    };
  } catch (error) {
    console.error("重置密码错误:", error);
    return {
      success: false,
      error: "重置失败，请稍后重试",
    };
  }
}

/**
 * 验证Google OAuth token
 * @param {string} idToken - Google ID token
 * @returns {Promise<Object|null>} Google用户信息或null
 */
async function verifyGoogleToken(idToken) {
  try {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);

    if (!response.ok) {
      return null;
    }

    const tokenInfo = await response.json();

    // 验证audience（可选，增加安全性）
    // if (tokenInfo.aud !== env.GOOGLE_CLIENT_ID) {
    //     return null;
    // }

    return {
      email: tokenInfo.email,
      name: tokenInfo.name,
      picture: tokenInfo.picture,
      email_verified: tokenInfo.email_verified === "true",
    };
  } catch (error) {
    console.error("Google token验证错误:", error);
    return null;
  }
}

/**
 * 处理Google OAuth登录
 * @param {Object} requestData - 请求数据
 * @param {Object} env - 环境变量
 * @returns {Promise<Object>} 登录结果
 */
export async function handleGoogleLogin(requestData, env) {
  try {
    const { idToken } = requestData;

    if (!idToken) {
      return {
        success: false,
        error: "缺少Google ID token",
      };
    }

    // 验证Google token
    const googleUser = await verifyGoogleToken(idToken);
    if (!googleUser) {
      return {
        success: false,
        error: "Google登录验证失败",
      };
    }

    if (!googleUser.email_verified) {
      return {
        success: false,
        error: "Google账户邮箱未验证",
      };
    }

    // 统一邮箱为小写并去除空格
    const emailLower = (googleUser.email || "").toLowerCase().trim();

    // 检查用户是否已存在（以小写邮箱为KV键）
    const userData = await env.USERS.get(emailLower);
    let user;

    if (userData) {
      // 用户已存在，更新信息
      user = JSON.parse(userData);
      user.lastLoginAt = new Date().toISOString();
      user.googleInfo = {
        name: googleUser.name,
        picture: googleUser.picture,
        lastUpdated: new Date().toISOString(),
      };
      if (user.isActive === undefined || user.isActive === false) {
        user.isActive = true;
      }
    } else {
      // 创建新用户
      const userId = generateUserId();
      user = {
        id: userId,
        username: googleUser.name || emailLower.split("@")[0],
        email: emailLower,
        passwordHash: null, // Google用户不需要密码
        salt: null,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        authProvider: "google",
        googleInfo: {
          name: googleUser.name,
          picture: googleUser.picture,
          lastUpdated: new Date().toISOString(),
        },
      };
    }

    // 保存用户数据（键为小写邮箱）
    await env.USERS.put(emailLower, JSON.stringify(user));

    // 生成JWT token
    const token = await generateJWT(
      { userId: user.id, email: user.email },
      env.JWT_SECRET || "your-secret-key",
      604800
    );

    // 返回用户信息（不包含敏感数据）
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      authProvider: user.authProvider || "email",
      avatar: user.googleInfo ? user.googleInfo.picture : null,
    };

    return {
      success: true,
      message: "Google登录成功",
      token: token,
      user: userResponse,
    };
  } catch (error) {
    console.error("Google登录错误:", error);
    return {
      success: false,
      error: "Google登录失败，请稍后重试",
    };
  }
}

/**
 * 处理Google OAuth 2.0授权码登录
 * @param {Object} requestData - 包含code和state的请求数据
 * @param {Object} env - 环境变量
 * @returns {Object} 登录结果
 */
export async function handleGoogleOAuth(requestData, env) {
  try {
    const { code, state } = requestData;

    if (!code) {
      return {
        success: false,
        error: "缺少授权码",
      };
    }

    // 交换授权码获取访问令牌
    const clientId =
      env.GOOGLE_CLIENT_ID ||
      "432588178769-n7vgnnmsh8l118heqmgtj92iir4i4n3s.apps.googleusercontent.com";
    const clientSecret =
      env.GOOGLE_CLIENT_SECRET || env.GOOGLE_CLIENT_SECRET_NEW || "GOCSPX-placeholder";
    // 优先使用显式配置的回调；否则尝试从 FRONTEND_URL 推导；最后回退到历史硬编码
    const redirectUri =
      env.GOOGLE_REDIRECT_URI ||
      (env.FRONTEND_URL && typeof env.FRONTEND_URL === "string"
        ? `${String(env.FRONTEND_URL).replace(/\/$/, "")}/auth/google/callback`
        : "https://aistone.org/auth/google/callback");

    if (!env.GOOGLE_CLIENT_ID) {
      console.warn(
        "[Auth Warning] GOOGLE_CLIENT_ID 未设置，使用了内置回退值（仅用于兼容，建议尽快在环境变量中配置）。"
      );
    }
    if (!env.GOOGLE_CLIENT_SECRET && !env.GOOGLE_CLIENT_SECRET_NEW) {
      console.warn("[Auth Warning] GOOGLE_CLIENT_SECRET 未设置，使用了占位符，OAuth 可能会失败。");
    }
    if (!env.GOOGLE_REDIRECT_URI && !env.FRONTEND_URL) {
      console.warn(
        "[Auth Warning] 未配置 GOOGLE_REDIRECT_URI/FRONTEND_URL，使用了历史硬编码回调地址。"
      );
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      let errorPayload;
      try {
        errorPayload = await tokenResponse.json();
      } catch (_) {
        const text = await tokenResponse.text();
        errorPayload = { error: "unknown_error", error_description: text };
      }

      // 统一的人性化错误信息
      let friendly = "Google授权失败，请重试";
      if (errorPayload && typeof errorPayload.error === "string") {
        const err = errorPayload.error;
        if (err === "invalid_grant") friendly = "授权码无效或已过期，请重新登录";
        else if (err === "redirect_uri_mismatch")
          friendly = "回调地址不匹配（redirect_uri_mismatch）";
        else if (err === "invalid_client") friendly = "客户端ID或密钥无效（invalid_client）";
      }

      return {
        success: false,
        error: friendly,
        google_error: errorPayload?.error || null,
        google_error_description: errorPayload?.error_description || null,
        status: tokenResponse.status,
      };
    }

    const tokenData = await tokenResponse.json();

    // 使用访问令牌获取用户信息
    const googleUserResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!googleUserResponse.ok) {
      console.error("Google user info fetch failed:", await googleUserResponse.text());
      return {
        success: false,
        error: "获取用户信息失败",
      };
    }

    const googleUser = await googleUserResponse.json();

    // 验证用户信息
    if (!googleUser.email || !googleUser.verified_email) {
      return {
        success: false,
        error: "Google账户邮箱未验证",
      };
    }

    // 统一邮箱为小写并去除空格
    const emailLower = (googleUser.email || "").toLowerCase().trim();

    // 查找或创建用户（以小写邮箱为KV键）
    let user = await env.USERS.get(emailLower);

    if (user) {
      // 用户已存在，更新登录时间和Google信息
      user = JSON.parse(user);
      user.lastLoginAt = new Date().toISOString();
      user.googleInfo = {
        id: googleUser.id,
        name: googleUser.name,
        picture: googleUser.picture,
        locale: googleUser.locale,
      };
      if (user.isActive === undefined || user.isActive === false) {
        user.isActive = true;
      }
      user.authProvider = "google";

      await env.USERS.put(emailLower, JSON.stringify(user));
    } else {
      // 创建新用户
      const userId = generateUUID();
      user = {
        id: userId,
        username: googleUser.name || emailLower.split("@")[0],
        email: emailLower,
        password: null, // Google用户没有密码
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isActive: true,
        authProvider: "google",
        googleInfo: {
          id: googleUser.id,
          name: googleUser.name,
          picture: googleUser.picture,
          locale: googleUser.locale,
        },
      };

      await env.USERS.put(emailLower, JSON.stringify(user));
    }

    // 生成JWT token
    const token = await generateJWT(
      { userId: user.id, email: user.email },
      env.JWT_SECRET || "your-secret-key",
      604800
    );

    // 返回用户信息（不包含敏感数据）
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      authProvider: user.authProvider,
      avatar: user.googleInfo ? user.googleInfo.picture : null,
    };

    return {
      success: true,
      message: "Google登录成功",
      token: token,
      user: userResponse,
    };
  } catch (error) {
    console.error("Google OAuth登录错误:", error);
    return {
      success: false,
      error: "Google登录失败，请稍后重试",
    };
  }
}

// 生成用户ID（用于Google首次登录新用户）
function generateUserId() {
  try {
    return randomBytes(16).toString("hex");
  } catch (_) {
    // 退化实现
    return "u_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

// 简单UUID v4 生成（不依赖全局 crypto.randomUUID）
function generateUUID() {
  try {
    const b = randomBytes(16);
    // Set version (4) and variant (RFC 4122)
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const hex = [...b].map((x) => x.toString(16).padStart(2, "0"));
    return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
  } catch (_) {
    // 退化实现
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
