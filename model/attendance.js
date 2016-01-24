Meteor.methods({
  submitAttendance: function (groupId, clients) {
    // console.log('submitAttendance');

    check(groupId, String);
    check(clients, [Object]);

    if (! this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to submit attendance.');
    }

    var user = Meteor.user();

    var group = Groups.findOne(groupId);

    if (! ((user.role.trainer && this.userId === group.trainer._id) || user.role.admin)) {
      throw new Meteor.Error('no-permission',
        'Must be trainer of this group or admin to submit attendance.');
    }

    // console.log('clients: '+clients);

    if (Meteor.isServer) {
      // console.log('groupId: '+groupId);

      // console.log('group:'+ JSON.stringify(group , null, 2));

      var startDate = new Date();
      startDate.setHours(0,0,0,0);

      var dateMidnight = new Date(startDate);
      dateMidnight.setHours(23,59,59,999);

      var attendance = {},
          now = new Date();

      for (var i = 0; i < group.clients.length; i++) {

        if (group.clients[i].check === clients[i].check) { continue; }

        if (clients[i].check) {
          attendance = {
            trainer: group.trainer.name,
            group: group.name,
            client: clients[i].name,
            createdAt: now
          };
          Attendance.insert(attendance);
        } else {
          Attendance.remove({
            group: group.name,
            client: clients[i].name,
            createdAt: {
              $gt: startDate,
              $lt: dateMidnight
            }
          });
        }

      }

      Groups.update({_id: group._id}, {$set: {clients: clients, attendanceCheckedAt: now}});

    }
  }
});
