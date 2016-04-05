Meteor.startup(function () {
    process.env.MAIL_URL             = 'smtp://support%40fzsport.ru:75ncD7dRG6nhrw59N@smtp.mailgun.org:587/';
    // process.env.MAIL_URL             = 'smtp://support%40fzsport.ru:johnbarabulka@smtp.mailgun.org:587/';
    Accounts.emailTemplates.siteName = 'FZSport';
    Accounts.emailTemplates.from     = 'FZSport <support@fzsport.ru>';
    Accounts.emailTemplates.verifyEmail = {
      subject() {
        return 'Подтвердите свой Email на FZSport';
      },
      text( user, url ) {
        const emailAddress   = user.emails[0].address,
              urlWithoutHash = url.replace( '#/verify-email', 'home/finish-registration' ),
              emailBody      = `Чтобы подтвердить свой адрес электронной почты (${emailAddress}) просто пройдите по ссылке:\n\n${urlWithoutHash}\n\n Если Вы получили данное письмо по ошибке, просто проигнорируйте его.\n\nСпасибо!`; // jshint ignore:line
        return emailBody;
      }
    };
    // Email.send({
    //   to: '3645jojokoko@gmail.com',
    //   from: 'VANCHEZ SNOWBOARDS <yampolsky@fightzona.com>',
    //   subject: 'Some fancy top chiks at michelle saloon',
    //   text: 'Правы были ребята из креарс) Даже наше приложение может рассылать письма от имени любого адреса! Это же пипец, можно мутить дерзкий спам среди своих!))'
    // });
});
