Meteor.startup(function () {
    process.env.MAIL_URL='smtp://postmaster%40sandbox402fe10662264a4ab4cb9f7b5777abe5.mailgun.org:ad3decfaf0a88adb78383a8972d42dd9@smtp.mailgun.org:587/';
    // Email.send({
    //   to: '3645321@gmail.com',
    //   from: 'VANCHEZ SNOWBOARDS <yampolsky@fightzona.com>',
    //   subject: 'Some fancy top chiks at michelle saloon',
    //   text: 'Правы были ребята из креарс) Даже наше приложение может рассылать письма от имени любого адреса! Это же пипец, можно мутить дерзкий спам среди своих!))'
    // });
});
