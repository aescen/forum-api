const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const ICommentRepository = require('../../Domains/comments/ICommentRepository');

class CommentRepositoryPostgres extends ICommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment, threadId, owner) {
    const { content } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, threadId, createdAt, false],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async getCommentsByThreadId(commentId) {
    const query = {
      text: `SELECT
                comments.id, users.username, comments.created_at AS date, comments.content, comments.is_deleted AS deleted
              FROM
                comments
              LEFT JOIN
                users
              ON
                users.id = comments.owner
              WHERE
                comments.thread_id = $1
              ORDER BY
                comments.created_at
              ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return [];
    }

    return result.rows;
  }

  async deleteCommentById(commentId) {
    const query = {
      text: `UPDATE comments SET is_deleted = $1
        WHERE id = $2 AND is_deleted = $3 RETURNING id`,
      values: [true, commentId, false],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return result.rows[0].id;
  }

  async verifyCommentOwner(id, owner) {
    await this.verifyCommentId(id);
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }

    return true;
  }

  async verifyCommentId(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return true;
  }
}

module.exports = CommentRepositoryPostgres;
