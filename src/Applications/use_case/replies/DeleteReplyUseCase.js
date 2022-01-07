class DeleteReplyUseCase {
  constructor({
    iThreadRepository,
    iCommentRepository,
    iReplyRepository,
  }) {
    this._threadRepository = iThreadRepository;
    this._commentRepository = iCommentRepository;
    this._replyRepository = iReplyRepository;
  }

  async execute(threadId, commentId, replyId, userId) {
    await this._threadRepository.verifyThreadId(threadId);
    await this._commentRepository.verifyCommentId(commentId);
    await this._replyRepository.verifyReplyId(replyId);
    await this._replyRepository.verifyReplyOwner(replyId, userId);
    return this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
