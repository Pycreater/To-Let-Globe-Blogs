const DB_NAME = 'Blogs';

const UserRolesEnum = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  CONTENT_WRITER: 'CONTENT_WRITER',
};
const AvailableUserRoles = Object.values(UserRolesEnum);

module.exports = { DB_NAME, AvailableUserRoles, UserRolesEnum };
