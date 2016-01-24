Users._ensureIndex({
  'profile.fname': 'text'
});

Meteor.publish(null, function () {
  return Users.find({_id: this.userId}, {fields: {'role': 1}});
});

Meteor.publish('users_for_admin', function () {
  if (!this.userId) { return; }

  let user = Users.findOne(this.userId);

  if (user.role.admin) {
    return Users.find({}, {fields: {'username': 1, 'emails': 1, 'profile': 1, 'role': 1, 'server': 1}});
  }
});
