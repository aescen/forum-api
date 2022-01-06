const IUserRepository = require('../IUserRepository');

describe('IUserRepository interface', () => {
  it('should throw an error when invoke abstract behaviour', async () => {
    // Arrange
    const iUserRepository = new IUserRepository();

    // Action and Assert
    await expect(iUserRepository.addUser({})).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(iUserRepository.verifyAvailableUsername({})).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(iUserRepository.getPasswordByUsername('')).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(iUserRepository.getIdByUsername('')).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
