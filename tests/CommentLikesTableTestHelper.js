/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addCommentLike({
    id = 'likes-123',
    commentId = 'comment-123',
    owner = 'user-123',
    date = '0000-00-00',
    deleted = false,
  }) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3, $4, $5)',
      values: [id, owner, commentId, date, deleted],
    };

    await pool.query(query);
  },

  async findCommentLikeById(id) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comment_likes CASCADE');
  },
};

module.exports = LikesTableTestHelper;
