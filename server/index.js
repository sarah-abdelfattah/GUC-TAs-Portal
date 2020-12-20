// Imports
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const tokenKey = require('./config/keys').secretOrKey;

const Token = require('./models/Token');

//Require Route Handlers
const logIn = require('./routes/logIn');
const attendances = require('./routes/attendances');
const courses = require('./routes/courses');
const departments = require('./routes/departments');
const faculties = require('./routes/faculties');
const locations = require('./routes/locations');
const slots = require('./routes/slots');
const staffMembers = require('./routes/staffMembers');


// Create the app
const app = express();

// Use it with post
app.use(express.json());
app.use(cors());

//Getting Mongo's connection URI
const db = require('./config/keys').mongoURI;
const { cpuUsage } = require("process");
const { login } = require("./controllers/staffMemberController");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

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
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//seeding
//const dummy = require('./seeding');
const { find } = require("./models/Token");
//dummy.seedDB();


//All routes should be tested for auth except login
app.use('/logIn', logIn);

app.all('*', async (req, res, next) => {
    try {
        const token = req.header('auth-token');
        // const token = req.headers.token;

        if (token == null)
            return res.sendStatus(401) // there isn't any token

        const tokenFound = await Token.findOne({ tokenId: token })
        if (tokenFound) {
            if (!tokenFound.valid) {
                return res.sendStatus(401)
            }
        } else {
            res.send("Sorry no token found in db");
        }

        req.user = jwt.verify(token, tokenKey);
        next();
    } catch (err) {
        console.log("~ err", err);
        res.send({ err: err })
    }
});

app.use('/attendances', attendances);
app.use('/courses', courses);
app.use('/departments', departments);
app.use('/faculties', faculties);
app.use('/locations', locations);
app.use('/slots', slots);
app.use('/staffMembers', staffMembers);

app.post('/logOut', async function (req, res) {
    const tokenFound = await Token.findOne({ tokenId: req.header('auth-token') })
    if (tokenFound) {
        if (tokenFound.valid) {
            tokenFound.valid = false;
            await tokenFound.save();
            res.send("Logged out successfully");
        }
    } else {
        res.send("Sorry no token found in db");
    }
});


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
// app.use((req, res) => {
//     res.status(404).send({ err: 'We can not find what you are looking for' });
// });

// Handling 404
// app.use((req, res) => {
//     res.status(404).send({ err: 'We can not find what you are looking for' });
// });


//running port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server up and running on port ${port}`));
