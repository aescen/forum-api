const AddedThread = require('../AddedThread');

describe('a AddedThread entity', () => {
  it('should throw an error when payload did not contain needed properties', () => {
    // Arrange
    const payload = {
      id: 'abc',
      title: 'def',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'abc',
      title: 'def',
      owner: {},
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create correct AddedThread entity', () => {
    // Arrange
    const payload = {
      id: 'abc',
      title: 'def',
      owner: 'ghi',
    };

    // Action and Assert
    const { id, title, owner } = new AddedThread(payload);
    expect(id).toStrictEqual(payload.id);
    expect(title).toStrictEqual(payload.title);
    expect(owner).toStrictEqual(payload.owner);
  });
});
