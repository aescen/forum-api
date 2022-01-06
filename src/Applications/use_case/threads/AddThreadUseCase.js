const AddThread = require('../../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({
    iThreadRepository,
  }) {
    this._threadRepository = iThreadRepository;
  }

  async execute(useCasePayload, userId) {
    const addThread = new AddThread(useCasePayload);
    return this._threadRepository.addThread(addThread, userId);
  }
}

module.exports = AddThreadUseCase;
