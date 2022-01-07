const PutCommentLikeUseCase = require('../../../../Applications/use_case/commentlikes/PutCommentLikeUseCase');

class CommentLikesHandler {
  constructor(container) {
    this._container = container;

    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }

  async putCommentLikeHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const putCommentLikeUseCase = this._container.getInstance(PutCommentLikeUseCase.name);
    const { threadId, commentId } = request.params;
    await putCommentLikeUseCase.execute(threadId, commentId, userId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentLikesHandler;
