const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helper = require('./helpers');

passport.use('local.signup', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    //fullnameField: 'fullname',
    passReqToCallback: true
}, async (req,username,password,done)=>{
    const {fullname} = req.body;
    const newUser = {
        username,
        password,
        fullname
    };
    newUser.password = await helper.encrypPassword(password);
    const result = await pool.query("INSERT INTO  users SET ?",[newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((usr, done)=>{
    done(null,usr.id)
});

passport.deserializeUser(async (id, done)=>{
    const row = await pool.query("SELECT * FROM users where id = ? ",[id]);
    done(null, row[0]);
});