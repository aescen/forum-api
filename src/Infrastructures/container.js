/* istanbul ignore file */

const { createContainer } = require('instances-container');

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const IUserRepository = require('../Domains/users/IUserRepository');
const IThreadRepository = require('../Domains/threads/IThreadRepository');
const ICommentRepository = require('../Domains/comments/ICommentRepository');
const ICommentLikeRepository = require('../Domains/commentlikes/ICommentLikeRepository');
const IReplyRepository = require('../Domains/replies/IReplyRepository');
const IAuthenticationRepository = require('../Domains/authentications/IAuthenticationRepository');
const IAuthenticationTokenManager = require('../Applications/security/IAuthenticationTokenManager');
const IPasswordHash = require('../Applications/security/IPasswordHash');

const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');
const CommentLikeRepositoryPostgres = require('./repository/CommentLikeRepositoryPostgres');
const ReplyRepositoryPostgres = require('./repository/ReplyRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const JwtTokenManager = require('./security/JwtTokenManager');
const BCryptPasswordHash = require('./security/BCryptPasswordHash');

// use case
const AddUserUseCase = require('../Applications/use_case/users/AddUserUseCase');
const AddThreadUseCase = require('../Applications/use_case/threads/AddThreadUseCase');
const GetThreadDetailUseCase = require('../Applications/use_case/threads/GetThreadDetailUseCase');
const AddCommentUseCase = require('../Applications/use_case/comments/AddCommentUseCase');
const DeleteCommentUseCase = require('../Applications/use_case/comments/DeleteCommentUseCase');
const PutCommentLikeUseCase = require('../Applications/use_case/commentlikes/PutCommentLikeUseCase');
const AddReplyUseCase = require('../Applications/use_case/replies/AddReplyUseCase');
const DeleteReplyUseCase = require('../Applications/use_case/replies/DeleteReplyUseCase');
const LoginUserUseCase = require('../Applications/use_case/authentications/LoginUserUseCase');
const LogoutUserUseCase = require('../Applications/use_case/authentications/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/authentications/RefreshAuthenticationUseCase');

// creating container
const container = createContainer();

// registering services and repository
container.register([
  {
    key: IPasswordHash.name,
    Class: BCryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: IAuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
  {
    key: IUserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: IAuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: IThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ICommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ICommentLikeRepository.name,
    Class: CommentLikeRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: IReplyRepository.name,
    Class: ReplyRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'iUserRepository',
          internal: IUserRepository.name,
        },
        {
          name: 'iPasswordHash',
          internal: IPasswordHash.name,
        },
      ],
    },
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'iThreadRepository',
          internal: IThreadRepository.name,
        },
      ],
    },
  },
  {
    key: GetThreadDetailUseCase.name,
    Class: GetThreadDetailUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'iThreadRepository',
          internal: IThreadRepository.name,
        },
        {
          name: 'iCommentRepository',
          internal: ICommentRepository.name,
        },
        {
          name: 'iReplyRepository',
          internal: IReplyRepository.name,
        },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'iThreadRepository',
          internal: IThreadRepository.name,
        },
        {
          name: 'iCommentRepository',
          internal: ICommentRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'iThreadRepository',
          internal: IThreadRepository.name,
        },
        {
          name: 'iCommentRepository',
          internal: ICommentRepository.name,
        },
      ],
    },
  },
  {
    key: PutCommentLikeUseCase.name,
    Class: PutCommentLikeUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'iThreadRepository',
          internal: IThreadRepository.name,
        },
        {
          name: 'iCommentRepository',
          internal: ICommentRepository.name,
        },
        {
          name: 'iCommentLikeRepository',
          internal: ICommentLikeRepository.name,
        },
      ],
    },
  },
  {
    key: AddReplyUseCase.name,
    Class: AddReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'iThreadRepository',
          internal: IThreadRepository.name,
        },
        {
          name: 'iCommentRepository',
          internal: ICommentRepository.name,
        },
        {
          name: 'iReplyRepository',
          internal: IReplyRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteReplyUseCase.name,
    Class: DeleteReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'iThreadRepository',
          internal: IThreadRepository.name,
        },
        {
          name: 'iCommentRepository',
          internal: ICommentRepository.name,
        },
        {
          name: 'iReplyRepository',
          internal: IReplyRepository.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'iUserRepository',
          internal: IUserRepository.name,
        },
        {
          name: 'iAuthenticationRepository',
          internal: IAuthenticationRepository.name,
        },
        {
          name: 'iAuthenticationTokenManager',
          internal: IAuthenticationTokenManager.name,
        },
        {
          name: 'iPasswordHash',
          internal: IPasswordHash.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'iAuthenticationRepository',
          internal: IAuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'iAuthenticationRepository',
          internal: IAuthenticationRepository.name,
        },
        {
          name: 'iAuthenticationTokenManager',
          internal: IAuthenticationTokenManager.name,
        },
      ],
    },
  },
]);

module.exports = container;
