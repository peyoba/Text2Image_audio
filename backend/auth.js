/**
 * 用户认证模块
 * 处理用户注册、登录、JWT token生成和验证
 */

import { createHash, randomBytes } from 'crypto';

/**
 * 生成JWT token
 * @param {Object} payload - token载荷
 * @param {string} secret - 密钥
 * @param {number} expiresIn - 过期时间（秒）
 * @returns {string} JWT token
 */
function generateJWT(payload, secret, expiresIn = 86400) {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    
    const now = Math.floor(Date.now() / 1000);
    const claims = {
        ...payload,
        iat: now,
        exp: now + expiresIn
    };
    
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedClaims = btoa(JSON.stringify(claims));
    
    // 简单的HMAC签名（生产环境建议使用更安全的库）
    const signature = createHash('sha256')
        .update(`${encodedHeader}.${encodedClaims}.${secret}`)
        .digest('hex');
    
    return `${encodedHeader}.${encodedClaims}.${signature}`;
}

/**
 * 验证JWT token
 * @param {string} token - JWT token
 * @param {string} secret - 密钥
 * @returns {Object|null} 解码后的载荷或null
 */
function verifyJWT(token, secret) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        
        const [encodedHeader, encodedClaims, signature] = parts;
        
        // 验证签名
        const expectedSignature = createHash('sha256')
            .update(`${encodedHeader}.${encodedClaims}.${secret}`)
            .digest('hex');
        
        if (signature !== expectedSignature) {
            return null;
        }
        
        // 解码载荷
        const claims = JSON.parse(atob(encodedClaims));
        
        // 检查过期时间
        const now = Math.floor(Date.now() / 1000);
        if (claims.exp && claims.exp < now) {
            return null;
        }
        
        return claims;
    } catch (error) {
        console.error('JWT验证错误:', error);
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
    return createHash('sha256')
        .update(password + salt)
        .digest('hex');
}

/**
 * 生成随机盐值
 * @returns {string} 随机盐值
 */
function generateSalt() {
    return randomBytes(16).toString('hex');
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
        errors
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
                error: '请填写所有必填字段'
            };
        }
        
        // 验证邮箱格式
        if (!validateEmail(email)) {
            return {
                success: false,
                error: '邮箱格式不正确'
            };
        }
        
        // 验证密码强度
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return {
                success: false,
                error: passwordValidation.errors.join(', ')
            };
        }
        
        // 检查用户是否已存在
        const existingUser = await env.USERS.get(email);
        if (existingUser) {
            return {
                success: false,
                error: '该邮箱已被注册'
            };
        }
        
        // 生成盐值和密码哈希
        const salt = generateSalt();
        const hashedPassword = hashPassword(password, salt);
        
        // 创建用户对象
        const user = {
            id: randomBytes(16).toString('hex'),
            username: username.trim(),
            email: email.toLowerCase().trim(),
            passwordHash: hashedPassword,
            salt: salt,
            createdAt: new Date().toISOString(),
            lastLoginAt: null,
            isActive: true
        };
        
        // 存储用户数据
        await env.USERS.put(email, JSON.stringify(user));
        
        // 生成JWT token
        const token = generateJWT(
            { userId: user.id, email: user.email },
            env.JWT_SECRET || 'your-secret-key',
            86400 // 24小时
        );
        
        // 返回用户信息（不包含敏感数据）
        const userResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        };
        
        return {
            success: true,
            message: '注册成功',
            token: token,
            user: userResponse
        };
        
    } catch (error) {
        console.error('用户注册错误:', error);
        return {
            success: false,
            error: '注册失败，请稍后重试'
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
                error: '请填写邮箱和密码'
            };
        }
        
        // 获取用户数据
        const userData = await env.USERS.get(email);
        if (!userData) {
            return {
                success: false,
                error: '邮箱或密码错误'
            };
        }
        
        const user = JSON.parse(userData);
        
        // 验证密码
        const hashedPassword = hashPassword(password, user.salt);
        if (hashedPassword !== user.passwordHash) {
            return {
                success: false,
                error: '邮箱或密码错误'
            };
        }
        
        // 检查用户状态
        if (!user.isActive) {
            return {
                success: false,
                error: '账户已被禁用'
            };
        }
        
        // 更新最后登录时间
        user.lastLoginAt = new Date().toISOString();
        await env.USERS.put(email, JSON.stringify(user));
        
        // 生成JWT token
        const token = generateJWT(
            { userId: user.id, email: user.email },
            env.JWT_SECRET || 'your-secret-key',
            86400 // 24小时
        );
        
        // 返回用户信息（不包含敏感数据）
        const userResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt
        };
        
        return {
            success: true,
            message: '登录成功',
            token: token,
            user: userResponse
        };
        
    } catch (error) {
        console.error('用户登录错误:', error);
        return {
            success: false,
            error: '登录失败，请稍后重试'
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
                error: '缺少认证token'
            };
        }
        
        // 验证JWT token
        const claims = verifyJWT(token, env.JWT_SECRET || 'your-secret-key');
        if (!claims) {
            return {
                success: false,
                error: 'token无效或已过期'
            };
        }
        
        // 获取用户数据
        const userData = await env.USERS.get(claims.email);
        if (!userData) {
            return {
                success: false,
                error: '用户不存在'
            };
        }
        
        const user = JSON.parse(userData);
        
        // 检查用户状态
        if (!user.isActive) {
            return {
                success: false,
                error: '账户已被禁用'
            };
        }
        
        // 返回用户信息（不包含敏感数据）
        const userResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt
        };
        
        return {
            success: true,
            user: userResponse
        };
        
    } catch (error) {
        console.error('Token验证错误:', error);
        return {
            success: false,
            error: 'token验证失败'
        };
    }
}

