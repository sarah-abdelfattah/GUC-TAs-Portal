const objectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const tokenKey = require('../config/keys').secretOrKey;

const StaffMember = require('../models/StaffMember');
const Location = require('../models/Location');

async function locationHelper(officeLocation) {
    //check if room is found
    const refLocation = await Location.findOne({
        location: officeLocation,
        is_deleted: { $ne: true },
    });
    if (!refLocation) return { error: 'Sorry room not found' };
    else {
        //room capacity for offices
        const occupied = await StaffMember.find({
            officeLocation: refLocation._id,
            is_deleted: { $ne: true }
        });
        if (occupied.length >= refLocation.capacity)
            return { error: 'Sorry room capacity is full' };
        else {
            return refLocation.id;
        }
    }
}

exports.registerStaff = async function (req, res) {
    try {
        const {
            name,
            gender,
            email,
            dayOff,
            salary,
            type,
            role,
            officeLocation,
        } = req.body;

        //check data needed is entered
        if (!name || !gender || !email || !salary || !officeLocation || !type)
            return res.send({ error: 'please enter all data' });

        if (type === 'Academic Member') {
            if (!aType || !course || !daysOff)
                return res.send({ error: 'please enter all data' });
        }

        //check email is found and if he was deleted
        const foundMail = await StaffMember.findOne({ email: email });
        if (foundMail) {
            if (foundMail.is_deleted) {
                foundMail.is_deleted = false;
                foundMail.name = name;
                foundMail.gender = gender;
                foundMail.dayOff = dayOff;
                foundMail.salary = salary;
                foundMail.type = type;
                foundMail.courses = [];
                foundMail.attendanceRecord = [];

                const locResult = await locationHelper(officeLocation);

                if (locResult.error) return res.send(locResult);
                else foundMail.officeLocation = locResult;

                if (type === 'Academic Member') foundMail.role = role;
                else foundMail.dayOff = 'Saturday';

                const newStaffMember = await foundMail.save();
                return res.send({ data: newStaffMember });
            } else
                return res.send({
                    error: 'Email is already registered to another staff',
                });
        }

        const locResult = await locationHelper(officeLocation);
        if (locResult.error) return res.send(locResult);
        else req.body.officeLocation = locResult;


        //setting the automatic Id
        const typeStaff = await StaffMember.find({ type: type });
        const num = typeStaff.length + 1;

        var idRole = 'HR';
        if (type === 'Academic Member') {
            if (idRole === 'Teaching Assistant') l = 'TA';
            else if (idRole === 'Course Instructor') l = 'CI';
            else if (idRole === 'Course Coordinator') l = 'CC';
            else if (idRole === 'HOD') l = 'HOD';
        }

        const temp = idRole + '-' + num;
        req.body.gucId = temp;

        req.body.attendanceRecord = [];
        req.body.courses = [];



        const newStaffMember = await StaffMember.create(req.body);
        return res.send({ data: newStaffMember });
    } catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
};

exports.updateStaff = async function (req, res) {
    try {
        const gucId = req.body.gucId;
        const name = req.body.name;
        const dayOff = req.body.dayOff;
        const salary = req.body.salary;
        const role = req.body.role;
        const leaveBalance = req.body.leaveBalance;
        const officeLocation = req.body.officeLocation;

        if (!gucId) return res.send({ error: 'Please enter the GUC-ID ' });

        const newStaff = await StaffMember.findOne({
            gucId: gucId,
            is_deleted: { $ne: true },
        });
        if (!newStaff || newStaff.is_deleted)
            return res.send({ msg: 'No staff with this id' });
        else {
            if (name) newStaff.name = name;
            if (dayOff) newStaff.dayOff = dayOff;
            if (salary) newStaff.salary = salary;
            if (role && newStaff.type === 'Academic Member') newStaff.name = role;
            if (leaveBalance) newStaff.leaveBalance = leaveBalance;
            if (officeLocation) {
                const locResult = await locationHelper(officeLocation);
                if (locResult.error) return res.send(locResult);
                else newStaff.officeLocation = locResult;
            }
        }

        const updatedStaff = await newStaff.save();
        return res.send({ data: updatedStaff });
    } catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
};

exports.deleteStaff = async function (req, res) {
    try {
        const gucId = req.body.gucId;

        if (!gucId) return res.send({ error: 'Please enter GUC-ID' });

        const staff = await StaffMember.findOne({ gucId: gucId });
        if (!staff || staff.is_deleted)
            return res.send({ error: 'No staff with this ID' });
        else {
            staff.is_deleted = true;
            const deletedStaff = await staff.save();
            return res.send({ data: 'Staff deleted successfully' });
        }
    } catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
};

exports.login = async function (req, res, next) {
    const guc_id = req.body.username;
    const password = req.body.password;

    //both are entered
    if (!guc_id || !password)
        return res.send({ error: 'Missing email or password' });

    passport.authenticate(
        'staffMembers',
        async function (err, staffMember, message) {
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
                    const token = jwt.sign(payload.toJSON(), tokenKey, {
                        expiresIn: '24h',
                    });
                    return res.json({ data: `Bearer ${token}`, info: payload });
                } catch (err) {
                    console.log('~ err', err);
                    return res.send({ err: err });
                }
            });
        }
    )(req, res, next);
};

exports.signIn = async function (req, res) {
    try {
        const gucId = req.body.gucId;

        if (!gucId) return res.send({ error: 'Please enter GUC-ID' });

        const staff = await StaffMember.findOne({
            gucId: gucId,
            is_deleted: { $ne: true },
        });
        if (!staff)
            return res.send({ error: 'Staff not registered in the system' });
        else {
            const currentTime = new Date();
            const newAttendance = {
                day: currentTime.getDay(),
                date:
                    currentTime.getFullYear() +
                    '-' +
                    (currentTime.getMonth() + 1) +
                    '-' +
                    currentTime.getDate(),
                startTime:
                    currentTime.getHours() +
                    ':' +
                    currentTime.getMinutes() +
                    ':' +
                    currentTime.getSeconds(),
                status: 'Present',
            };

            const attendanceRecord = staff.attendanceRecords;
            const result = await attendanceRecord.find(
                ({ date }) => date === newAttendance.date
            );
            if (result) return res.send({ error: 'Staff already signed in today' });
            else {
                attendanceRecord.push(newAttendance);
                staff.attendanceRecords = attendanceRecord;

                const updatedStaff = await staff.save();
                return res.send({ data: updatedStaff });
            }
        }
    } catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
};

exports.signOut = async function (req, res) {
    try {
        const gucId = req.body.gucId;

        if (!gucId)
            return res.send({ error: "Please enter the GUC-ID" });

        const staff = await StaffMember.findOne({ gucId: gucId, is_deleted: { $ne: true } })
        if (!staff)
            return res.send({ error: "Staff not registered in the system" });
        else {
            const today = new Date();
            const currentDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            const currentTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            let found = false;

            const attendanceRecord = staff.attendanceRecords;
            for (var i in attendanceRecord) {
                if (attendanceRecord[i].date === currentDate) {
                    found = true;

                    if (attendanceRecord[i].endTime)
                        return res.send({ error: "Sorry staff already signed out before" });

                    attendanceRecord[i].endTime = currentTime;
                    break;
                }
            }
            if (!found)
                return res.send({ error: "Sorry staff did not sign in today" });

            staff.attendanceRecords = attendanceRecord;

            const updatedStaff = await staff.save();
            return res.send({ data: updatedStaff });
        }
    } catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
};
