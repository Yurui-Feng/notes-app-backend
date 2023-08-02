require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// setup database connection
try {
  mongoose.connect("mongodb://localhost:27017/notesDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Database connected successfully");
} catch (error) {
  console.log(error);
}

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const userSchema = new mongoose.Schema({
  // email: String,
  googleId: String,
  notes: [noteSchema],
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
// setup passport for authentication
app.use(passport.initialize());
app.use(passport.session());

userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user._id,
      username: user.username,
      picture: user.picture,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

app
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: ["profile"] }));

app
  .route("/auth/google/secrets")
  .get(
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/");
    }
  );

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

// Create a new note
app.post("/notes", ensureAuthenticated, (req, res) => {
  // code to create a new note
});

// Get all notes
app.get("/notes", ensureAuthenticated, (req, res) => {
  // code to get all notes
});

// Get a single note
app.get("/notes/:id", ensureAuthenticated, (req, res) => {
  // code to get a single note
});

// Update a note
app.put("/notes/:id", ensureAuthenticated, (req, res) => {
  // code to update a note
});

// Delete a note
app.delete("/notes/:id", ensureAuthenticated, (req, res) => {
  // code to delete a note
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
