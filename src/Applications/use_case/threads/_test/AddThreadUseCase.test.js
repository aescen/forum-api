/* eslint-disable no-undef */
const AddThread = require('../../../../Domains/threads/entities/AddThread');
const IThreadRepository = require('../../../../Domains/threads/IThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating add thread use case correctly', async () => {
    // Arrange
    const userId = 'user-123';

    /* payloads */
    const useCasePayload = {
      title: 'thread',
      body: 'thread body',
    };

    const addThread = new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    });

    const expectedAddedThread = {
      addedThread: {
        id: 'thread-123',
        title: useCasePayload.title,
        owner: userId,
      },
    };

    /* use case dependencies */
    const mockThreadRepository = new IThreadRepository();
    // Mocking
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThread));

    /* use case instances */
    const getThreadUseCase = new AddThreadUseCase({
      iThreadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getThreadUseCase.execute(useCasePayload, userId);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(addThread, userId);
  });
});
