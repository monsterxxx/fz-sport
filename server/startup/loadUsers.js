Meteor.startup(function () {

  // Meteor.users.update({username: 'admin'}, {$set: {'role.admin': true}}); //Works

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
