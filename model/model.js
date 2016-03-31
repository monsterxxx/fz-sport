Users = Meteor.users;
Companies = new Mongo.Collection('companies');
Groups = new Mongo.Collection('groups');
// Clients = new Mongo.Collection('clients');
Leads = new Mongo.Collection('leads');
GroupDays = new Mongo.Collection('groups.days');
CompanyDays = new Mongo.Collection('companies.days');
TrainerDays = new Mongo.Collection('trainers.days');
ClientDays = new Mongo.Collection('clients.days');

// Attendance = new Mongo.Collection('attendance');
