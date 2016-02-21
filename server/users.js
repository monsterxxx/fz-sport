Users._ensureIndex({
  'profile.fname': 'text'
});

Meteor.publish(null, function () {
  if (!this.userId) { return this.ready(); }
  return Users.find({_id: this.userId}, {fields: {'roles': 1, 'server': 1, 'companies': 1, 'tasks': 1, 'notifications': 1}});
});

Meteor.publish('users_for_admin', function () {
  if (!this.userId) { return this.ready(); }

  let user = Users.findOne(this.userId);

  if (user.role.admin) {
    return Users.find({}, {fields: {'username': 1, 'emails': 1, 'profile': 1, 'role': 1, 'server': 1}});
  }
});

Users.before.insert(function (userId, user) {
  //userId here is undefined
  //user contains complete user document
  user.tasks.push({
    id: 1,
    name: 'fill fname',
    text: 'Представьтесь пожалуйста'
  });
});

// Users.before.update(function (userId, doc, fieldNames, modifier, options) {
//   console.log('before update');
//   console.log(fieldNames, modifier);
//   // modifier.$set = modifier.$set || {};
//   // modifier.$set.modifiedAt = Date.now()ж
// });

Meteor.publish('searchUsers', function(email) {
  check(email, Match.Where(function (email) {
    check(email, String);
    var trimmed = String(email).trim();
    return /@/i.test(trimmed);
  }));

  // console.log('match passed');

  if (!this.userId) {return this.ready(); }

  return Users.find({'emails.address' : email}, {fields: {'username': 1, 'emails': 1, 'profile': 1}});
});
