let origRemove = Roles.removeUsersFromRoles;

Roles.removeUsersFromRoles = function (users, roles, group) {
  origRemove.call(this, users, roles, group);

  if ('string' === typeof users) {
    handleUser(users);
  } else {
    _.each(users, function (user) {
      handleUser(user);
    });
  }

  function handleUser(user) {
    var userId = 'no-user',
        unset = {$unset: {}};

    if ('string' === typeof user) {
      userId = user;
    } else if ('object' === typeof user) {
      userId = user._id;
    }

    if (Roles.getRolesForUser(userId, group).length === 0) {
      unset.$unset['roles.' + group] = '';
      Users.update({_id: userId}, unset);
    }
  }
};

//function returns the highest priority role for the user or an empty string
Roles.getTopRole = function (user, group) {
  let roles = Roles.getRolesForUser(user, group);
  if (! roles.length) return;
  for (let role of ['owner', 'admin', 'trainer']) {
    if (_.contains(roles, role)) {
      return role;
    }
  }
};
