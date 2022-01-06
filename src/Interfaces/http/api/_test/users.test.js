const pool = require('../../../../Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const container = require('../../../../Infrastructures/container');
const createServer = require('../../../../Infrastructures/http/createServer');

describe('/users endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /users', () => {
    it('should respond 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicodinger',
        password: 'secrets',
        fullname: 'Dicodinger Indonesia',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(201);
      expect(responseJSON.status).toStrictEqual('success');
      expect(responseJSON.data.addedUser).toBeDefined();
    });

    it('should respond 400 when request payload does not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        password: 'secrets',
        fullname: 'Dicodinger Indonesia',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJSON.status).toStrictEqual('fail');
      expect(responseJSON.message).toStrictEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
    });

    it('should respond 400 when request payload does not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secrets',
        fullname: ['Dicodinger Indonesia'],
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJSON.status).toStrictEqual('fail');
      expect(responseJSON.message).toStrictEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
    });

    it('should respond 400 when username contains more than 50 characters', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicodingdicodingdicodingdicodingdicodingdicodingdicoding',
        password: 'secrets',
        fullname: 'Dicodinger Indonesia',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJSON.status).toStrictEqual('fail');
      expect(responseJSON.message).toStrictEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit');
    });

    it('should respond 400 when username contains restricted characters', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding dicoding',
        password: 'secrets',
        fullname: 'Dicodinger Indonesia',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJSON.status).toStrictEqual('fail');
      expect(responseJSON.message).toStrictEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang');
    });

    it('should respond 400 when username unavailable', async () => {
      // Arrange
      const username = 'dicoding';
      await UsersTableTestHelper.addUser({ username });
      const requestPayload = {
        username,
        password: 'secrets',
        fullname: 'Dicodinger Indonesia',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responseJSON.status).toStrictEqual('fail');
      expect(responseJSON.message).toStrictEqual('username tidak tersedia');
    });
  });
});
