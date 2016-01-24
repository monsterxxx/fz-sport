Accounts.onCreateUser(function(options, user) {
  user.role = {};
  user.system = {};
  user.server = true;
  return user;
});
