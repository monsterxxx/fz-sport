Meteor.publish('company', function (id) {
  if (!this.userId) { return this.ready(); }

  if (Roles.userIsInRole(this.userId, 'owner', id)) {
    return Companies.find({_id: id});
  }

  // if (user.role.trainer) {
  //   return Groups.find({'trainer._id': user._id});
  // }

  // TODO publish groups for clients
  // if (user.role.client) {
  //   let client = Clients.findOne(user.system.client._id),
  //       groupIds = [];
  //
  //   for (let i = 0; i < client.groups.length; i++) {
  //     groupIds.push(client.groups[i]._id);
  //   }
  //
  //   return Groups.find({'_id': {$in : groupIds}});
  // }

});
