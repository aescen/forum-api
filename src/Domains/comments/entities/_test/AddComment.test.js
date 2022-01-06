const AddComment = require('../AddComment');

describe('a AddComment entity', () => {
  it('should throw an error when payload did not contain needed properties', () => {
    // Arrange
    const payload = {
      comment: 'abc',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: {},
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create correct AddComment entity', () => {
    // Arrange
    const payload = {
      content: 'abc',
    };

    // Action and Assert
    const { content } = new AddComment(payload);
    expect(content).toStrictEqual(payload.content);
  });
});
