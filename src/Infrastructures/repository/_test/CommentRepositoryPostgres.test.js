const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
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

  // Commons
  const username = 'dicoding';
  const userId = 'user-123';
  const threadId = 'thread-123';
  const commentId = 'comment-123';
  const fakeId = () => 123; // stub

  describe('addComment function', () => {
    it('should persist add comment', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'comment',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeId);
      await UsersTableTestHelper.addUser({ username });
      await ThreadsTableTestHelper.addThread({ id: threadId });

      // Action
      await commentRepositoryPostgres.addComment(addComment, threadId, userId);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(commentId);
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'comment',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeId);
      await UsersTableTestHelper.addUser({ id: userId, username });
      await ThreadsTableTestHelper.addThread({ id: threadId });

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment, threadId, userId);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: commentId,
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
      const result = await commentRepositoryPostgres.getCommentsByThreadId(threadId);
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });

    it('should return comment correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const expectedComment = {
        id: commentId,
        content: 'dicoding',
        username,
        date: '0000-00-00',
        deleted: false,
        likes: '0',
      };
      await UsersTableTestHelper.addUser({ username });
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
      await expect(commentRepositoryPostgres.deleteCommentById(commentId))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when comment is already deleted', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ username });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId, deleted: true });

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteCommentById(commentId))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should soft delete comment correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ username });
      await ThreadsTableTestHelper.addThread({ id: threadId });
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
    it('should throw AuthorizationError when owner invalid', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: userId, username });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, 'user-000'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should return true when owner is valid', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: userId, username });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });

      // Action
      const result = await commentRepositoryPostgres.verifyCommentOwner(commentId, userId);

      // Assert
      expect(result).toStrictEqual(true);
    });
  });

  describe('verifyCommentId', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentId(commentId))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return true when commentId found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ username });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });

      // Action
      const result = await commentRepositoryPostgres.verifyCommentId(commentId);

      // Assert
      expect(result).toStrictEqual(true);
    });
  });
});
