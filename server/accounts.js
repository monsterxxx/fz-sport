Accounts.onCreateUser(function(options, user) {
  user.profile = options.profile || {};
  user.server = true;
  user.tasks = [];
  user.notifications = [];
  return user;
});
