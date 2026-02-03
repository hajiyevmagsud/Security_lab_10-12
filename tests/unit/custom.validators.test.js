const {
  isAlphanumericWithUnderscore,
  isSafeString,
  isValidObjectId,
} = require('../../src/validators/custom.validators');

describe('custom.validators', () => {
  test('allows alphanumeric and underscore', () => {
    expect(isAlphanumericWithUnderscore('user_name_123')).toBe(true);
  });

  test('rejects unsafe strings', () => {
    expect(() => isSafeString('<script>alert(1)</script>')).toThrow('dangerous');
  });

  test('validates object id format', () => {
    expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
    expect(() => isValidObjectId('not-an-id')).toThrow('Invalid ID');
  });
});
