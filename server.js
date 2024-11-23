const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');
require('dotenv').config();

const dbUrl = process.env.DB_URL;
const User = require('./models/user');

if (!dbUrl) {
    console.error("MongoDB URI is not defined. Set the MONGODB_URI environment variable.");
    process.exit(1);
  }

mongoose.connect(dbUrl, {})
   .then(() => {
        console.log('Connected to DB');
    })
   .catch(err => {
        console.log(err);
        process.exit(0); 
    });

const sessionOptions = {
    secret : "c1c13D#2E!3D#2E!c13c13D#2E!D#2E!",
    resave : false,
    saveUninitialized: false
};

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(expressSession(sessionOptions));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
      res.send(200);
    } else {
        next();
    }
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Routers
const recordsRoutes = require('./routes/records');
const authRoutes = require('./routes/auth');

app.use('/auth', authRoutes);
app.use('/records', recordsRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});