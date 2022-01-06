const AddReply = require('../AddReply');

describe('a AddReply entity', () => {
  it('should throw an error when payload did not contain needed properties', () => {
    // Arrange
    const payload = {
      comment: 'abc',
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: {},
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create correct AddReply entity', () => {
    // Arrange
    const payload = {
      content: 'abc',
    };

    // Action and Assert
    const { content } = new AddReply(payload);
    expect(content).toStrictEqual(payload.content);
  });
});
