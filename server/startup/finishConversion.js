Meteor.startup(function () {
  const continueConversion = false;
  if (continueConversion) {
    Groups.update({}, {
      $unset: {clients: 1, server: 1},
      $set: {
        company: {
          _id: '3SZmDouNH87jpyxSH',
          name: 'FightZona'
        }
      }
    }, {multi: true});
    Clients.find({}).fetch().forEach((client) => {
      var name = client.name;
      var user = Users.findOne({'profile.fname': {$regex: name}});
      if (!user) {
        let id = createSurrogate({fname: client.name});
        user = Users.findOne({_id: id});
      }

      if (! user.client) {
        user.client = {
          groups: []
        }
      }
      client.groups.forEach((group) => {
        user.client.groups.push({
          _id: group._id,
          name: group.name,
          company: {
            _id: '3SZmDouNH87jpyxSH'
          }
        });
        Groups.update({_id: group._id}, {$push: {clients: {_id: user._id, name: user.profile.fname}}});
      });
      if (! user.roles) {
        user.roles = {
          '3SZmDouNH87jpyxSH': []
        };
      }
      user.roles['3SZmDouNH87jpyxSH'].push('client');
      Users.update({_id: user._id}, user);
      Companies.update({},{$push: {clients: {_id: user._id, name: user.profile.fname}}});
    });
    Users.find({}).fetch().forEach((user) => {
      Companies.update({},{$push: {members: {_id: user._id, name: user.profile.fname}}});
    });
    Users.update({}, {
      $set: {
        companies: [{
          _id: '3SZmDouNH87jpyxSH',
          name: 'FightZona'
        }]
      }
    }, {multi: true});
    Users.update({username: pavship}, {$set: {'companies.0.creator': true}});
    //Проследить, что все клиенты и члены добавлены в компанию
    //иначе использовать script в MongoChef:
    //   db.users.find({}).forEach(function(user) {
    // if (user.client){
    //     db.companies.update({},{$push: {clients: {_id: user._id, name: user.profile.fname}}});
    // }
    //   });
    Groups.update({}, {$push: {clients: {$each: [], $sort: {name: 1}}}}, {multi: true});
    Companies.update({}, {$push: {
      members: {$each: [], $sort: {name: 1}},
      owners: {$each: [], $sort: {name: 1}},
      admins: {$each: [], $sort: {name: 1}},
      trainers: {$each: [], $sort: {name: 1}},
      clients: {$each: [], $sort: {name: 1}}
    }});
    //Проследить, что одна компания и все отсортировано
  }
  const finishConversion = false;
  if (finishConversion) {
    //Проследить за *ндреевым Андреем
    Attendance.find({}).fetch().forEach((att) => {
      let date = fzDate.dateStart(fzDate.dateISO(att.createdAt, 3), 3),
          trainer = Users.findOne({'profile.fname': {$regex: att.trainer}}),
          group = Groups.findOne({name: att.group, 'trainer._id': trainer._id});
          groupDay = GroupDays.findOne({'group._id': group._id, date: date}),
          client = Users.findOne({'profile.fname': {$regex: att.client}});
      if (!groupDay) {
        groupDay = {};
        groupDay.date = date;
        groupDay.edited = {
          at: att.createdAt,
          by: 'cLx96uJGny5FJKiAh'
        };
        groupDay.group = {
          _id: group._id,
          name: group.name
        };
        groupDay.clients = group.clients;
        groupDayId = GroupDays.insert(groupDay);
        groupDay = GroupDays.findOne(groupDayId);
      }
      GroupDays.update({_id: groupDay._id, 'clients._id': client._id}, {$set: {'clients.$.came': true}, $inc: {att: 1}});
      CompanyDays.upsert({'company._id': group.company._id, date: groupDay.date}, {$inc: {att: 1}});
      TrainerDays.upsert({'company._id': group.company._id, 'trainer._id': group.trainer._id, date: groupDay.date}, {$inc: {att: 1}});
    });
  }
});
