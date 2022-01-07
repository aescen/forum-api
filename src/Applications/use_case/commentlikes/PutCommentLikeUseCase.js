const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

class PutCommentLikeUseCase {
  constructor({
    iThreadRepository,
    iCommentRepository,
    iCommentLikeRepository,
  }) {
    this._threadRepository = iThreadRepository;
    this._commentRepository = iCommentRepository;
    this._commentLikeRepository = iCommentLikeRepository;
  }

  async execute(threadId, commentId, userId) {
    await this._threadRepository.verifyThreadId(threadId);
    await this._commentRepository.verifyCommentId(commentId);
    try {
      const likeId = await this._commentLikeRepository.getCommentLikeId(commentId, userId);
      await this._commentLikeRepository.verifyCommentLikeOwner(likeId, userId);
      return this._commentLikeRepository.deleteCommentLikeById(likeId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return this._commentLikeRepository.addCommentLike(commentId, userId);
      }
    }

    throw new Error('PUT_COMMENT_LIKE_USE_CASE.EXECUTE_ERROR');
  }
}

module.exports = PutCommentLikeUseCase;
