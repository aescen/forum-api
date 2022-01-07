const Jwt = require('@hapi/jwt');
const JwtTokenManager = require('../../../../Infrastructures/security/JwtTokenManager');
const pool = require('../../../../Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../../tests/CommentsTableTestHelper');
const container = require('../../../../Infrastructures/container');
const createServer = require('../../../../Infrastructures/http/createServer');

describe('/comments endpoint', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  // Commons
  const userId = 'user-123';
  const threadId = 'thread-123';
  const commentId = 'comment-123';
  const accessTokenPayload = { id: userId, username: 'dicoding' };
  const jwtTokenManager = new JwtTokenManager(Jwt.token);

  describe('when POST /comments', () => {
    it('should respond 201 and persisted comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      const accessToken = await jwtTokenManager.createAccessToken(accessTokenPayload);
      const requestPayload = {
        content: 'comment',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(201);
      expect(responseJSON.status).toStrictEqual('success');
      expect(responseJSON.data.addedComment).toBeDefined();
    });

    it('should respond 404 when threadId is invalid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      const accessToken = await jwtTokenManager.createAccessToken(accessTokenPayload);
      const requestPayload = {
        content: 'comment',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(404);
      expect(responseJSON.status).toStrictEqual('fail');
      expect(responseJSON.message).toStrictEqual('thread tidak ditemukan');
    });

    it('should respond 400 when request payload does not contain needed property', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      const accessToken = await jwtTokenManager.createAccessToken(accessTokenPayload);
      const requestPayload = {
        comment: 'comment',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJSON.status).toStrictEqual('fail');
      expect(responseJSON.message).toStrictEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should respond 400 when request payload does not meet data type specification', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      const accessToken = await jwtTokenManager.createAccessToken(accessTokenPayload);
      const requestPayload = {
        content: [],
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJSON.status).toStrictEqual('fail');
      expect(responseJSON.message).toStrictEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /comments', () => {
    it('should respond 200 and soft delete comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });
      const accessToken = await jwtTokenManager.createAccessToken(accessTokenPayload);
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const savedComment = await CommentsTableTestHelper.findCommentById(commentId);

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(200);
      expect(responseJSON.status).toStrictEqual('success');
      expect(savedComment[0].is_deleted).toStrictEqual(true);
    });

    it('should respond 403 when request is unauthorized', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });
      const unauthorizedAccessToken = await jwtTokenManager.createAccessToken({ id: 'user-000', username: 'user' });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${unauthorizedAccessToken}` },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(403);
      expect(responseJSON.status).toStrictEqual('fail');
    });
  });
});
