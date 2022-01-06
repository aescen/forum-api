const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'thread',
        body: 'thread',
      });
      const userId = 'user-123';
      const fakeId = () => 123; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeId);
      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      // Action
      await threadRepositoryPostgres.addThread(addThread, userId);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'thread',
        body: 'thread',
      });
      const userId = 'user-123';
      const fakeId = () => 123; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeId);
      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread, userId);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: addThread.title,
        owner: userId,
      }));
    });
  });

  describe('getThreadById', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const expectedThread = {
        id: 'thread-123',
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        date: '0000-00-00',
        username: 'dicoding',
      };
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ date: expectedThread.date });

      // Action
      const result = await threadRepositoryPostgres.getThreadById(expectedThread.id);

      // Assert
      expect(result).toStrictEqual(expectedThread);
    });
  });

  describe('verifyThreadById', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadId('thread-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return true when threadId found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      // Action
      const result = await threadRepositoryPostgres.verifyThreadId('thread-123');

      // Assert
      expect(result).toStrictEqual(true);
    });
  });
});
