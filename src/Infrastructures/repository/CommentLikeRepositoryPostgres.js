const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedCommentLike = require('../../Domains/commentlikes/entities/AddedCommentLike');
const ICommentLikeRepository = require('../../Domains/commentlikes/ICommentLikeRepository');

class CommentLikeRepositoryPostgres extends ICommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentLike(commentId, owner) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO comment_likes (id, owner, comment_id)
        VALUES($1, $2, $3) RETURNING id, owner`,
      values: [id, owner, commentId],
    };

    const result = await this._pool.query(query);

    return new AddedCommentLike({ ...result.rows[0] });
  }

  async getCommentLikeId(commentId, owner) {
    const query = {
      text: 'SELECT id FROM comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('like id tidak ditemukan');
    }

    return result.rows[0].id;
  }

  async verifyCommentLikeOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }

    return true;
  }

  async deleteCommentLikeById(likeId) {
    const query = {
      text: `UPDATE comment_likes SET is_deleted = $1
        WHERE id = $2 AND is_deleted = $3 RETURNING id`,
      values: [true, likeId, false],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('like id tidak ditemukan');
    }

    return result.rows[0].id;
  }
}

module.exports = CommentLikeRepositoryPostgres;
