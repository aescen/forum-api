const IReplyRepository = require('../IReplyRepository');

describe('IReplyRepository interface', () => {
  it('should throw an error when invoke abstract behaviour', async () => {
    // Arrange
    const iReplyRepository = new IReplyRepository();

    // Action and Assert
    await expect(iReplyRepository.addReply({}, '', '')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(iReplyRepository.getRepliesByCommentId('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(iReplyRepository.verifyReplyId('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(iReplyRepository.verifyReplyOwner('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(iReplyRepository.deleteReplyById('', '')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
