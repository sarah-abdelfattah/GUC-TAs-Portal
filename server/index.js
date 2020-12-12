// Imports
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const StaffMember = require('./models/StaffMember');
const Location = require('./models/Location');

// Create the app
const app = express();

// Use it with post
app.use(express.json());

//Getting Mongo's connection URI
const db = require('./config/keys_dev').mongoURI;

//Connecting to MongoDB
const connectionOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
mongoose
  .connect(db, connectionOptions)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// Init middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// TODO: use "routes"

// const locX = new Location({
//   type: 'Office',
//   location: 'C7.301',
//   capacity: 4,
// });
// locX.save();

// const staffX = new StaffMember({
//   gucId: '1233',
//   name: 'Ahmed Ashraf',
//   gender: 'male',
//   email: 'ahmed@mail.com',
//   password: '123445',
//   dayOff: 'Saturday',
//   salary: 99999,
//   type: 'Academic Member',
//   leaveBalance: 99,
//   officeLocation: locX,
//   role: 'Teaching Assistant',
// });
// staffX.save();

// StaffMember.find({ gucId: '1233' })
//   .populate('officeLocation')
//   .then((res) => {
//     console.log(res[0]);
//   });

// Handling 404
app.use((req, res) => {
  res.status(404).send({ err: 'We can not find what you are looking for' });
});

//runnin port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
  console.log(`BaseURL if local: http://localhost:${port}`);
});
