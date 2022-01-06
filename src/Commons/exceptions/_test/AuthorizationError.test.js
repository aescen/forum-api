const ClientError = require('../ClientError');
const AuthorizationError = require('../AuthorizationError');

describe('AuthorizationError', () => {
  it('should create AuthorizationError correctly', () => {
    const authenticationError = new AuthorizationError('authorization error!');

    expect(authenticationError).toBeInstanceOf(AuthorizationError);
    expect(authenticationError).toBeInstanceOf(ClientError);
    expect(authenticationError).toBeInstanceOf(Error);

    expect(authenticationError.statusCode).toStrictEqual(403);
    expect(authenticationError.message).toStrictEqual('authorization error!');
    expect(authenticationError.name).toStrictEqual('AuthorizationError');
  });
});
