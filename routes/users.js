var express = require('express');
var router = express.Router();
var session = require('express-session');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
//var condb = require('../models/connection.js');
var condb = require('../models/connections.js');
var s_user;
router.use(expressValidator());

//session 
router.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


// Connect Flash
router.use(flash());


// Global Vars
router.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.credentialreq = req.flash('credentialreq');
  res.locals.userexists = req.flash('userexists');
  res.locals.user = req.user || null;
  res.locals.user1 = req.flash('user1');
  next();
});




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET Login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
  
});


/* post login page. */

router.post('/login',function(req,res){

     req.checkBody('Username', 'Username is required').notEmpty();
     req.checkBody('Password', 'Username is required').notEmpty();
     var errors = req.validationErrors();

     var reqbody = req.body;

    if (errors){
      res.render('login', { flash: { type: 'alert-danger', messages: errors }});
    }
    else{
     // var ans = false;
      var loginans = condb.login(reqbody,function(answer)
      {
        console.log("users.js-->login: "+answer);

        if ( answer == true)
        {
          s_user = req.session;
         // console.log(s_user);
          s_user.username = req.body.Username;
          console.log(s_user);
           req.method = 'GET';
           var z = s_user.username;
           req.flash('user1',z);
           return res.redirect('profile');
        }

        else
        {
          req.method = 'GET';
          req.flash('credentialreq', 'Please Enter Valid login Credentials');
          //add code here to show error of wrong credential of userid & password
           return res.redirect('login');
        }
      });
     // console.log("users.js-->login: "+loginans);
      //req.method = 'GET';
     // return res.redirect('profile');
    }  

});



/* GET Signup page. */
router.get('/signup', function(req, res, next) {

  //session  check

  console.log('signup-session checking');
   s_user = req.session;
  console.log(s_user);
  s_user.username = req.body.Username;


  res.render('signup', { title: 'Express',errormsg:"" });
  
});



/* post profile page. */
router.get('/profile', function(req, res, next) {
  res.render('profile');
  
});



/* post Signup page. */
router.post('/signup', function(req, res) {

console.log('signup-session-post checking');
//session check
s_user = req.session;
//console.log(s_user);
s_user.username = req.body.Username;
console.log(s_user);

  //signup validation

  req.checkBody('first_name', 'first_name is required').notEmpty();
  req.checkBody('last_name', 'last_name is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password', 'Password leght should between 5 to 10').len(5,10);
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('display_name', 'display_name is required').notEmpty(); 
  req.checkBody('email', 'Enter Correct Email').isEmail();
  req.checkBody('password_confirmation', 'Passwords do not match').equals(req.body.password);


  //console.log(req.body);
  var reqbody = req.body;

  
  //Validation Error
  var errors = req.validationErrors();
  //console.log(errors);
    if (errors) {
     
          var a = {errorsmsg:errors};
          //console.log(a.errorsmsg);
          var b = JSON.stringify(a.errorsmsg);
          var c = a.errorsmsg;
          console.log('length:'+a.errorsmsg.length);
          // res.render('signup', {errorsmsg:a.errorsmsg});
          res.render('signup',{errormsg: b});
           
               }
    else {

  //DATABASE connection PLUS insert query
    //condb.condb(reqbody);
    var signupans= condb.inserting(reqbody,function(returnval)
    {
      console.log("signup return",returnval);

      if(returnval == true)
      {
        req.method = 'GET';
        req.flash('success_msg', 'You are registered and can now login');
        return res.redirect('login');
      }
      else
      {
         req.method = 'GET';
        req.flash('userexists', 'User Already Exists');
        return res.redirect('signup');
      }
    });

   
        }

    }); //end signup


module.exports = router;
//module.exports = s_user;