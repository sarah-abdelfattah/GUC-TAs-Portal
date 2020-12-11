// Imports
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


// Create the app
const app = express();

// Use it with post
app.use(express.json());

//Getting Mongo's connection URI
const db = require('./config/keys').mongoURI;


//Connecting to MongoDB
mongoose.connect(db)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

// Init middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// TODO: use "routes"



// Handling 404
app.use((req, res) => {
    res.status(404).send({ err: 'We can not find what you are looking for' });
});


//runnin port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port}`));
