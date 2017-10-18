const express = require('express');
const handlebars = require('express-handlebars');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
// const path = require('path')

module.exports = (app, config) => {

    app.engine('.hbs', handlebars({
        defaultLayout: 'main',
        extname: '.hbs'
    }));

    // Set View Engine
    app.set('view engine', 'hbs');
    // app.set('views', path.join(config.rootPath, 'views'))

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(
        session({
            secret: '123456',
            resave: false,
            saveUninitialized: false
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        if (req.user) {
            res.locals.user = req.user;
        }
        next();
    });

    // Configure "public" folder
    app.use(express.static('./public'));

    app.use(function (req, res, next) {
        // if there's a flash message in the session request, make it available in the response, then delete it
        if (req.session.sessionFlash) {
            res.locals.messages = req.session.sessionFlash;
            delete req.session.sessionFlash;
        }
        next();
    });
};
