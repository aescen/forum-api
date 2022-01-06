/* eslint-disable no-undef */
const IThreadRepository = require('../../../../Domains/threads/IThreadRepository');
const ICommentRepository = require('../../../../Domains/comments/ICommentRepository');
const IReplyRepository = require('../../../../Domains/replies/IReplyRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating get thread detail use case correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const expectedThread = {
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: 'date',
      username: 'user1',
    };
    const expectedDbResultComments = [
      {
        id: 'comment-123',
        username: 'user1',
        date: 'date',
        content: 'konten',
        deleted: false,
      },
    ];
    const expectedDbResultReplies = [
      {
        id: 'reply-123',
        username: 'user1',
        date: 'date',
        content: 'konten',
        deleted: false,
      },
      {
        id: 'reply-124',
        username: 'user2',
        date: 'date',
        content: 'konten2',
        deleted: false,
      },
    ];
    const expectedComments = [
      {
        id: 'comment-123',
        username: 'user1',
        date: 'date',
        content: 'konten',
      },
    ];
    const expectedReplies = [
      {
        id: 'reply-123',
        username: 'user1',
        date: 'date',
        content: 'konten',
      },
      {
        id: 'reply-124',
        username: 'user2',
        date: 'date',
        content: 'konten2',
      },
    ];
    const expectedThreadDetail = {
      ...expectedThread,
      comments: [
        {
          ...expectedComments[0],
          replies: expectedReplies,
        },
      ],
    };

    /* use case dependencies */
    const mockThreadRepository = new IThreadRepository();
    const mockCommentRepository = new ICommentRepository();
    const mockReplyRepository = new IReplyRepository();
    // Mocking
    mockThreadRepository.verifyThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDbResultComments));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDbResultReplies));
    /* use case instances */
    const getThreadUseCase = new GetThreadDetailUseCase({
      iThreadRepository: mockThreadRepository,
      iCommentRepository: mockCommentRepository,
      iReplyRepository: mockReplyRepository,
    });
    const spyOnFilterComments = jest.spyOn(getThreadUseCase, '_filterComments');
    const spyOnFilterReplies = jest.spyOn(getThreadUseCase, '_filterReplies');

    // Action
    const threadDetail = await getThreadUseCase.execute(threadId);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(mockThreadRepository.verifyThreadId).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(commentId);
    expect(spyOnFilterComments).toBeCalledWith(expectedDbResultComments);
    expect(spyOnFilterReplies).toBeCalledWith(expectedDbResultReplies);
  });

  describe('_filterComments', () => {
    it('should map content to \'**komentar telah dihapus**\' when deleted property is true', () => {
      // Arrange
      const dbResultComments = [
        {
          id: 'comment-123',
          username: 'user1',
          date: 'date',
          content: 'konten',
          deleted: true,
        },
      ];
      const expectedComments = [
        {
          id: 'comment-123',
          username: 'user1',
          date: 'date',
          content: '**komentar telah dihapus**',
        },
      ];
      const getThreadUseCase = new GetThreadDetailUseCase({}, {}, {});

      // Action
      const result = getThreadUseCase._filterComments(dbResultComments);

      // Assert
      expect(result).toStrictEqual(expectedComments);
    });

    it('should not map content to \'**komentar telah dihapus**\' when deleted property is false', () => {
      // Arrange
      const dbResultComments = [
        {
          id: 'comment-123',
          username: 'user1',
          date: 'date',
          content: 'konten',
          deleted: false,
        },
      ];
      const expectedComments = [
        {
          id: 'comment-123',
          username: 'user1',
          date: 'date',
          content: 'konten',
        },
      ];
      const getThreadUseCase = new GetThreadDetailUseCase({}, {}, {});

      // Action
      const result = getThreadUseCase._filterComments(dbResultComments);

      // Assert
      expect(result).toStrictEqual(expectedComments);
    });
  });

  describe('_filterReplies', () => {
    it('should map content to \'**balasan telah dihapus**\' when deleted property is true', () => {
      // Arrange
      const dbResultReplies = [
        {
          id: 'reply-123',
          username: 'user1',
          date: 'date',
          content: 'konten',
          deleted: true,
        },
      ];
      const expectedReplies = [
        {
          id: 'reply-123',
          username: 'user1',
          date: 'date',
          content: '**balasan telah dihapus**',
        },
      ];
      const getThreadUseCase = new GetThreadDetailUseCase({}, {}, {});

      // Action
      const result = getThreadUseCase._filterReplies(dbResultReplies);

      // Assert
      expect(result).toStrictEqual(expectedReplies);
    });

    it('should not map content to \'**balasan telah dihapus**\' when deleted property is false', () => {
      // Arrange
      const dbResultReplies = [
        {
          id: 'reply-123',
          username: 'user1',
          date: 'date',
          content: 'konten',
          deleted: false,
        },
      ];
      const expectedReplies = [
        {
          id: 'reply-123',
          username: 'user1',
          date: 'date',
          content: 'konten',
        },
      ];
      const getThreadUseCase = new GetThreadDetailUseCase({}, {}, {});

      // Action
      const result = getThreadUseCase._filterReplies(dbResultReplies);

      // Assert
      expect(result).toStrictEqual(expectedReplies);
    });
  });
});
