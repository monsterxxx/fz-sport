Meteor.publish('groups', function (companyId) {
  if (! Roles.userIsInRole(this.userId, ['owner', 'admin', 'trainer'], companyId)) { return this.ready(); }

  let company = Companies.findOne(companyId, { fields: {groups: 1} });

  if (Roles.userIsInRole(this.userId, ['owner', 'admin'], companyId)) {
    return Groups.find( { 'company._id': companyId } );
  }

});

// Meteor.publish('groups', function (companyId) {
//   if (! Roles.userIsInRole(this.userId, ['owner', 'admin', 'trainer'], companyId)) { return this.ready(); }
//
//   let company = Companies.findOne(companyId, { fields: {groups: 1} });
//
//   if (Roles.userIsInRole(this.userId, ['owner', 'admin'], companyId)) {
//     let groups = _.map(company.groups, group => group._id);
//     return Groups.find( { _id: { $in: groups } } );
//   }
//
// });

// Groups.before.find(function (userId, selector, options) {
//   let user = Users.findOne(userId);
//   // TODO Permission logic (only if admin or trainer)
//   // console.log(selector);
//   let groups = Groups.direct.find(selector).fetch();
//   // console.log(groups);
//   var today = new Date();
//   today.setHours(0,0,0,0);
//   groups.forEach(function (group) {
//     if (group.attendanceCheckedAt
//         && today.getTime() !== group.attendanceCheckedAt.setHours(0,0,0,0)) {
//       group.clients.forEach(function (client) {
//         delete client.check;
//       });
//       delete group.attendanceCheckedAt;
//       Groups.direct.update( { _id: group._id }, {
//         $unset: { attendanceCheckedAt: '' },
//         $set: { clients: group.clients }
//       } );
//     }
//   });
// });
