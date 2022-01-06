const AuthenticationError = require('../AuthenticationError');
const ClientError = require('../ClientError');

describe('AuthenticationError', () => {
  it('should create AuthenticationError correctly', () => {
    const authenticationError = new AuthenticationError('authentication error!');

    expect(authenticationError).toBeInstanceOf(AuthenticationError);
    expect(authenticationError).toBeInstanceOf(ClientError);
    expect(authenticationError).toBeInstanceOf(Error);

    expect(authenticationError.statusCode).toStrictEqual(401);
    expect(authenticationError.message).toStrictEqual('authentication error!');
    expect(authenticationError.name).toStrictEqual('AuthenticationError');
  });
});
