const AddedReply = require('../AddedReply');

describe('a AddedReply entity', () => {
  it('should throw an error when payload did not contain needed properties', () => {
    // Arrange
    const payload = {
      id: 'abc',
      content: 'def',
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'abc',
      content: 'def',
      owner: {},
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create correct AddedReply entity', () => {
    // Arrange
    const payload = {
      id: 'abc',
      content: 'def',
      owner: 'ghi',
    };

    // Action and Assert
    const { id, content, owner } = new AddedReply(payload);
    expect(id).toStrictEqual(payload.id);
    expect(content).toStrictEqual(payload.content);
    expect(owner).toStrictEqual(payload.owner);
  });
});
