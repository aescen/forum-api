const AddThread = require('../AddThread');

describe('a AddThread entity', () => {
  it('should throw an error when payload did not contain needed properties', () => {
    // Arrange
    const payload = {
      title: 'abc',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'abc',
      body: {},
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create correct AddThread entity', () => {
    // Arrange
    const payload = {
      title: 'abc',
      body: 'def',
    };

    // Action and Assert
    const { title, body } = new AddThread(payload);
    expect(title).toStrictEqual(payload.title);
    expect(body).toStrictEqual(payload.body);
  });
});
