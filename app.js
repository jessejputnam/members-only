require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const User = require("./models/user");
const mongoose = require("mongoose");

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());

//! LOOK UP SESSION RULES, ESP ABOUT SECRET
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));

// START PASSPORT
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // Passwords match, log user in
          return done(null, user);
        } else {
          // Passwords do not match
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);

// User object is serialized and added to req.session.passport object
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());
// --- END PASSPORT

// Get access to currentUser variable in all views with locals object
// Must come after passport instantiation and before view renders
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// -------- ROUTES -------
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
