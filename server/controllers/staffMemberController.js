const objectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const tokenKey = require('../config/keys').secretOrKey;

const { StaffMember } = require('../models/StaffMember');

exports.registerStaff = async function (req, res) {
    console.log("hereee");

    const { name, gender, email, daysOff, salary, officeLocation, type, aType, course } = req.body;

    if (!name || !gender || !email || !daysOff || !salary || !officeLocation || !type || !leaveBalance)
        return res.send({ error: "please enter all data" });

    if (type === "Academic Member") {
        if (!aType || !course)
            return res.send({ error: "please enter all data" });
    }

    req.body.attendanceRecord = [];

    const id = StaffMember.count() + 1;
    console.log("line 18 ~ id ", id);
    const temp = type + '-' + 1;
    req.body.GUCID = temp;

    try {
        const newStaffMember = await StaffMember.create(req.body);
        return res.send({ data: newStaffMember });
    } catch (err) {
        return res.send({ error: handleError(err) });
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