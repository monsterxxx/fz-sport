Meteor.publish('attendance', function () {
  if (!this.userId) {return; }

  let user = Users.findOne(this.userId);

  if (user.role.admin) {
    return Attendance.find({});
  }
});
