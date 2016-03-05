Meteor.publish('company', function (companyId) {
  check(companyId, String);
  if (!this.userId) { return this.ready(); }

  const company = Companies.findOne(companyId, { fields: {members: 1} });
  const members = _.map(company.members, member => member._id);

  if (Roles.userIsInRole(this.userId, 'owner', companyId)) {
    return [
      Companies.find({_id: companyId}),
      Users.find({_id: {$in: members}}, {fields: {profile: 1, roles: 1}})
    ];
  }

  if (Roles.userIsInRole(this.userId, 'admin', companyId)) {
    return [
      Companies.find({_id: companyId}, {fields: {owners: 0}}),
      Users.find({_id: {$in: members}}, {fields: {profile: 1, roles: 1}})
    ];
  }

});
