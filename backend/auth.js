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
    const hasLetters = /[A-Za-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    const errors = [];

    if (password.length < minLength) {
        errors.push(`密码长度至少${minLength}位`);
    }

    if (!hasLetters || !hasNumbers) {
        errors.push('密码需包含字母和数字');
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