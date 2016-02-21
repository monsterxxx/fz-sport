Meteor.methods({
  createGroup: function (group) {
    check(group, {
      company: Match.ObjectIncluding({
        _id: String
      }),
      trainer: Match.ObjectIncluding({
        _id: String
      }),
      name: String
    });

    let companyId = group.company._id;
    let trainerId = group.trainer._id;

    if (! this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to create new group.');
    }

    // var user = Users.findOne(this.userId);

    let roles = Roles.getRolesForUser(this.userId, companyId);

    if (! roles.length) {
      throw new Meteor.Error('no-permission',
        'Must be owner, admin or trainer to create new group.');
    }

    if (roles[0] === 'trainer' && roles.length === 1 && trainerId !== this.userId) {
      throw new Meteor.Error('no-permission',
        'Must be owner or admin to create group of another trainer.');
    }

    let company = Companies.findOne(companyId);
    let trainer = Users.findOne(trainerId);

    group.createdAt = new Date();
    group.company.name = company.name;
    group.trainer.name = trainer.profile.fname;

    let groupId = Groups.insert(group);

    Companies.update({_id: companyId}, {
      $push: {
        groups: {
          _id: groupId,
          name: group.name,
          trainer: group.trainer
        }
      }
    });

    return true;

  }
});
