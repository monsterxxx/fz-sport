Accounts.onCreateUser(function(options, user) {
  user.profile = options.profile || {};
  user.tasks = [];
  user.notifications = [];
  return user;
});
