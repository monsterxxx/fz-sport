Meteor.methods({
  submitAttendance: function (group, date) {
    // console.log('submitAttendance');
    check(group, Match.ObjectIncluding({
      _id: String,
      clients: [Match.ObjectIncluding({
        _id: String,
        came: Match.Optional(Boolean)
      })]
    }));

    //TODO protect this method

    if (! this.userId) { throw new Meteor.Error('not-logged-in'); }

    const companyId = group.company._id;

    //FIND DATES
    const tzOffset = Companies.findOne(group.company._id, { fields: {'params.tz': 1} }).params.tz * 3600000,
          today = new Date(Date.now() + tzOffset).toISOString().slice(0, 10);

    //AUTH
    if (! Roles.userIsInRole(this.userId, ['owner', 'admin'], companyId)
        && ! (this.userId === group.trainer._id && date === today) ) {
      throw new Meteor.Error('no-permission',
        'Only owner admin or trainer of this group on the date of training can submit attendance'); }

    //PREPARE DATA
    group.date = date;
    group.edited = {
      at: new Date(),
      by: this.userId
    };
    //if user send to us a group (not groupDay) document:
    if (! group.group) {
      group.group = {
        _id: group._id,
        name: group.name
      };
      delete group._id;
    }

    //UPSERT ATTENDANCE RECORD
    const upsert = GroupDays.upsert({'group._id': group.group._id, date: date}, group);
  }
});
