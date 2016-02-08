Users = Meteor.users;
Companies = new Mongo.Collection('companies');
Groups = new Mongo.Collection('groups');
Clients = new Mongo.Collection('clients');
Leads = new Mongo.Collection('leads');
Attendance = new Mongo.Collection('attendance');

//debug methods
// Meteor.methods({
//   removeUsersFromRoles: function () {
//
//   }
// });
