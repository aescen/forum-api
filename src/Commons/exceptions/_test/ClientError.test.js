const ClientError = require('../ClientError');

describe('ClientError', () => {
  it('should throw error when directly using it', () => {
    expect(() => new ClientError('')).toThrowError('cannot instantiate abstract class');
  });
});
