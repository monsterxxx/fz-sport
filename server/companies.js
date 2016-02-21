Meteor.publish('company', function (id) {
  if (!this.userId) { return this.ready(); }

  if (Roles.userIsInRole(this.userId, 'owner', id)) {
    return Companies.find({_id: id});
  }

  if (Roles.userIsInRole(this.userId, 'admin', id)) {
    return Companies.find({_id: id}, {fields: {owners: 0}});
  }

});
