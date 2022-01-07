/* eslint-disable no-undef */
const AddComment = require('../../../../Domains/comments/entities/AddComment');
const IThreadRepository = require('../../../../Domains/threads/IThreadRepository');
const ICommentRepository = require('../../../../Domains/comments/ICommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating add comment use case correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';

    /* payloads */
    const useCasePayload = {
      content: 'comment',
    };

    const addComment = new AddComment({
      content: useCasePayload.content,
    });

    const expectedAddedComment = {
      addedComment: {
        id: 'comment-123',
        content: useCasePayload.content,
        owner: userId,
      },
    };

    /* use case dependencies */
    const mockThreadRepository = new IThreadRepository();
    const mockCommentRepository = new ICommentRepository();
    // Mocking
    mockThreadRepository.verifyThreadId = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(expectedAddedComment));

    /* use case instances */
    const addCommentUseCase = new AddCommentUseCase({
      iThreadRepository: mockThreadRepository,
      iCommentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload, threadId, userId);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyThreadId).toBeCalledWith(threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(addComment, threadId, userId);
  });
});
