Meteor.methods({
  insertGroup: function (group, trainerId) {
    check(trainerId, String);
    check(group, {
      name: String
    });

    if (! this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to insert new group.');
    }

    var user = Users.findOne(this.userId);

    if (! (user.role.trainer || user.role.admin)) {
      throw new Meteor.Error('no-permission',
        'Must be trainer or admin to insert new group.');
    }

    var trainer = (this.userId === trainerId)
      ? user
      : Users.findOne(trainerId);

    // console.log(trainer);

    group.createdAt = new Date();
    group.trainer = {
      _id: trainer._id,
      name: trainer.profile.fname
    };
    group.clients = [];
    group.server = true;

    Groups.insert(group);

  }
});
