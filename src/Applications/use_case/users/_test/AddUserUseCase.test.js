/* eslint-disable no-undef */
const RegisterUser = require('../../../../Domains/users/entities/RegisterUser');
const IUserRepository = require('../../../../Domains/users/IUserRepository');
const IPasswordHash = require('../../../security/IPasswordHash');
const AddUserUseCase = require('../AddUserUseCase');

describe('AddUserUseCase', () => {
  it('should orchestrating add user use case correctly', async () => {
    // Arrange

    /* payloads */
    const useCasePayload = {
      username: 'user',
      password: 'pass',
      fullname: 'User User',
    };

    const expectedRegisteredUser = {
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    };

    /* use case dependencies */
    const mockUserRepository = new IUserRepository();
    const mockPasswordHash = new IPasswordHash();

    /* use case needed function */
    const hashResult = 'encrypted_password';
    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedRegisteredUser));
    mockPasswordHash.hash = jest.fn()
      .mockImplementation(() => Promise.resolve(hashResult));

    /* use case instances */
    const getUserUseCase = new AddUserUseCase({
      iUserRepository: mockUserRepository,
      iPasswordHash: mockPasswordHash,
    });

    // Action
    const registeredUser = await getUserUseCase.execute(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual(expectedRegisteredUser);
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username);
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      username: useCasePayload.username,
      password: hashResult,
      fullname: useCasePayload.fullname,
    }));
  });
});
