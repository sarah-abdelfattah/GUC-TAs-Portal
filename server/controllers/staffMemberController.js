const objectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const tokenKey = require('../config/keys').secretOrKey;

const StaffMember = require('../models/StaffMember');
const Location = require('../models/Location');

exports.registerStaff = async function (req, res) {
    const { name, gender, email, dayOff, salary, type, role, officeLocation } = req.body;

    //check data needed is entered
    if (!name || !gender || !email || !salary || !officeLocation || !type)
        return res.send({ error: "please enter all data" });

    if (type === "Academic Member") {
        if (!role || !dayOff)
            return res.send({ error: "please enter all data" });
    } else {
        req.body.dayOff = "Saturday";
        req.body.courses = [];
    }

    //check email is unique
    const foundMail = await StaffMember.find({ email: email, is_deleted: { $ne: true } });
    if (foundMail.length != 0)
        return res.send({ error: "Email is already registered to another staff" });

    //check if room is found
    const refLocation = await Location.findOne({ location: officeLocation, is_deleted: { $ne: true } })
    if (!refLocation)
        return res.send({ error: "Sorry room not found" });

    req.body.officeLocation = refLocation._id;


    //room capacity for offices
    const occupied = await StaffMember.find({ officeLocation: refLocation._id });
    console.log("occupied", occupied.length);
    if (occupied.length >= refLocation.capacity)
        return res.send({ error: "Sorry room is full" });

    //setting the automatic Id
    const typeStaff = (await StaffMember.find({ type: type, is_deleted: { $ne: true } }));
    const num = typeStaff.length + 1;

    var l = 'HR';
    if (type === "Academic Member") {
        if (role === 'Teaching Assistant')
            l = 'TA';
        else if (role === 'Course Instructor')
            l = 'CI'
        else if (role === 'Course Coordinator')
            l = 'CC'
        else if (role === 'HOD')
            l = 'HOD'
    }
    const temp = l + '-' + num;
    req.body.gucId = temp;

    req.body.attendanceRecord = [];

    try {
        const newStaffMember = await StaffMember.create(req.body);
        return res.send({ data: newStaffMember });
    } catch (err) {
        return res.send({ error: err });
    }
};

exports.updateStaff = async function (req, res) {
    const gucId = req.body.gucId;
    const name = req.body.name;
    const password = req.body.password;
    const dayOff = req.body.dayOff;
    const salary = req.body.salary;
    const role = req.body.role;
    const leaveBalance = req.body.leaveBalance;
    const officeLocation = req.body.officeLocation;

    if (!gucId)
        return res.send({ error: "Missing details" })

    const newStaff = await StaffMember.findOne({ gucId: gucId, is_deleted: { $ne: true } });
    if (!newStaff || newStaff.is_deleted)
        return res.send({ msg: "No room with this location" })

    try {
        const newRoom = await StaffMember.findOneAndUpdate({ gucId: gucId, is_deleted: { $ne: true } }, { name: name, password: password, dayOff: dayOff, salary: salary, role: role, leaveBalance: leaveBalance, officeLocation: officeLocation });
        return res.send({ data: "Staff member updated sucessfully" })
    } catch (err) {
        return res.send({ error: err })
    }
};

exports.deleteStaff = async function (req, res) {
    const gucId = req.body.gucId;

    if (!gucId)
        return res.send({ error: "Missing details" })

    try {
        const room = await StaffMember.findOneAndUpdate({ gucId: gucId, is_deleted: { $ne: true } }, { is_deleted: true });
        return res.send({ data: "staff deleted successfully" })
    } catch (err) {
        return res.send({ error: err })
    }
}


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
                const payload = await StaffMember.findOne({ gucId: guc_id });
                const token = jwt.sign(payload.toJSON(), tokenKey, { expiresIn: '24h' });
                return res.json({ data: `Bearer ${token}`, info: payload });
            } catch (err) {
                return err;
            }
        });
    })(req, res, next);
};
