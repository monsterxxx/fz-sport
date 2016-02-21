Meteor.methods({

  createCompany: function (company) {
    check(company, {
      name: String
    });

    if (! this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to create new company.');
    }

    let user = Meteor.user();

    if (user.companies && _.any(user.companies, (company) => company.creator)) {
      throw new Meteor.Error('company-limit-exceed',
        'User can have only one company in the system');
    }

    if (! this.isSimulation) {
      if (Companies.findOne({name: company.name})) {
        throw new Meteor.Error('company-name-busy',
          'This company name is busy');
      }
    }

    company.createdAt = new Date();
    company.creator = user._id;
    company.members = [{
      _id: user._id
    }];
    company.owners = [{
      _id: user._id,
      name: user.profile.fname,
      user: true
    }];
    company.server = true;

    let id = Companies.insert(company);

    Users.update( { _id: this.userId }, {$push: { companies: { _id: id, name: company.name, creator: true } } } );

    Roles.addUsersToRoles(this.userId, 'owner', id);

    return {_id: id};
  },

  deleteCompany: function (id) {
    check(id, String);

    if (! this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to delete company.');
    }

    let user = Meteor.user();

    if (! user.companies || ! _.any(user.companies, (company) => company._id === id && company.creator)) {
      throw new Meteor.Error('no-permission',
        'Only creator of the company can delete it');
    }

    if (! this.isSimulation) {
      let company = Companies.findOne({_id: id});

      if (!company) {
        throw new Meteor.Error('not-found',
          'No such company in db');
      }

      let modifier = {
        $pull: { companies: { _id: id } },
        $unset: {}
      };
      modifier.$unset['roles.' + id] = '';

      company.members.forEach((member) => {
        if (member._id) {
          Users.update( {_id: member._id}, modifier );
        }
      });

      Companies.remove( {_id: id} );
    }
  }

});
