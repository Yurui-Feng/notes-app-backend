require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const cors = require("cors");

const app = express();
const corsOptions = {
  origin: "http://localhost:3001",
  optionsSuccessStatus: 204,
  credentials: true,
};

app.use(cors(corsOptions));
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
      console.log("redirecting to home page");
      res.redirect("http://localhost:3001");
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

// Get all notes
app.get("/notes", ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.notes);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

// Create a new note
app.post("/notes", ensureAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body; // extract title and content from the request
    const note = { title, content }; // create a new note object

    // Find the user and update their notes array
    const user = await User.findById(req.user.id);
    user.notes.push(note);
    await user.save();

    res.status(201).json(note); // send the created note back
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

// // Get a single note
// app.get("/notes/:id", ensureAuthenticated, (req, res) => {
//   // code to get a single note
// });

// // Update a note
// app.put("/notes/:id", ensureAuthenticated, (req, res) => {
//   // code to update a note
// });

// Delete a note
app.delete("/notes/:id", ensureAuthenticated, async (req, res) => {
  const noteId = req.params.id;
  try {
    const user = await User.findById(req.user.id);
    console.log(user);
    console.log(noteId);
    user.notes = user.notes.filter((note) => note._id.toString() !== noteId);
    await user.save();
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
