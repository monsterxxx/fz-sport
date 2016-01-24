Meteor.publish('attendance', function () {
  let user = Users.findOne(this.userId);

  if (user.role.admin) {
    return Attendance.find({});
  }
});
