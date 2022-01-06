const RegisterUser = require('../RegisterUser');

describe('a RegisterUser entity', () => {
  it('should throw an error when payload did not contain needed properties', () => {
    // Arrange
    const payload = {
      username: 'abc',
      password: 'abc',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      username: 'abc',
      password: 'abc',
      fullname: true,
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw an error when username contains more than 50 chars', () => {
    // Arrange
    const payload = {
      username: 'abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc',
      password: 'abc',
      fullname: 'abc abc',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_LIMIT_CHAR');
  });

  it('should throw an error when username contains restricted character', () => {
    // Arrange
    const payload = {
      username: 'abc abc',
      password: 'abc',
      fullname: 'abc abc abc',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
  });

  it('should create correct RegisterUser entity', () => {
    // Arrange
    const payload = {
      username: 'abc_abc',
      password: 'abc',
      fullname: 'abc abc abc',
    };

    // Action and Assert
    const { username, password, fullname } = new RegisterUser(payload);
    expect(username).toStrictEqual(payload.username);
    expect(password).toStrictEqual(payload.password);
    expect(fullname).toStrictEqual(payload.fullname);
  });
});
