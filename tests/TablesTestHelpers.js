/* istanbul ignore file */
require('dotenv').config();
const pool = require('../src/Infrastructures/database/postgres/pool');
const AuthenticationsTableTestHelper = require('./AuthenticationsTableTestHelper');
const CommentLikesTableTestHelper = require('./CommentLikesTableTestHelper');
const CommentsTableTestHelper = require('./CommentsTableTestHelper');
const RepliesTableTestHelper = require('./RepliesTableTestHelper');
const ThreadsTableTestHelper = require('./ThreadsTableTestHelper');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const cleanTables = async () => {
  await AuthenticationsTableTestHelper.cleanTable();
  await CommentLikesTableTestHelper.cleanTable();
  await CommentsTableTestHelper.cleanTable();
  await RepliesTableTestHelper.cleanTable();
  await ThreadsTableTestHelper.cleanTable();
  await UsersTableTestHelper.cleanTable();
  await pool.end();
  console.log('Cleaning table done ...');
};

cleanTables();