/**
 * 从请求头中提取token
 * @param {Request} request - HTTP请求
 * @returns {string|null} token或null
 */
export function extractTokenFromRequest(request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
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
    return btoa(data).replace(/[+/=]/g, '');
}

/**
 * 验证重置密码token
 * @param {string} token - 重置token
 * @param {number} maxAge - token最大有效期（毫秒）
 * @returns {Object|null} 解码后的数据或null
 */
function verifyResetToken(token, maxAge = 24 * 60 * 60 * 1000) { // 24小时默认
    try {
        const decoded = atob(token);
        const [email, timestamp, randomStr] = decoded.split(':');
        
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
                error: '请输入邮箱地址'
            };
        }
        
        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                success: false,
                error: '邮箱格式不正确'
            };
        }
        
        // 检查用户是否存在
        const userData = await env.USERS.get(email);
        if (!userData) {
            // 为了安全，即使用户不存在也返回成功信息
            return {
                success: true,
                message: '如果该邮箱已注册，您将收到重置密码的链接'
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
            used: false
        };
        
        // 使用24小时过期的key存储重置token
        await env.RESET_TOKENS.put(resetToken, JSON.stringify(resetData), {
            expirationTtl: 24 * 60 * 60 // 24小时
        });
        
        // TODO: 这里应该发送邮件给用户
        // 目前返回重置链接（生产环境中应该通过邮件发送）
        const resetUrl = `${env.FRONTEND_URL || 'https://aistone.org'}/reset-password?token=${resetToken}`;
        
        return {
            success: true,
            message: '重置密码链接已发送到您的邮箱',
            resetUrl: resetUrl // 开发环境返回链接，生产环境删除此行
        };
        
    } catch (error) {
        console.error('忘记密码错误:', error);
        return {
            success: false,
            error: '请求失败，请稍后重试'
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
                error: '缺少必要参数'
            };
        }
        
        // 验证密码强度
        if (newPassword.length < 6) {
            return {
                success: false,
                error: '密码长度至少6位'
            };
        }
        
        // 验证重置token
        const resetData = await env.RESET_TOKENS.get(token);
        if (!resetData) {
            return {
                success: false,
                error: '重置链接无效或已过期'
            };
        }
        
        const reset = JSON.parse(resetData);
        
        // 检查token是否已被使用
        if (reset.used) {
            return {
                success: false,
                error: '该重置链接已被使用'
            };
        }
        
        // 获取用户数据
        const userData = await env.USERS.get(reset.email);
        if (!userData) {
            return {
                success: false,
                error: '用户不存在'
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
            message: '密码重置成功，请使用新密码登录'
        };
        
    } catch (error) {
        console.error('重置密码错误:', error);
        return {
            success: false,
            error: '重置失败，请稍后重试'
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
            email_verified: tokenInfo.email_verified === 'true'
        };
    } catch (error) {
        console.error('Google token验证错误:', error);
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
                error: '缺少Google ID token'
            };
        }
        
        // 验证Google token
        const googleUser = await verifyGoogleToken(idToken);
        if (!googleUser) {
            return {
                success: false,
                error: 'Google登录验证失败'
            };
        }
        
        if (!googleUser.email_verified) {
            return {
                success: false,
                error: 'Google账户邮箱未验证'
            };
        }
        
        // 检查用户是否已存在
        let userData = await env.USERS.get(googleUser.email);
        let user;
        
        if (userData) {
            // 用户已存在，更新信息
            user = JSON.parse(userData);
            user.lastLoginAt = new Date().toISOString();
            user.googleInfo = {
                name: googleUser.name,
                picture: googleUser.picture,
                lastUpdated: new Date().toISOString()
            };
        } else {
            // 创建新用户
            const userId = generateUserId();
            user = {
                id: userId,
                username: googleUser.name || googleUser.email.split('@')[0],
                email: googleUser.email,
                passwordHash: null, // Google用户不需要密码
                salt: null,
                isActive: true,
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
                authProvider: 'google',
                googleInfo: {
                    name: googleUser.name,
                    picture: googleUser.picture,
                    lastUpdated: new Date().toISOString()
                }
            };
        }
        
        // 保存用户数据
        await env.USERS.put(googleUser.email, JSON.stringify(user));
        
        // 生成JWT token
        const token = generateJWT(
            { userId: user.id, email: user.email },
            env.JWT_SECRET || 'your-secret-key',
            86400 // 24小时
        );
        
        // 返回用户信息（不包含敏感数据）
        const userResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
            authProvider: user.authProvider || 'email',
            avatar: user.googleInfo ? user.googleInfo.picture : null
        };
        
        return {
            success: true,
            message: 'Google登录成功',
            token: token,
            user: userResponse
        };
        
    } catch (error) {
        console.error('Google登录错误:', error);
        return {
            success: false,
            error: 'Google登录失败，请稍后重试'
        };
    }
}

