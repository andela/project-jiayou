var mongoose = require('mongoose'),
  User = mongoose.model('User');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var secret = process.env.SECRET;
var dotEnv = require('dotenv');
dotEnv.config();

exports.userAuth = function (req, res) {
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) {
      return res.json({ success: false, message: 'An unexpected error occurred' });
    }
    if (!user) {
      res.send({ success: false, message: 'Authentication failed user not found' });
    } else if (user.authenticate(req.body.password)) {
      var token = jwt.sign(user, secret);
        // use moment to state that the token will last for 5 hours
      res.json({ success: true, userEmail: req.body.email, token: `${token}`, user: user, expDate: moment().add(5, 'hours') });
    } else {
      res.send({ success: false, message: 'Authentication failed wrong password' });
    }
  });
};
