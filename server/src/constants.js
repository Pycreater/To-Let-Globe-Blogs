const DB_NAME = 'Blogs';

const UserRolesEnum = {
  ADMIN: 'ADMIN',
  CONTENT_WRITER: 'CONTENT_WRITER',
};
const AvailableUserRoles = Object.values(UserRolesEnum);

module.exports = { DB_NAME, AvailableUserRoles, UserRolesEnum };
