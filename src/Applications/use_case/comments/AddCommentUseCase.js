const AddComment = require('../../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({
    iThreadRepository,
    iCommentRepository,
  }) {
    this._threadRepository = iThreadRepository;
    this._commentRepository = iCommentRepository;
  }

  async execute(useCasePayload, threadId, userId) {
    const addComment = new AddComment(useCasePayload);
    await this._threadRepository.verifyThreadId(threadId);
    return this._commentRepository.addComment(addComment, threadId, userId);
  }
}

module.exports = AddCommentUseCase;
