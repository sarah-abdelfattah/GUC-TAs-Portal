// Imports
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const methodOverride = require("method-override");


//Require Route Handlers
const staffMembers = require("./routes/staffMembers");


// Create the app
const app = express();

// Use it with post
app.use(express.json());
app.use(cors());

//Getting Mongo's connection URI
const db = require('./config/keys').mongoURI;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//Connecting to MongoDB
mongoose.connect(db)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

//Passport
app.use(passport.initialize());
app.use(passport.session());

// Init middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.get('/', function (req, res) {
//     res.send('HEY!');
// })

// TODO: use "routes"
app.use("/routes/staffMembers", staffMembers);


// Handling 404
// app.use((req, res) => {
//     res.status(404).send({ err: 'We can not find what you are looking for' });
// });


//runnin port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port}`));
