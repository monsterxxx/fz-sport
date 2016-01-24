// Meteor.users.allow({
//   update: function (userId, user, fields, modifier) {
//     return true;
//   }
//   // ,fetch: ['trainer', 'admin', 'master']
// });

Meteor.users.deny({
  update: function() {
    return true;
  }
});

Meteor.methods({
  updateUserProfile: function (userId, profile) {
    check(userId, String);
    check(profile, {
      fname: String
    });

    if (! this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to update user profile.');
    }

    let user = Users.findOne(this.userId);

    if (! (userId === this.userId || user.role.admin)) {
      throw new Meteor.Error('no-permission',
        'Must be the user or admin to update user profile.');
    }

    Users.update({_id: userId}, {$set: {profile: profile}});

    if (Meteor.isServer) {
      let userToUpdate = Users.findOne(userId);

      // console.log(JSON.stringify(userToUpdate , null, 2));

      if (userToUpdate.system.client) {
        Clients.update({_id: userToUpdate.system.client._id}, {$set: {profile: profile}});
      }
    }

  },

  updateUserSettings: function (userId, role) {
    // console.log('updateUserSettings', userId, role);

    check(userId, String);
    check(role, {
      client: Match.Optional(Boolean),
      trainer: Match.Optional(Boolean),
      admin: Match.Optional(Boolean),
      master: Match.Optional(Boolean)
    });

    // console.log('checked!');

    if (! this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to update user role.');
    }

    let user = Users.findOne(this.userId);

    if (! (user.role.admin)) {
      throw new Meteor.Error('no-permission',
        'Must be an admin to update user role.');
    }

    if (Meteor.isServer) {
      let userToUpdate = Users.findOne(userId);

      // console.log(JSON.stringify(userToUpdate , null, 2));

      _.each(role, function (permition, module) {
        if (permition !== userToUpdate.role[module]) {

          if (['admin', 'master'].indexOf(module) >= 0) {
            throw new Meteor.Error('no-permission',
              'Admin cannot change admin or master permissions.');
          }
          if (module === 'client' && userToUpdate.system.client) {
            throw new Meteor.Error('invalid-action',
              'There are no ex-clients in the App.');
          }
          if (module === 'trainer'
            && (userToUpdate.trainer && Object.keys(userToUpdate.trainer).length > 0)) {
            throw new Meteor.Error('invalid-action',
              'There are no ex-trainers in the App.');
          }

        }
      });

      Users.update({_id: userId}, {$set: {role: role}});
    }

  }
});
