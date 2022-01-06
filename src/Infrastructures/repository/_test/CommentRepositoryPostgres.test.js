const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'comment',
      });
      const userId = 'user-123';
      const threadId = 'thread-123';
      const fakeId = () => 123; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeId);
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      // Action
      await commentRepositoryPostgres.addComment(addComment, threadId, userId);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const fakeId = () => 123; // stub
      const addComment = new AddComment({
        content: 'comment',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeId);
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId });

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment, threadId, userId);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: addComment.content,
        owner: userId,
      }));
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return empty array when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      const result = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });

    it('should return comment id correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const threadId = 'thread-123';
      const expectedComment = {
        id: 'comment-123',
        content: 'dicoding',
        date: '0000-00-00',
        deleted: false,
        username: 'dicoding',
      };
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment(expectedComment);

      // Action
      const result = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      // Assert
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0]).toStrictEqual(expectedComment);
    });
  });

  describe('deleteCommentById', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteCommentById('comment-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when comment is already deleted', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: commentId, deleted: true });

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteCommentById('comment-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should soft delete comment correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: commentId });

      // Action
      const result = await commentRepositoryPostgres.deleteCommentById(commentId);
      const savedComment = await CommentsTableTestHelper.findCommentById(commentId);

      // Assert
      expect(result).toStrictEqual(commentId);
      expect(savedComment[0].is_deleted).toStrictEqual(true);
    });
  });

  describe('verifyCommentOwner', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-000', ''))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when owner invalid', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const userId = 'user-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: commentId });

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, 'user-000'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should return true when owner is valid', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const userId = 'user-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: commentId });

      // Action
      const result = await commentRepositoryPostgres.verifyCommentId(commentId, userId);

      // Assert
      expect(result).toStrictEqual(true);
    });
  });

  describe('verifyCommentId', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentId('comment-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return true when commentId found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: commentId });

      // Action
      const result = await commentRepositoryPostgres.verifyCommentId(commentId);

      // Assert
      expect(result).toStrictEqual(true);
    });
  });
});
