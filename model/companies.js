Meteor.methods({

  createCompany: function (company) {
    check(company, {
      name: String
    });

    if (! this.userId) throw new Meteor.Error('not-logged-in');

    const user = Meteor.user();

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
      _id: user._id,
      name: user.profile.fname
    }];
    company.owners = [{
      _id: user._id,
      name: user.profile.fname
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
  },

  searchMembers: function (companyId, text, surrogate) {
    check(companyId, String);
    check(text, String);
    check(surrogate, Boolean);

    if (! Roles.userIsInRole(this.userId, ['owner', 'admin', 'trainer'], companyId)) {
      throw new Meteor.Error('no-permission',
        'Must be owner, admin or trainer to search members of this company.');
    }

    //if email provided, search user in db by email
    if (/@/.test(text)) {
      let member = Users.find({ 'emails.address': text }, {fields: {profile: 1} }).fetch();
      if (member.length) return [{_id: member[0]._id, name: member[0].profile.fname}];
      else return [];
    }

    if (text) {
      const company = Companies.findOne(companyId, { fields: {members: 1}});
      let regex = new RegExp(text, 'i');

      let results = _.map(
        _.select(company.members, member => regex.test(member.name) && (surrogate || !member.surrogate)),
        (member) => { return {_id: member._id, name: member.name}; }
      );

      return results;
    } else {
      return [];
    }
  }

});
