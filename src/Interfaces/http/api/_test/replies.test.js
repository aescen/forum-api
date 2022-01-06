const Jwt = require('@hapi/jwt');
const JwtTokenManager = require('../../../../Infrastructures/security/JwtTokenManager');
const pool = require('../../../../Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../../tests/RepliesTableTestHelper');
const container = require('../../../../Infrastructures/container');
const createServer = require('../../../../Infrastructures/http/createServer');

describe('/comments endpoint', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /replies', () => {
    it('should respond 201 and persisted comment', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ id: userId, username: 'dicoding' });
      const requestPayload = {
        content: 'reply',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(201);
      expect(responseJSON.status).toStrictEqual('success');
      expect(responseJSON.data.addedReply).toBeDefined();
    });

    it('should respond 404 when threadId is invalid', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ id: userId, username: 'dicoding' });
      const requestPayload = {
        content: 'reply',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(404);
      expect(responseJSON.status).toStrictEqual('fail');
      expect(responseJSON.message).toStrictEqual('thread tidak ditemukan');
    });

    it('should respond 404 when commentId is invalid', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ id: userId, username: 'dicoding' });
      const requestPayload = {
        content: 'reply',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(404);
      expect(responseJSON.status).toStrictEqual('fail');
      expect(responseJSON.message).toStrictEqual('comment tidak ditemukan');
    });

    it('should respond 400 when request payload does not contain needed property', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ id: userId, username: 'dicoding' });
      const requestPayload = {
        comment: 'reply',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJSON.status).toStrictEqual('fail');
      expect(responseJSON.message).toStrictEqual('tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada');
    });

    it('should respond 400 when request payload does not meet data type specification', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ id: userId, username: 'dicoding' });
      const requestPayload = {
        content: [],
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJSON.status).toStrictEqual('fail');
      expect(responseJSON.message).toStrictEqual('tidak dapat membuat reply baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /replies', () => {
    it('should respond 200 and soft delete reply', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });
      await RepliesTableTestHelper.addReply({ id: replyId });
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ id: userId, username: 'dicoding' });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const savedReply = await RepliesTableTestHelper.findReplyById(replyId);

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(200);
      expect(responseJSON.status).toStrictEqual('success');
      expect(savedReply[0].is_deleted).toStrictEqual(true);
    });

    it('should respond 403 when request is unauthorized', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });
      await RepliesTableTestHelper.addReply({ id: replyId });
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-000', username: 'user' });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(403);
      expect(responseJSON.status).toStrictEqual('fail');
    });
  });
});
