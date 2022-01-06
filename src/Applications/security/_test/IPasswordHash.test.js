const IPasswordHash = require('../IPasswordHash');

describe('PasswordHash interface', () => {
  it('should throw an error when invoke abstract behaviour', async () => {
    // Arrange
    const cryptHelper = new IPasswordHash();

    // Action and Assert
    await expect(cryptHelper.hash('dummy_password')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
    await expect(cryptHelper.comparePassword('plain', 'encrypted')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  });
});
