const AddedComment = require('../AddedComment');

describe('a AddedComment entity', () => {
  it('should throw an error when payload did not contain needed properties', () => {
    // Arrange
    const payload = {
      id: 'abc',
      content: 'def',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'abc',
      content: 'def',
      owner: {},
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create correct AddedComment entity', () => {
    // Arrange
    const payload = {
      id: 'abc',
      content: 'def',
      owner: 'ghi',
    };

    // Action and Assert
    const { id, content, owner } = new AddedComment(payload);
    expect(id).toStrictEqual(payload.id);
    expect(content).toStrictEqual(payload.content);
    expect(owner).toStrictEqual(payload.owner);
  });
});
