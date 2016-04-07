Meteor.methods({
  submitAttendance: function (group, dateISO) {
    // console.log('submitAttendance');
    check(group, Match.ObjectIncluding({
      _id: String,
      clients: [Match.ObjectIncluding({
        _id: String,
        came: Match.Optional(Boolean)
      })]
    }));

    //TODO protect this method

    const user = Users.findOne(this.userId, {fields: {roles: 1}}),
          companyId = group.company._id;

    if (! user) { throw new Meteor.Error('not-logged-in'); }

    //AUTH
    if (! Roles.userIsInRole(user, ['owner', 'admin', 'trainer'], companyId) ) {
      throw new Meteor.Error('no-permission',
      'Only owner admin or trainer can submit attendance'); }

    //FIND DATES
    const tz = Companies.findOne(group.company._id, { fields: {'params.tz': 1} }).params.tz,
          todayISO = fzDate.todayISO(tz);

    //AUTH
    if (Roles.getTopRole(user, companyId) === 'trainer'
        && ! (this.userId === group.trainer._id && dateISO === todayISO) ) {
      throw new Meteor.Error('no-permission',
      'Only trainer of this group and on the date of training can submit attendance'); }

    //PREPARE DATA
    group.date = fzDate.dateStart(dateISO, tz);
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
    group.att = _.reduce(group.clients, (count, client) => count + !!client.came, 0);

    const oldGroupDay = GroupDays.findOne(group._id, {fields: {att: 1, clients: 1}}),
          oldAtt = (oldGroupDay) ? oldGroupDay.att : 0,
          attDiff = group.att - oldAtt;

    //UPDATE ATTENDANCE STATS FOR CLIENTS
    group.clients.forEach((client, i) => {
      if (oldGroupDay && client.came !== oldGroupDay.clients[i].came
          || ! oldGroupDay) {
        let query = {'company._id': group.company._id, 'client._id': client._id, date: group.date};
        if (client.came) {
          ClientDays.upsert(query, {$inc: {att: 1}});
        } else {
          ClientDays.update(query, {$inc: {att: -1}});
          ClientDays.remove(_.extend({att: 0}, query));
        }
      }
    });

    // (maybe TODO - update instead of upserting to CompanyDays) if current attendance record existed, then update CompanyDays for this day

    //UPSERT ATTENDANCE RECORD
    GroupDays.upsert({_id: group._id}, group);
    CompanyDays.upsert({'company._id': group.company._id, date: group.date}, {$inc: {att: attDiff}});
    TrainerDays.upsert({'company._id': group.company._id, 'trainer._id': group.trainer._id, date: group.date}, {$inc: {att: attDiff}});
  },

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  journal: function (companyId, monthISO, trainerId) {
    check(companyId, String);
    check(monthISO, Match.Where((monthISO) => {
      check(monthISO, String);
      return !isNaN(Date.parse(monthISO));
    }));
    check(trainerId, Match.Optional(String));

    if (Meteor.isServer) {
      //AUTH
      if (! Roles.userIsInRole(this.userId, ['owner', 'admin', 'trainer'], companyId) ) {
        throw new Meteor.Error('no-permission',
        'Only owner admin or trainer can submit attendance'); }

      const tz = fzDate.getTz(companyId),
            from = fzDate.dateStart(monthISO, tz),
            to = fzDate.addMonths(from, 1),
            query = {$match: {'company._id': companyId, date: { $gte: from, $lt: to } }};

            console.log(from, to);

      if (Roles.userIsInRole(this.userId, ['owner', 'admin'], companyId)) {
        //TODO use unwind in the future (waiting for kadira to fix their meteor-aggregate package)
        if (trainerId) query.$match['trainer._id'] = trainerId;
        return GroupDays.aggregate(query, {$project: {date: 1, trainer: '$trainer.name', group: '$name', 'clients.name': 1, 'clients.came': 1}});
      }

      if (Roles.userIsInRole(this.userId, 'trainer', companyId)) {
        query.$match['trainer._id'] = this.userId;
        return GroupDays.aggregate(query, {$project: {date: 1, group: '$name', 'clients.name': 1, 'clients.came': 1}});
      }
    }
  }
});
