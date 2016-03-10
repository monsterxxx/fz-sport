Meteor.publish('attendance', function (companyId, date) {
  if (!this.userId) {return; }

  const company = Companies.findOne(companyId, { fields: {'params.tz': 1} }),
        tzOffset = (company) && company.params.tz,
        today = new Date(Date.now() + tzOffset).toISOString().slice(0, 10);

  if (Roles.userIsInRole(this.userId, ['owner', 'admin'], companyId)) {
    return GroupDays.find({'company._id': companyId, date: date}, {
      fields: {edited: 0}
    });
  }
  if (Roles.userIsInRole(this.userId, 'trainer', companyId) && today === date) {
    return GroupDays.find({'company._id': companyId, 'trainer._id': this.userId, date: date}, {
      fields: {edited: 0}
    });
  }

  return this.ready();
});
