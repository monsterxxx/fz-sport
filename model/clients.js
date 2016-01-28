Meteor.methods({
  addClient: function (client, groupId) {
    check(client, Object);
    check(groupId, String);

    // console.log(client);

    if (! this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to insert new client.');
    }

    var user = Users.findOne(this.userId);

    if (! (user.role.trainer || user.role.admin)) {
      throw new Meteor.Error('no-permission',
        'Must be trainer or admin to insert new client.');
    }

    // console.log('groupId: '+groupId);

    var group = Groups.findOne(groupId);

    // console.log('group:'+ JSON.stringify(group , null, 2));

    if (client._id) {
      var matchClient = _.detect(group.clients, function (clientMatched) {
        return clientMatched._id === client._id;
      });

      if (matchClient) {
        throw new Meteor.Error('dublicate-not-allowed',
          'This client is presented in this group allready.');
      }

      client.groups.push({
        _id: group._id,
        name: group.name
      });
      client.groups = _.sortBy(client.groups, 'name');
      Clients.update({ _id: client._id }, { $set: { groups: client.groups } });
    }

    else {
      client.createdAt = new Date();
      client.groups = [{
        _id: group._id,
        name: group.name
      }];

      client._id = Clients.insert(client);
    }

    // console.log('client:' +JSON.stringify(client , null, 2));

    //Minimongo does not support update with $push, $each and $sort without $slice (mongodb feature since 2.6)
    // Groups.update( { _id: group._id }, {
    //   $push: {
    //     clients: {
    //       $each: [{
    //         _id: client._id,
    //         name: client.name
    //       }],
    //       $sort: { name: 1 }
    //     }
    //   }
    // });

    group.clients.push({
      _id: client._id,
      name: client.name
    });
    group.clients = _.sortBy(group.clients, 'name');
    Groups.update({_id: group._id}, { $set: {clients: group.clients} });
  }
});
