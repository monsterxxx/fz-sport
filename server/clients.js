Clients._ensureIndex({
  'name': 'text'
});

Meteor.publish('searchClients', function(name) {
  let user = Users.findOne(this.userId);

  if (name && (user.role.admin || user.role.trainer)) {
    return Clients.find(
      { $text: {
          $search: name
        }
      },
      {
        fields: {
          score: {
            $meta: 'textScore'
          }
        },
        sort: {
          score: {
            $meta: 'textScore'
          }
        }
      }
    );
  }
});
