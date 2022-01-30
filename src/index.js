const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const multer = require('multer');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const passportLib = require('./config/passport')

require('./config/db')

// Initializations
const app = express();
require('./config/passport');

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/hbs')
}));
app.set('view engine', '.hbs')

// Middlewares
app.use(session({
    secret: 'notesmongo',
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use(async (req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    if(req.user == 'admin'){
        app.locals.a = 2
    }
    next();
})

// Routes
require('./app/routes/router.js')(app)


// Public
app.use(express.static(path.join(__dirname, 'public')))

// Start the server
app.listen(app.get('port'), () => {
    console.log(`[SERVER] Server on port ${app.get('port')}`);
})

app.use(function(req, res, next) {
    res.status(404).render('err/404');
});