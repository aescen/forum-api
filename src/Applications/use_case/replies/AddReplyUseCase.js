const AddReply = require('../../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({
    iThreadRepository,
    iCommentRepository,
    iReplyRepository,
  }) {
    this._threadRepository = iThreadRepository;
    this._commentRepository = iCommentRepository;
    this._replyRepository = iReplyRepository;
  }

  async execute(useCasePayload, threadId, commentId, userId) {
    const addReply = new AddReply(useCasePayload);
    await this._threadRepository.verifyThreadId(threadId);
    await this._commentRepository.verifyCommentId(commentId);
    return this._replyRepository.addReply(addReply, commentId, userId);
  }
}

module.exports = AddReplyUseCase;
