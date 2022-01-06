/* eslint-disable no-undef */
const AddReply = require('../../../../Domains/replies/entities/AddReply');
const IThreadRepository = require('../../../../Domains/threads/IThreadRepository');
const ICommentRepository = require('../../../../Domains/comments/ICommentRepository');
const IReplyRepository = require('../../../../Domains/replies/IReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating add reply use case correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    /* payloads */
    const useCasePayload = {
      content: 'reply',
    };

    const addReply = new AddReply({
      content: useCasePayload.content,
    });

    const expectedAddedReply = {
      addedReply: {
        id: 'reply-123',
        content: useCasePayload.content,
        owner: userId,
      },
    };

    /* use case dependencies */
    const mockThreadRepository = new IThreadRepository();
    const mockCommentRepository = new ICommentRepository();
    const mockReplyRepository = new IReplyRepository();
    // Mocking
    mockThreadRepository.verifyThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.verifyCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedReply));

    /* use case instances */
    const addReplyUseCase = new AddReplyUseCase({
      iThreadRepository: mockThreadRepository,
      iCommentRepository: mockCommentRepository,
      iReplyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload, threadId, commentId, userId);

    // Assert
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.verifyThreadId).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentId).toBeCalledWith(commentId);
    expect(mockReplyRepository.addReply).toBeCalledWith(addReply, commentId, userId);
  });
});
