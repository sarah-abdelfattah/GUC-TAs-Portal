const objectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const tokenKey = require('../config/keys').secretOrKey;

const StaffMember = require('../models/StaffMember');
const Location = require('../models/Location');

exports.registerStaff = async function (req, res) {
    // officeLocation hyb2a da5l k string .. room number
    const { name, gender, email, daysOff, salary, officeLocation, type, aType, course } = req.body;

    //check data needed is entered
    if (!name || !gender || !email || !daysOff || !salary || !officeLocation || !type)
        return res.send({ error: "please enter all data" });

    if (type === "Academic Member") {
        if (!aType || !course)
            return res.send({ error: "please enter all data" });
    }

    //check email is unique
    const foundMail = await StaffMember.find({ email: email });
    if (foundMail.length != 0)
        return res.send({ error: "Email is already registered to another staff" });

    //check if room is found
    const refLocation = await Location.findOne({ location: officeLocation })
    if (!refLocation)
        return res.send({ error: "Sorry room not found" });

    req.body.officeLocation = refLocation._id;


    //room capacity for offices
    const occupied = await StaffMember.find({ officeLocation: refLocation._id });
    console.log("occupied", occupied.length);
    if (occupied.length >= refLocation.capacity)
        return res.send({ error: "Sorry room is full" });


    req.body.attendanceRecord = [];

    const typeStaff = (await StaffMember.find({ type: type }));
    const num = typeStaff.length + 1;
    const temp = type + '-' + num;
    req.body.GUCID = temp;

    console.log(req.body);
    try {
        const newStaffMember = await StaffMember.create(req.body);
        return res.send({ data: newStaffMember });
    } catch (err) {
        return res.send({ error: err });
    }
};


exports.login = async function (req, res, next) {
    const guc_id = req.body.username;
    const password = req.body.password;

    //both are entered
    if (!guc_id || !password)
        return res.send({ error: "Missing email or password" })

    passport.authenticate("staffMembers", async function (err, staffMember, message) {
        if (err) {
            return next(err);
        }
        //no member
        if (!staffMember) {
            return res.send({ error: message.message });
        }

        req.login(staffMember, async function (err) {
            try {
                const payload = await StaffMember.findOne({ GUCID: guc_id });
                const token = jwt.sign(payload.toJSON(), tokenKey, { expiresIn: '24h' });
                return res.json({ data: `Bearer ${token}`, info: payload });
            } catch (err) {
                return err;
            }
        });
    })(req, res, next);
};
