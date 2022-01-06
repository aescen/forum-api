const RegisterUser = require('../../../Domains/users/entities/RegisterUser');

class AddUserUseCase {
  constructor({ iUserRepository, iPasswordHash }) {
    this._userRepository = iUserRepository;
    this._passwordHash = iPasswordHash;
  }

  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);
    await this._userRepository.verifyAvailableUsername(useCasePayload.username);
    registerUser.password = await this._passwordHash.hash(useCasePayload.password);
    return this._userRepository.addUser(registerUser);
  }
}

module.exports = AddUserUseCase;
