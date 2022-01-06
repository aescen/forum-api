const ICommentRepository = require('../ICommentRepository');

describe('ICommentRepository interface', () => {
  it('should throw an error when invoke abstract behaviour', async () => {
    // Arrange
    const iCommentRepository = new ICommentRepository();

    // Action and Assert
    await expect(iCommentRepository.addComment({}, '', '')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(iCommentRepository.getCommentsByThreadId('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(iCommentRepository.deleteCommentById('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(iCommentRepository.verifyCommentOwner('', '')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(iCommentRepository.verifyCommentId('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
