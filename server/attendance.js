GroupDays._ensureIndex({
  'company._id': 1
});
GroupDays._ensureIndex({
  'trainer._id': 1
});
GroupDays._ensureIndex({
  'date': 1
});

Meteor.publish('attendance', function (companyId, dateISO) {
  check(companyId, String);
  check(dateISO, String);
  const user = Users.findOne(this.userId, {fields: {roles: 1}});

  if (! Roles.userIsInRole(user, ['owner', 'admin', 'trainer'], companyId)) {
    return this.ready();
  }

  const tz = fzDate.getTz(companyId),
        todayISO = fzDate.todayISO(tz),
        dateStart = fzDate.dateStart(dateISO, tz);

  if (Roles.userIsInRole(user, ['owner', 'admin'], companyId)) {
    return GroupDays.find({'company._id': companyId, date: dateStart}, {
      fields: {edited: 0}
    });
  }
  if (Roles.userIsInRole(user, 'trainer', companyId) && dateISO === todayISO) {
    return GroupDays.find({'company._id': companyId, 'trainer._id': this.userId, date: dateStart}, {
      fields: {edited: 0}
    });
  }

  return this.ready();
});

CompanyDays._ensureIndex({
  'company._id': 1
});
CompanyDays._ensureIndex({
  'date': 1
});
TrainerDays._ensureIndex({
  'company._id': 1
});
TrainerDays._ensureIndex({
  'trainer._id': 1
});
TrainerDays._ensureIndex({
  'date': 1
});

Meteor.publish('att-widget', function (companyId, role, period) {
  check(companyId, String);
  check(role, Match.Where((role) => {
    check(role, String);
    return ~['owner', 'trainer', 'client'].indexOf(role);
  }));
  check(period, Match.Where((period) => {
    check(period, String);
    return ~['last31days', 'last364days'].indexOf(period);
    //TODO add ISO date periods like 2016-02 or 2016
  }));

  const tz = fzDate.getTz(companyId);
  let from,
  to;
  if (period === 'last31days') {
    to = fzDate.todayStart(tz);
    from = fzDate.addDays(to, -31);
  }
  // console.log(from, to);

  if (role === 'owner' && Roles.userIsInRole(this.userId, 'owner', companyId)) {
    return CompanyDays.find({
      'company._id': companyId,
      date: {
        $gte: from,
        $lte: to
      }
    }, {
      // fields: {edited: 0}
    });
  }

  if (role === 'trainer' && Roles.userIsInRole(this.userId, 'trainer', companyId)) {
    return TrainerDays.find({
      'company._id': companyId,
      'trainer._id': this.userId,
      date: {
        $gte: from,
        $lte: to
      }
    }, {
      // fields: {edited: 0}
    });
  }
});
