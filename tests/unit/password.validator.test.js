const { validatePassword, analyzePasswordStrength } = require('../../src/validators/password.validator');

describe('password.validator', () => {
  test('accepts a strong password', () => {
    expect(validatePassword('Str0ng!Pass')).toBe(true);
  });

  test('rejects too-short password', () => {
    expect(() => validatePassword('S1!a')).toThrow('at least 8 characters');
  });

  test('rejects missing special character', () => {
    expect(() => validatePassword('StrongPass1')).toThrow('special character');
  });

  test('detects common password', () => {
    expect(() => validatePassword('password123')).toThrow('too common');
  });

  test('analyzes password strength', () => {
    const result = analyzePasswordStrength('Str0ng!Pass');
    expect(result.strength).toBeGreaterThanOrEqual(4);
    expect(result.feedback).toMatch(/Moderate|Strong/);
  });
});
