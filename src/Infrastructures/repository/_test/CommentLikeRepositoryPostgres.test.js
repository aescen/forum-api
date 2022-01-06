const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddedCommentLike = require('../../../Domains/likes/entities/AddedCommentLike');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');

describe('CommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
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
  const likeId = 'like-123';
  const fakeId = () => 123; // stub

  describe('addCommentLike function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: userId, username });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });
    });

    it('should persist comment\'s like', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, fakeId);

      // Action
      await commentLikeRepositoryPostgres.addCommentLike(commentId, userId);

      // Assert
      const like = await CommentLikesTableTestHelper.findCommentLikeById(likeId);
      expect(like).toHaveLength(1);
    });

    it('should return added comment like correctly', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, fakeId);

      // Action
      const addedCommentLike = await commentLikeRepositoryPostgres
        .addCommentLike(commentId, userId);

      // Assert
      expect(addedCommentLike).toStrictEqual(new AddedCommentLike({
        id: likeId,
        owner: userId,
      }));
    });
  });

  describe('getCommentLikeId', () => {
    it('should throw NotFoundError when like not found', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentLikeRepositoryPostgres.getCommentLikeId(likeId))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return like id when like found', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ username });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });
      await CommentLikesTableTestHelper.addCommentLike({ id: likeId });

      // Action
      const result = await commentLikeRepositoryPostgres
        .getCommentLikeId(commentId, userId);

      // Assert
      expect(result).toStrictEqual(likeId);
    });
  });

  describe('verifyCommentLikeOwner', () => {
    it('should throw AuthorizationError when owner invalid', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: userId, username });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });

      // Action & Assert
      await expect(commentLikeRepositoryPostgres.verifyCommentLikeOwner(likeId, 'user-000'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should return true when owner is valid', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: userId, username });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });
      await CommentLikesTableTestHelper.addCommentLike({ id: likeId });

      // Action
      const result = await commentLikeRepositoryPostgres.verifyCommentLikeOwner(likeId, userId);

      // Assert
      expect(result).toStrictEqual(true);
    });
  });

  describe('deleteCommentLikeById', () => {
    it('should throw NotFoundError when like not found', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentLikeRepositoryPostgres.deleteCommentLikeById(likeId))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when like is already deleted', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ username });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });
      await CommentLikesTableTestHelper.addCommentLike({ id: likeId, deleted: true });

      // Action & Assert
      await expect(commentLikeRepositoryPostgres.deleteCommentLikeById(likeId))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should soft delete comment\'s like correctly', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ username });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });
      await CommentLikesTableTestHelper.addCommentLike({ id: likeId });

      // Action
      const result = await commentLikeRepositoryPostgres.deleteCommentLikeById(likeId);
      const savedCommentLike = await CommentLikesTableTestHelper.findCommentLikeById(likeId);

      // Assert
      expect(result).toStrictEqual(likeId);
      expect(savedCommentLike[0].is_deleted).toStrictEqual(true);
    });
  });

  describe('getCommentLikesByCommentId', () => {
    it('should return 0 when like not found', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action & Assert
      const result = await commentLikeRepositoryPostgres.getCommentLikesByCommentId(commentId);
      expect(result).toStrictEqual(0);
    });

    it('should return 1 after adding a comment\'s like', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ username });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });
      await CommentLikesTableTestHelper.addCommentLike({ id: likeId });

      // Action
      const result = await commentLikeRepositoryPostgres.getCommentLikesByCommentId(commentId);

      // Assert
      expect(result).toStrictEqual(1);
    });
  });
});
