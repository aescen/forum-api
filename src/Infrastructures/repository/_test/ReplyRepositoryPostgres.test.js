const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const fakeId = () => 123; // stub

    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });
    });

    it('should persist add reply', async () => {
      // Arrange
      const addReply = new AddReply({
        content: 'reply',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeId);

      // Action
      await replyRepositoryPostgres.addReply(addReply, commentId, userId);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      const addReply = new AddReply({
        content: 'reply',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeId);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReply, commentId, userId);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: addReply.content,
        owner: userId,
      }));
    });
  });

  describe('getRepliesByCommentId', () => {
    it('should return empty array when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      const result = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });

    it('should return reply correctly', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const expectedReply = {
        id: 'reply-123',
        content: 'dicoding',
        date: '0000-00-00',
        deleted: false,
        username: 'dicoding',
      };
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });
      await RepliesTableTestHelper.addReply(expectedReply);

      // Action
      const result = await replyRepositoryPostgres.getRepliesByCommentId(commentId);

      // Assert
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0]).toStrictEqual(expectedReply);
    });
  });

  describe('verifyReplyOwner', () => {
    it('should throw AuthorizationError when owner invalid', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const userId = 'user-123';
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: replyId });

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, 'user-000'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should return true when owner is valid', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const userId = 'user-123';
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: replyId });

      // Action
      const result = await replyRepositoryPostgres.verifyReplyOwner(replyId, userId);

      // Assert
      expect(result).toStrictEqual(true);
    });
  });

  describe('verifyReplyId', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyId('reply-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return true when replyId found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: replyId });

      // Action
      const result = await replyRepositoryPostgres.verifyReplyId(replyId);

      // Assert
      expect(result).toStrictEqual(true);
    });
  });

  describe('deleteReplyById', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReplyById('reply-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when reply is already deleted', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: replyId, deleted: true });

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReplyById(replyId))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should soft delete reply correctly', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: replyId });

      // Action
      const result = await replyRepositoryPostgres.deleteReplyById(replyId);
      const savedReply = await RepliesTableTestHelper.findReplyById(replyId);

      // Assert
      expect(result).toStrictEqual(replyId);
      expect(savedReply[0].is_deleted).toStrictEqual(true);
    });
  });
});