/**
 * 处理Google OAuth 2.0授权码登录
 * @param {Object} requestData - 包含code和state的请求数据
 * @param {Object} env - 环境变量
 * @returns {Object} 登录结果
 */
async function handleGoogleOAuth(requestData, env) {
    try {
        const { code, state } = requestData;
        
        if (!code) {
            return {
                success: false,
                error: '缺少授权码'
            };
        }
        
        // 交换授权码获取访问令牌
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: '432588178769-n7vgnnmsh8l118heqmgtj92iir4i4n3s.apps.googleusercontent.com',
                client_secret: env.GOOGLE_CLIENT_SECRET || 'GOCSPX-placeholder', // 需要在环境变量中设置
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: `https://${env.DOMAIN || 'aistone.org'}/auth/google/callback` // 使用环境变量或默认域名
            })
        });

        if (!tokenResponse.ok) {
            console.error('Google token exchange failed:', await tokenResponse.text());
            return {
                success: false,
                error: 'Google授权失败'
            };
        }

        const tokenData = await tokenResponse.json();
        
        // 使用访问令牌获取用户信息
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            }
        });

        if (!userResponse.ok) {
            console.error('Google user info fetch failed:', await userResponse.text());
            return {
                success: false,
                error: '获取用户信息失败'
            };
        }

        const googleUser = await userResponse.json();
        
        // 验证用户信息
        if (!googleUser.email || !googleUser.verified_email) {
            return {
                success: false,
                error: 'Google账户邮箱未验证'
            };
        }
        
        // 查找或创建用户
        let user = await env.USERS.get(googleUser.email);
        
        if (user) {
            // 用户已存在，更新登录时间和Google信息
            user = JSON.parse(user);
            user.lastLoginAt = new Date().toISOString();
            user.googleInfo = {
                id: googleUser.id,
                name: googleUser.name,
                picture: googleUser.picture,
                locale: googleUser.locale
            };
            user.authProvider = 'google';
            
            await env.USERS.put(googleUser.email, JSON.stringify(user));
        } else {
            // 创建新用户
            const userId = generateUUID();
            user = {
                id: userId,
                username: googleUser.name || googleUser.email.split('@')[0],
                email: googleUser.email,
                password: null, // Google用户没有密码
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
                authProvider: 'google',
                googleInfo: {
                    id: googleUser.id,
                    name: googleUser.name,
                    picture: googleUser.picture,
                    locale: googleUser.locale
                }
            };
            
            await env.USERS.put(googleUser.email, JSON.stringify(user));
        }
        
        // 生成JWT token
        const token = generateJWT(
            { userId: user.id, email: user.email },
            env.JWT_SECRET || 'your-secret-key',
            86400 // 24小时
        );
        
        // 返回用户信息（不包含敏感数据）
        const userResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
            authProvider: user.authProvider,
            avatar: user.googleInfo ? user.googleInfo.picture : null
        };
        
        return {
            success: true,
            message: 'Google登录成功',
            token: token,
            user: userResponse
        };
        
    } catch (error) {
        console.error('Google OAuth登录错误:', error);
        return {
            success: false,
            error: 'Google登录失败，请稍后重试'
        };
    }
}

export {
    handleUserRegistration,
    handleUserLogin,
    validateUserToken,
    extractTokenFromRequest,
    handleForgotPassword,
    handleResetPassword,
    handleGoogleLogin,
    handleGoogleOAuth
}; 