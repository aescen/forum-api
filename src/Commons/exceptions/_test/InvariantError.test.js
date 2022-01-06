const InvariantError = require('../InvariantError');

describe('InvariantError', () => {
  it('should create an error correctly', () => {
    const errMsg = 'an error occurs';
    const invariantError = new InvariantError(errMsg);

    expect(invariantError.statusCode).toStrictEqual(400);
    expect(invariantError.message).toStrictEqual(errMsg);
    expect(invariantError.name).toStrictEqual('InvariantError');
  });
});
