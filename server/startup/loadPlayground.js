Meteor.startup(function () {
  var loadPlayground = false;
  if (loadPlayground) {

    Users.remove({});
    Groups.remove({});
    Clients.remove({});
    Leads.remove({});
    Attendance.remove({});

    Accounts.createUser({
      username: 'admin',
      email: 'admin@admin',
      password: '123456'
    });
    Meteor.users.update({username: 'admin'}, {$set: {'role.admin': true, profile: { fname: 'Карл Густав Юнг' }}});
    Accounts.createUser({
      username: 'trainer',
      email: 'trainer@trainer',
      password: '123456'
    });
    Meteor.users.update({username: 'trainer'}, {$set: {'role.trainer': true, profile: { fname: 'Попов Александр Степанович' }}});
    Accounts.createUser({
      username: 'trainer2',
      email: 'trainer2@trainer2',
      password: '123456'
    });
    Meteor.users.update({username: 'trainer2'}, {$set: {'role.trainer': true, profile: { fname: 'Колмогоров Андрей Николаевич' }}});
  }

});
