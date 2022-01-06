const RegisteredUser = require('../RegisteredUser');

describe('a RegisteredUser entity', () => {
  it('should throw an error when payload did not contain needed properties', () => {
    // Arrange
    const payload = {
      username: 'abc',
      password: 'abc',
    };

    // Action and Assert
    expect(() => new RegisteredUser(payload)).toThrowError('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'user-abc1',
      username: 'abc',
      fullname: true,
    };

    // Action and Assert
    expect(() => new RegisteredUser(payload)).toThrowError('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create correct RegisteredUser entity', () => {
    // Arrange
    const payload = {
      id: 'user-abc1',
      username: 'abc_abc',
      fullname: 'abc abc abc',
    };

    // Action and Assert
    const { id, username, fullname } = new RegisteredUser(payload);
    expect(id).toStrictEqual(payload.id);
    expect(username).toStrictEqual(payload.username);
    expect(fullname).toStrictEqual(payload.fullname);
  });
});
