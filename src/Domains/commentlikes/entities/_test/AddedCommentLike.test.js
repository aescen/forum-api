const AddedCommentLike = require('../AddedCommentLike');

describe('a AddedCommentLike entity', () => {
  it('should throw an error when payload did not contain needed properties', () => {
    // Arrange
    const payload = {
      id: 'abc',
    };

    // Action and Assert
    expect(() => new AddedCommentLike(payload)).toThrowError('ADDED_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'abc',
      owner: {},
    };

    // Action and Assert
    expect(() => new AddedCommentLike(payload)).toThrowError('ADDED_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create correct AddedCommentLike entity', () => {
    // Arrange
    const payload = {
      id: 'abc',
      owner: 'ghi',
    };

    // Action and Assert
    const { id, owner } = new AddedCommentLike(payload);
    expect(id).toStrictEqual(payload.id);
    expect(owner).toStrictEqual(payload.owner);
  });
});
