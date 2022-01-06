const NotFoundError = require('../NotFoundError');

describe('NotFound', () => {
  it('should create an error correctly', () => {
    const errMsg = 'NotFound error!';
    const notFound = new NotFoundError(errMsg);

    expect(notFound.statusCode).toStrictEqual(404);
    expect(notFound.message).toStrictEqual(errMsg);
    expect(notFound.name).toStrictEqual('NotFoundError');
  });
});
