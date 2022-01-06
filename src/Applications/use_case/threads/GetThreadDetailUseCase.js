class GetThreadDetailUseCase {
  constructor({
    iThreadRepository,
    iCommentRepository,
    iReplyRepository,
  }) {
    this._threadRepository = iThreadRepository;
    this._commentRepository = iCommentRepository;
    this._replyRepository = iReplyRepository;
    this._DELETED_COMMENT_STR = '**komentar telah dihapus**';
    this._DELETED_REPLY_STR = '**balasan telah dihapus**';
  }

  async execute(threadId) {
    await this._threadRepository.verifyThreadId(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const _comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const _filteredComments = this._filterComments(_comments);

    const comments = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const comment of _filteredComments) {
      const {
        id, content, date, username,
      } = comment;
      const _replies = await this._replyRepository.getRepliesByCommentId(id);
      const _filteredReplies = this._filterReplies(_replies);
      comments.push({
        id, username, date, content, replies: _filteredReplies,
      });
    }

    return { ...thread, comments };
  }

  _filterComments(comments) {
    return comments.map((comment) => {
      const {
        id, username, date, content, deleted,
      } = comment;
      return {
        id,
        username,
        date,
        content: deleted ? this._DELETED_COMMENT_STR : content,
      };
    });
  }

  _filterReplies(replies) {
    return replies.map((reply) => {
      const {
        id: replyId, date: replyDate, username: replyUsername, deleted: replyDeleted,
      } = reply;
      let { content: replyContent } = reply;
      replyContent = replyDeleted ? this._DELETED_REPLY_STR : replyContent;
      return {
        id: replyId,
        content: replyContent,
        date: replyDate,
        username: replyUsername,
      };
    });
  }
}

module.exports = GetThreadDetailUseCase;
