Accounts.onCreateUser(function(options, user) {
  user.profile = {};
  user.role = {};
  user.server = true;
  return user;
});
