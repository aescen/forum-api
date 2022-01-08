/* eslint-disable no-undef */
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');
const IThreadRepository = require('../../../../Domains/threads/IThreadRepository');
const ICommentRepository = require('../../../../Domains/comments/ICommentRepository');
const ICommentLikeRepository = require('../../../../Domains/commentlikes/ICommentLikeRepository');
const PutCommentLikeUseCase = require('../PutCommentLikeUseCase');

describe('PutCommentLikeUseCase', () => {
  // Commons
  const userId = 'user-123';
  const threadId = 'thread-123';
  const commentId = 'comment-123';
  const likeId = 'like-123';
  /* use case dependencies */
  const mockThreadRepository = new IThreadRepository();
  const mockCommentRepository = new ICommentRepository();
  const mockCommentLikeRepository = new ICommentLikeRepository();
  // Mocking
  mockThreadRepository.verifyThreadId = jest.fn(() => Promise.resolve(true));
  mockCommentRepository.verifyCommentId = jest.fn(() => Promise.resolve(true));

  it('should orchestrating put comment\'s like use case correctly on like', async () => {
    // Arrange
    const expectedPutCommentLike = {
      addedCommentLike: {
        id: likeId,
        owner: userId,
      },
    };

    // Mocking
    mockCommentLikeRepository.getCommentLikeId = jest.fn()
      .mockRejectedValue(new NotFoundError('like id tidak ditemukan'));
    mockCommentLikeRepository.addCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedPutCommentLike));
    const putCommentLikeUseCase = new PutCommentLikeUseCase({
      iThreadRepository: mockThreadRepository,
      iCommentRepository: mockCommentRepository,
      iCommentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    const putCommentLike = await putCommentLikeUseCase.execute(threadId, commentId, userId);

    // Assert
    expect(putCommentLike).toStrictEqual(expectedPutCommentLike);
    expect(mockThreadRepository.verifyThreadId).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentId).toBeCalledWith(commentId);
    expect(mockCommentLikeRepository.getCommentLikeId).toBeCalledWith(commentId, userId);
    await expect(mockCommentLikeRepository.getCommentLikeId(likeId))
      .rejects.toThrowError(NotFoundError);
    expect(mockCommentLikeRepository.addCommentLike).toBeCalledWith(commentId, userId);
  });

  it('should orchestrating put comment\'s like use case correctly on dislike', async () => {
    // Arrange
    // Mocking
    mockCommentLikeRepository.getCommentLikeId = jest.fn(() => Promise.resolve(likeId));
    mockCommentLikeRepository.verifyCommentLikeOwner = jest.fn(() => Promise.resolve(true));
    mockCommentLikeRepository.deleteCommentLikeById = jest.fn(() => Promise.resolve(likeId));
    const putCommentLikeUseCase = new PutCommentLikeUseCase({
      iThreadRepository: mockThreadRepository,
      iCommentRepository: mockCommentRepository,
      iCommentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    const putCommentLike = await putCommentLikeUseCase
      .execute(threadId, commentId, userId);
    // Assert
    expect(putCommentLike).toStrictEqual(likeId);
    expect(mockThreadRepository.verifyThreadId).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentId).toBeCalledWith(commentId);
    expect(mockCommentLikeRepository.getCommentLikeId).toBeCalledWith(commentId, userId);
    expect(mockCommentLikeRepository.verifyCommentLikeOwner).toBeCalledWith(likeId, userId);
    expect(mockCommentLikeRepository.deleteCommentLikeById).toBeCalledWith(likeId);
  });

  it('should throw error if execution fail', async () => {
    // Arrange
    // Mocking
    mockCommentLikeRepository.getCommentLikeId = jest.fn()
      .mockRejectedValue(new Error('an error occurs'));
    const putCommentLikeUseCase = new PutCommentLikeUseCase({
      iThreadRepository: mockThreadRepository,
      iCommentRepository: mockCommentRepository,
      iCommentLikeRepository: mockCommentLikeRepository,
    });

    // Action & Assert
    await expect(putCommentLikeUseCase.execute(threadId, commentId, userId))
      .rejects.toThrowError('PUT_COMMENT_LIKE_USE_CASE.EXECUTE_ERROR');
    expect(mockCommentLikeRepository.getCommentLikeId).toBeCalledWith(commentId, userId);
  });
});
