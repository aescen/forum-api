const Jwt = require('@hapi/jwt');
const JwtTokenManager = require('../../../../Infrastructures/security/JwtTokenManager');
const pool = require('../../../../Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../../tests/CommentsTableTestHelper');
const container = require('../../../../Infrastructures/container');
const createServer = require('../../../../Infrastructures/http/createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should respond 201 and persisted thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
      const requestPayload = {
        title: 'title',
        body: 'body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(201);
      expect(responseJSON.status).toStrictEqual('success');
      expect(responseJSON.data.addedThread).toBeDefined();
    });

    it('should respond 400 when request payload does not contain needed property', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
      const requestPayload = {
        title: 'title',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJSON.status).toStrictEqual('fail');
      expect(responseJSON.message).toStrictEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should respond 400 when request payload does not meet data type specification', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
      const requestPayload = {
        title: 'title',
        body: ['body'],
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJSON.status).toStrictEqual('fail');
      expect(responseJSON.message).toStrictEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });

  describe('when GET /threads', () => {
    it('should respond 201 and persisted thread', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(200);
      expect(responseJSON.status).toStrictEqual('success');
      expect(responseJSON.data.thread).toBeDefined();
      expect(responseJSON.data.thread.comments).toBeDefined();
      expect(responseJSON.data.thread.comments).toBeInstanceOf(Array);
    });

    it('should respond 400 when request payload does not contain needed property', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
      const requestPayload = {
        title: 'title',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJSON.status).toStrictEqual('fail');
      expect(responseJSON.message).toStrictEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should respond 400 when request payload does not meet data type specification', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
      const requestPayload = {
        title: 'title',
        body: ['body'],
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJSON.status).toStrictEqual('fail');
      expect(responseJSON.message).toStrictEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });
});
