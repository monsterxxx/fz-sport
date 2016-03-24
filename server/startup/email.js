Meteor.startup(function () {
    process.env.MAIL_URL             = 'smtp://support%40fzsport.ru:0e5b05e81f67d41b42dc9a9e9048358f@smtp.mailgun.org:587/';
    Accounts.emailTemplates.siteName = 'FZSport';
    Accounts.emailTemplates.from     = 'FZSport <support@fzsport.ru>';
    Accounts.emailTemplates.verifyEmail = {
      subject() {
        return 'Подтвердите свой Email на FZSport';
      },
      text( user, url ) {
        const emailAddress   = user.emails[0].address,
              urlWithoutHash = url.replace( '#/verify-email', 'home/finish-registration' ),
              emailBody      = `Чтобы подтвердить свой адрес электронной почты (${emailAddress}) просто пройдите по ссылке:\n\n${urlWithoutHash}\n\n Спасибо!`;
        return emailBody;
      }
    };
    // Email.send({
    //   to: '3645321@gmail.com',
    //   from: 'VANCHEZ SNOWBOARDS <yampolsky@fightzona.com>',
    //   subject: 'Some fancy top chiks at michelle saloon',
    //   text: 'Правы были ребята из креарс) Даже наше приложение может рассылать письма от имени любого адреса! Это же пипец, можно мутить дерзкий спам среди своих!))'
    // });
});
