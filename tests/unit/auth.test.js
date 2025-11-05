import test from 'node:test';
import assert from 'node:assert/strict';

import { __authTestables } from '../../backend/auth.js';

const {
  hashPasswordLegacy,
  hashPasswordPBKDF2,
  verifyPasswordAgainstUser,
  upgradeUserPassword,
  resolvePBKDF2Iterations,
  resolvePBKDF2KeyLength,
  resolvePBKDF2Digest,
  resolveGoogleOAuthConfig,
} = __authTestables;

const TEST_ENV = {
  PBKDF2_ITERATIONS: '120000',
  PBKDF2_KEYLEN: '64',
  PBKDF2_DIGEST: 'sha512',
};

test('hashPasswordPBKDF2 produces deterministic hex string', () => {
  const password = 'S3cure!';
  const salt = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
  const hashA = hashPasswordPBKDF2(password, salt, 120000, 64, 'sha512');
  const hashB = hashPasswordPBKDF2(password, salt, 120000, 64, 'sha512');

  assert.equal(hashA, hashB, 'hash should be deterministic');
  assert.equal(hashA.length, 128, 'hex string length should be keyLen*2');
});

test('verifyPasswordAgainstUser validates pbkdf2 user without upgrade', () => {
  const password = 'pbkdf2-pass';
  const salt = '11112222333344445555666677778888';
  const iterations = resolvePBKDF2Iterations(TEST_ENV);
  const keyLength = resolvePBKDF2KeyLength(TEST_ENV);
  const digest = resolvePBKDF2Digest(TEST_ENV);
  const hash = hashPasswordPBKDF2(password, salt, iterations, keyLength, digest);
  const user = {
    salt,
    passwordHash: hash,
    passwordAlgorithm: 'pbkdf2',
    passwordIterations: iterations,
    passwordKeyLength: keyLength,
    passwordDigest: digest,
  };

  const result = verifyPasswordAgainstUser(password, user, TEST_ENV);
  assert.equal(result.valid, true);
  assert.equal(result.needsUpgrade, false);
  assert.equal(result.metadataNeedsUpdate, false);
});

test('verifyPasswordAgainstUser flags legacy hash for upgrade', () => {
  const password = 'legacy-pass';
  const salt = '0f0e0d0c0b0a09080706050403020100';
  const hash = hashPasswordLegacy(password, salt);
  const user = { salt, passwordHash: hash };

  const result = verifyPasswordAgainstUser(password, user, TEST_ENV);
  assert.equal(result.valid, true);
  assert.equal(result.needsUpgrade, true, 'legacy hash should require upgrade');
  assert.equal(result.metadataNeedsUpdate, false);
});

test('upgradeUserPassword migrates legacy user to pbkdf2', () => {
  const password = 'UpgradeMe!';
  const salt = 'abcdefabcdefabcdefabcdefabcdefab';
  const legacyHash = hashPasswordLegacy(password, salt);
  const user = { salt, passwordHash: legacyHash };

  const upgraded = upgradeUserPassword(user, password, TEST_ENV);
  assert.equal(upgraded.passwordAlgorithm, 'pbkdf2');
  assert.ok(upgraded.passwordHash, 'should generate pbkdf2 hash');
  assert.equal(typeof upgraded.passwordUpdatedAt, 'string');

  const verification = verifyPasswordAgainstUser(password, upgraded, TEST_ENV);
  assert.equal(verification.valid, true);
  assert.equal(verification.needsUpgrade, false);
});

test('resolveGoogleOAuthConfig surfaces missing configuration', () => {
  const result = resolveGoogleOAuthConfig({});
  assert.ok(result.errors.includes('GOOGLE_CLIENT_ID 未配置'));
  assert.ok(result.errors.includes('GOOGLE_CLIENT_SECRET 未配置'));
  assert.ok(result.errors.some((msg) => msg.includes('GOOGLE_REDIRECT_URI')));
});

test('resolveGoogleOAuthConfig derives redirect from FRONTEND_URL', () => {
  const env = {
    GOOGLE_CLIENT_ID: 'client-id',
    GOOGLE_CLIENT_SECRET: 'secret',
    FRONTEND_URL: 'https://example.com/app/',
  };
  const result = resolveGoogleOAuthConfig(env);
  assert.equal(result.errors.length, 0);
  assert.equal(result.redirectUri, 'https://example.com/app/auth/google/callback');
  assert.equal(result.warnings.length, 1);
});
