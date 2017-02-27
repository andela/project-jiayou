var mongoose = require('mongoose'),
  User = mongoose.model('User');
var MongoClient = require('mongodb').MongoClient;
var sendMail = require('sendgrid').mail;
var dburl = process.env.DB_URL;
var transporter, message;
var sender = require('sendgrid').mail;
exports.invite = function (req, res) {
  fromEmail = 'fisayomi.ojuri@andela.com';
  subject = 'Invite to join Cards for Humanity game';
  content =
  `<html>\
  <body>\
    <label>Hello, <\label><br>\
    <p> I would like to invite you to join cards for humanity game. </p>\
    <p>Kindly click this  <a href = ='${req.body.link}'> link </a> to join</p>\
    <br><p>Regards,<p>jiayou team.</p></p>\
  </body>\
  </html>`;
  mailer = {
    personalizations: [{
      to: req.body.emailArray,
      subject: `${subject}`
    }],
    content: [{
      type: 'text/html',
      value: `${content}`
    }],
    from: { email: fromEmail }
  };
  var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mailer
  });

  sg.API(request, function (error, response) {
    res.send(response);
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
};

exports.getEmail = function (req, res) {
  var arr = [];
  User.find(function (err, users) {
    users.forEach((value, index) => {
      // console.log(value.email);
      arr.push(value.email);
    });
    res.send(arr);
  });
};
