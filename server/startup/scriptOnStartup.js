Meteor.startup(function () {

  Roles.removeUsersFromRoles('595TJFjchFatrF4TL', ['owner', 'admin'], 'vh3qq6xBZ6KdZX4Lz');

  // Roles.setUserRoles('595TJFjchFatrF4TL', ['owner'], 'vh3qq6xBZ6KdZX4Lz');

  //Roles.getGroupsForUser ( Meteor.userId())

    // Users.find({}).forEach(
    //     function (elem) {
    //         Users.update(
    //             {
    //                 _id: elem._id
    //             },
    //             {
    //                 $unset: {
    //                     'profile.fullname': ''
    //                 }
    //             }
    //         );
    //     }
    // );

});
