/* eslint-disable no-undef */
const IThreadRepository = require('../../../../Domains/threads/IThreadRepository');
const ICommentRepository = require('../../../../Domains/comments/ICommentRepository');
const IReplyRepository = require('../../../../Domains/replies/IReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating delete reply use case correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';

    /* use case dependencies */
    const mockThreadRepository = new IThreadRepository();
    const mockCommentRepository = new ICommentRepository();
    const mockReplyRepository = new IReplyRepository();
    // Mocking
    mockThreadRepository.verifyThreadId = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.verifyCommentId = jest.fn(() => Promise.resolve(true));
    mockReplyRepository.verifyReplyId = jest.fn(() => Promise.resolve(true));
    mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve(true));
    mockReplyRepository.deleteReplyById = jest.fn(() => Promise.resolve(replyId));

    /* use case instances */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      iThreadRepository: mockThreadRepository,
      iCommentRepository: mockCommentRepository,
      iReplyRepository: mockReplyRepository,
    });

    // Action
    const deletedReply = await deleteReplyUseCase.execute(threadId, commentId, replyId, userId);
    // Assert
    expect(deletedReply).toStrictEqual(replyId);
    expect(mockThreadRepository.verifyThreadId).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentId).toBeCalledWith(commentId);
    expect(mockReplyRepository.verifyReplyId).toBeCalledWith(replyId);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(replyId, userId);
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(replyId);
  });
});
