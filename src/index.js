const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const { database } = require ('./keys');
const passport = require('passport');

//inicializar
const app = express();
require('./lib/passport')

//configurar
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname,'views'))
app.engine('.hbs',exphbs({
    'defaultLayout': 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname:'.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

//middleware
app.use(session({
    secret: 'nodemysql',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Global variables
app.use((req,res,next)=>{
    next();
    app.locals.success = req.flash('success');
})

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));

//Public
app.use(express.static(path.join(__dirname,'public')))

//Start server
app.listen(app.get('port'),()=>{
    console.log('server on port ', app.get('port'));
})