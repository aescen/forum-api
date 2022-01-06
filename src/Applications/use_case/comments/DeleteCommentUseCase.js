class DeleteCommentUseCase {
  constructor({
    iThreadRepository,
    iCommentRepository,
  }) {
    this._threadRepository = iThreadRepository;
    this._commentRepository = iCommentRepository;
  }

  async execute(threadId, commentId, userId) {
    await this._threadRepository.verifyThreadId(threadId);
    await this._commentRepository.verifyCommentOwner(commentId, userId);
    return this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
