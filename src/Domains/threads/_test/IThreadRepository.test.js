const IThreadRepository = require('../IThreadRepository');

describe('IThreadRepository interface', () => {
  it('should throw an error when invoke abstract behaviour', async () => {
    // Arrange
    const iThreadRepository = new IThreadRepository();

    // Action and Assert
    await expect(iThreadRepository.addThread({}, '')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(iThreadRepository.getThreadById('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(iThreadRepository.verifyThreadId('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
