const Jwt = require('@hapi/jwt');
const JwtTokenManager = require('../../../../Infrastructures/security/JwtTokenManager');
const pool = require('../../../../Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../../tests/CommentLikesTableTestHelper');
const container = require('../../../../Infrastructures/container');
const createServer = require('../../../../Infrastructures/http/createServer');

describe('/likes endpoint', () => {
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
  const accessTokenPayload = { id: userId, username };
  const jwtTokenManager = new JwtTokenManager(Jwt.token);

  describe('when PUT /likes', () => {
    it('should respond 200', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: userId, username });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId });
      const accessToken = await jwtTokenManager.createAccessToken(accessTokenPayload);
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(200);
      expect(responseJSON.status).toStrictEqual('success');
    });

    it('should respond 404 when threadId is invalid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: userId, username });
      const accessToken = await jwtTokenManager.createAccessToken(accessTokenPayload);
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
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
      await UsersTableTestHelper.addUser({ id: userId, username });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      const accessToken = await jwtTokenManager.createAccessToken(accessTokenPayload);
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(404);
      expect(responseJSON.status).toStrictEqual('fail');
      expect(responseJSON.message).toStrictEqual('comment tidak ditemukan');
    });
  });
});
