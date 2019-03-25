var nodemailer = require('nodemailer');
var pass = require('./mdp')

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: pass.mailuser,
    pass: pass.mailpass
  }
});

var mailOptions = {
  from: 'firtreecorp@gmail.com',
  to: 'clement.chaptal@epitech.eu',
  subject: '[Confirmation] de mail',
  text: 'TEXT WALA TU VAS CONFIRMER FRR'
};

function sendMail(type, email, token) {
    mailOptions.to = email;
    if (type == "Create_User") {
        mailOptions.text = "http://localhost:3300/confirme?token=" + token;
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    }
    if (type == "Reset_Password") {
      mailOptions.text = "Here is your new password :" + token;
      transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      } else {
          console.log('Email sent: ' + info.response);
      }
    });
    }

}

var mail = {sendMail};
module.exports = mail;