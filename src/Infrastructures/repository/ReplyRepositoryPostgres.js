const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const IReplyRepository = require('../../Domains/replies/IReplyRepository');

class ReplyRepositoryPostgres extends IReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply, commentId, owner) {
    const { content } = addReply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO replies (id, content, owner, comment_id)
        VALUES($1, $2, $3, $4) RETURNING id, content, owner`,
      values: [id, content, owner, commentId],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async getRepliesByCommentId(replyId) {
    const query = {
      text: `SELECT
                replies.id, replies.content, replies.created_at AS date, users.username, replies.is_deleted AS deleted
              FROM
                replies
              LEFT JOIN
                users
              ON
                users.id = replies.owner
              WHERE
                replies.comment_id = $1
              ORDER BY
                replies.created_at
              ASC`,
      values: [replyId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async verifyReplyOwner(id, owner) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }

    return true;
  }

  async verifyReplyId(id) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return true;
  }

  async deleteReplyById(replyId) {
    const query = {
      text: `UPDATE replies SET is_deleted = $1
        WHERE id = $2 AND is_deleted = $3 RETURNING id`,
      values: [true, replyId, false],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    return result.rows[0].id;
  }
}

module.exports = ReplyRepositoryPostgres;
