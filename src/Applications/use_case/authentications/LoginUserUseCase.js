const UserLogin = require('../../../Domains/users/entities/UserLogin');
const NewAuthentication = require('../../../Domains/authentications/entities/NewAuth');

class LoginUserUseCase {
  constructor({
    iUserRepository,
    iAuthenticationRepository,
    iAuthenticationTokenManager,
    iPasswordHash,
  }) {
    this._userRepository = iUserRepository;
    this._authenticationRepository = iAuthenticationRepository;
    this._authenticationTokenManager = iAuthenticationTokenManager;
    this._passwordHash = iPasswordHash;
  }

  async execute(useCasePayload) {
    const { username, password } = new UserLogin(useCasePayload);

    const encryptedPassword = await this._userRepository.getPasswordByUsername(username);

    await this._passwordHash.comparePassword(password, encryptedPassword);

    const id = await this._userRepository.getIdByUsername(username);

    const accessToken = await this._authenticationTokenManager
      .createAccessToken({ username, id });
    const refreshToken = await this._authenticationTokenManager
      .createRefreshToken({ username, id });

    const newAuthentication = new NewAuthentication({
      accessToken,
      refreshToken,
    });

    await this._authenticationRepository.addToken(newAuthentication.refreshToken);

    return newAuthentication;
  }
}

module.exports = LoginUserUseCase;
