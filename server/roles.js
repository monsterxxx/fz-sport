// var origRemove = Roles.removeUsersFromRoles;
//
// Roles.removeUsersFromRoles = function (users, roles, group) {
//   origRemove.call(this, users, roles, group);
//
//   _.each(users, function (user) {
//     var userId = "no-user",
//         unset = {$unset: {}};
//
//     if ("string" === typeof user) {
//       userId = user;
//     } else if ("object" === typeof user) {
//       userId = user._id;
//     }
//
//     if (Roles.getRolesForUser(userId, group).length === 0) {
//       unset.$unset['roles.' + group] = "";
//       Users.update({_id: userId}, unset);
//     }
//   });
// }
