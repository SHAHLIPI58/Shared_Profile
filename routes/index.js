var express = require('express');
var session = require('express-session');
var router = express.Router();
var s_user;

//session 
router.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

/* GET home page. */
router.get('/', function(req, res, next) {
  s_user = req.session;
  //console.log(s_user);
  s_user.username = req.body.Username;
  console.log(s_user);
  res.render('index', { title: '' });
});


module.exports = router;
