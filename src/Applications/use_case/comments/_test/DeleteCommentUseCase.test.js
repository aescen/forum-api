/* eslint-disable no-undef */
const IThreadRepository = require('../../../../Domains/threads/IThreadRepository');
const ICommentRepository = require('../../../../Domains/comments/ICommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating delete comment use case correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    /* use case dependencies */
    const mockThreadRepository = new IThreadRepository();
    const mockCommentRepository = new ICommentRepository();
    // Mocking
    mockThreadRepository.verifyThreadId = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.verifyCommentId = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve(commentId));

    /* use case instances */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      iThreadRepository: mockThreadRepository,
      iCommentRepository: mockCommentRepository,
    });

    // Action
    const deletedComment = await deleteCommentUseCase.execute(threadId, commentId, userId);
    // Assert
    expect(deletedComment).toStrictEqual(commentId);
    expect(mockThreadRepository.verifyThreadId).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentId).toBeCalledWith(commentId);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(commentId, userId);
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(commentId);
  });
});
