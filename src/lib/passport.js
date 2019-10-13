const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

passport.use('local.signup', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    fullnameField: 'fullname',
    passReqToCallback: true
}, async (req,username,password,fullname,done)=>{
    console.log(req.body);
}));

passport.serializeUser((usr, done)=>{
    
})