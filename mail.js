var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'firtreecorp@gmail.com',
    pass: 'dorianlebgdu34'
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
    mailOptions.text = "http://localhost:3300/confirme?token=" + token;
    if (type == "Create_User") {
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