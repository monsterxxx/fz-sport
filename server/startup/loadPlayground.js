clearDb = function () {
  Users.remove({});
  Companies.remove({});
  Groups.remove({});
  Clients.remove({});
  Leads.remove({});
  GroupDays.remove({});
  CompanyDays.remove({});
  TrainerDays.remove({});
  ClientDays.remove({});
};

Meteor.startup(function () {
  const loadPlayground = false;
  if (loadPlayground) {

    clearDb();

    let userId;
    userId = Accounts.createUser({
      username: 'admin',
      email: 'admin@admin',
      password: '123456',
      profile: { fname: 'Карл Густав Юнг' }
    });
    Meteor.users.update( {username: 'admin'}, {$pull: { tasks: { id: 1 } } } );
    // Meteor.users.update({username: 'admin'}, {$set: {'role.admin': true, profile: { fname: 'Карл Густав Юнг' }}});
    Accounts.createUser({
      username: 'trainer',
      email: 'trainer@trainer',
      password: '123456',
      profile: { fname: 'Попов Александр Степанович' }
    });
    Meteor.users.update( {username: 'trainer'}, {$pull: { tasks: { id: 1 } } } );
    Accounts.createUser({
      username: 'trainer2',
      email: 'trainer2@trainer2',
      password: '123456',
      profile: { fname: 'Колмогоров Андрей Николаевич' }
    });
    Meteor.users.update( {username: 'trainer2'}, {$pull: { tasks: { id: 1 } } } );
  }

  const loadPlayground2 = false;
  if (loadPlayground2) {
    Meteor.call('loadPlayground2');
  }
});

Meteor.methods({
  loadPlayground2: function () {
    if (this.connection === null) {
      clearDb();

      let ids = {};
      const rusLetters = ['Эй Йо Кмон', 'Би Йо Вотсап', 'Си Синьор Мескузи', 'Ди Ри Жабль'];
      ['a', 'b', 'c', 'd'].forEach((letter, i) => {
        let id = Accounts.createUser({
          username: letter+letter+letter,
          email: letter + '@' + letter,
          password: '123456',
          profile: { fname: rusLetters[i] }
        });
        ids[letter] = id;
      });
      Meteor.users.update( {}, {$pull: { tasks: { id: 1 } } }, {multi: true} );
      // this.setUserId(ids['a']);
      // Meteor.loginWithPassword('a', '123456');
      // Meteor.call('createCompany', {name: 'ХоудиКо'});
      // const company = Companies.findOne();
      // const companyId = company._id;
      // Meteor.call('addUserToCompany', companyId, ids['b'], 'admin');
      // Meteor.call('addUserToCompany', companyId, ids['c'], 'trainer');
      // Meteor.call('createGroup', {
      //   company: {
      //     _id: companyId
      //   },
      //   trainer: {
      //     _id: ids['c']
      //   },
      //   name: 'Дрим Тим Долфиндс'
      // });
      // const group = Groups.findOne();
      // const groupId = group._id;
      // Meteor.call('addMemberToGroup', groupId, ids['d']);
      // this.setUserId(null);
    }
  }
});
