const bcrypt = require('bcrypt');
const BCryptPasswordHash = require('../BCryptPasswordHash');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');

describe('BCryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const cryptHelper = new BCryptPasswordHash(bcrypt);
      const plainPassword = 'plain_password';

      // Action
      const encryptedPassword = await cryptHelper.hash(plainPassword);

      // Assert
      expect(typeof encryptedPassword).toStrictEqual('string');
      expect(encryptedPassword).not.toStrictEqual(plainPassword);
      expect(spyHash).toBeCalledWith(plainPassword, 10); // 10: default bcrypt saltRound
    });
  });

  describe('comparePassword function', () => {
    it('should throw AuthenticationError if password not match', async () => {
      // Arrange
      const cryptHelper = new BCryptPasswordHash(bcrypt);

      // Act & Assert
      await expect(cryptHelper.comparePassword('plain_password', 'encrypted_password'))
        .rejects
        .toThrow(AuthenticationError);
    });

    it('should not return AuthenticationError if password match', async () => {
      // Arrange
      const cryptHelper = new BCryptPasswordHash(bcrypt);
      const plainPassword = 'secret';
      const encryptedPassword = await cryptHelper.hash(plainPassword);

      // Act & Assert
      await expect(cryptHelper.comparePassword(plainPassword, encryptedPassword))
        .resolves.not.toThrow(AuthenticationError);
    });
  });
});
