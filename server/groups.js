Meteor.publish('groups', function () {
  if (!this.userId) { return; }

  let user = Users.findOne(this.userId);

  if (user.role.admin) {
    return Groups.find({});
  }

  if (user.role.trainer) {
    return Groups.find({'trainer._id': user._id});
  }

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

Groups.before.find(function (userId, selector, options) {
  let user = Users.findOne(userId);
  // TODO Permission logic (only if admin or trainer)
  // console.log(selector);
  let groups = Groups.direct.find(selector).fetch();
  // console.log(groups);
  var today = new Date();
  today.setHours(0,0,0,0);
  groups.forEach(function (group) {
    if (group.attendanceCheckedAt
        && today.getTime() !== group.attendanceCheckedAt.setHours(0,0,0,0)) {
      group.clients.forEach(function (client) {
        delete client.check;
      });
      delete group.attendanceCheckedAt;
      Groups.direct.update( { _id: group._id }, {
        $unset: { attendanceCheckedAt: '' },
        $set: { clients: group.clients }
      } );
    }
  });
});
