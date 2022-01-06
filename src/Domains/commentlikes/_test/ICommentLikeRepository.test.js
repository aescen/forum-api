const ICommentLikeRepository = require('../ICommentLikeRepository');

describe('ICommentLikeRepository interface', () => {
  it('should throw an error when invoke abstract behaviour', async () => {
    // Arrange
    const iCommentLikeRepository = new ICommentLikeRepository();

    // Action and Assert
    await expect(iCommentLikeRepository.addCommentLike('', '')).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(iCommentLikeRepository.getCommentLikeId('', '')).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(iCommentLikeRepository.deleteCommentLikeById('')).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(iCommentLikeRepository.verifyCommentLikeOwner('', '')).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(iCommentLikeRepository.getCommentLikesByCommentId('')).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
