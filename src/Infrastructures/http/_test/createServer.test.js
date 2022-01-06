const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const createServer = require('../createServer');

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = await createServer({});
    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/thisIsanUnregisteredRoute',
    });
    // Assert
    expect(response.statusCode).toStrictEqual(404);
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };
    const server = await createServer({}); // fake container
    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });
    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toStrictEqual(500);
    expect(responseJson.status).toStrictEqual('error');
    expect(responseJson.message).toStrictEqual('terjadi kegagalan pada server kami');
  });
});
