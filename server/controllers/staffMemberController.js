const objectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenKey = require('../config/keys').secretOrKey;

const StaffMember = require('../models/StaffMember');
const Location = require('../models/Location');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');

const validation = require('../helpers/validation');


async function locationHelper(officeLocation) {
    //check if room is found
    const refLocation = await Location.findOne({
        location: officeLocation,
        is_deleted: { $ne: true },
    }).populate('officeLocation');
    if (!refLocation) return { error: 'Sorry room not found' };
    else {
        //room capacity for offices
        const occupied = await StaffMember.find({
            officeLocation: refLocation._id,
            is_deleted: { $ne: true }
        });
        if (occupied.length >= refLocation.capacity)
            return { error: 'Sorry room capacity is full' };
        else if (refLocation.type != 'Office') {
            return { error: 'Sorry this is not an office' };
        } else {
            return refLocation;
        }
    }
}

async function facultyHelper(facultyCode) {
    //check if faculty is found
    const refFaculty = await Faculty.findOne({
        code: facultyCode,
        is_deleted: { $ne: true },
    }).populate('faculty')
    if (!refFaculty) return { error: 'Sorry Faculty not found' };

    return refFaculty;
}

async function departmentHelper(relatedFaculty, depName) {
    //check if department is found
    const faculty = await (await Faculty.findOne({ code: relatedFaculty, is_deleted: { $ne: true } })).populate('faculty');

    const refDepartment = await Department.findOne({ faculty: faculty, name: depName, is_deleted: { $ne: true } }).populate('department')
    if (!refDepartment) return { error: 'Sorry Department not found' };

    return refDepartment;
}

async function updateInfoHelper(user) {
    let JOI_Result = await validation.updateSchema.validateAsync(user)

    const gucId = user.gucId;
    const dayOff = user.dayOff;
    const role = user.role;
    const officeLocation = user.officeLocation;
    const gender = user.gender;

    const newStaff = await StaffMember.findOne({ gucId: gucId });
    if (!newStaff)
        return { error: 'No staff with this id' };

    else {
        if (gender) {
            newStaff.gender = gender
        }

        if (officeLocation) {
            const locResult = await locationHelper(officeLocation);
            if (locResult.error) return res.send(locResult);
            else newStaff.officeLocation = locResult;
        }

        if (newStaff.type === 'Academic Member') {
            if (dayOff) newStaff.dayOff = dayOff;
            if (role) newStaff.role = role;
        }


        const updatedStaff = await newStaff.save();
        return { data: updatedStaff }
    }
}

exports.registerStaff = async function (req, res) {
    try {
        let JOI_Result = await validation.registerSchema.validateAsync(req.body)

        if (req.body.type === 'Academic Member')
            JOI_Result = await validation.registerACSchema.validateAsync(req.body)

        const {
            name,
            gender,
            email,
            salary,
            officeLocation,
            type,
            role,
            dayOff,
            faculty,
            department
        }
            = req.body;


        //check data needed is entered
        // if (!name || !gender || !email || !salary || !officeLocation || !type)
        //     return res.send({ error: 'please enter all data' });

        // if (type === 'Academic Member') {
        //     if (!role || !dayOff || !faculty || !department)
        //         return res.send({ error: 'please enter all data' });
        // }

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
                foundMail.password = await bcrypt.hash('123456', 12);

                const locResult = await locationHelper(officeLocation);

                if (locResult.error) return res.send(locResult);
                else foundMail.officeLocation = locResult;

                if (type === 'Academic Member') {
                    foundMail.role = role;

                    const facultyResult = await facultyHelper(faculty);

                    if (facultyResult.error) return res.send(facultyResult);
                    else foundMail.faculty = facultyResult;

                    const departmentResult = await departmentHelper(faculty, department);

                    if (departmentResult.error) return res.send(departmentResult);
                    else foundMail.department = departmentResult;
                }
                else {
                    foundMail.dayOff = 'Saturday';
                    foundMail.role = undefined;
                    foundMail.faculty = undefined;
                    foundMail.department = undefined;
                }

                const newStaffMember = await foundMail.save();
                return res.send({ data: newStaffMember });
            } else
                return res.send({
                    error: 'Email is already registered to another staff',
                });
        }

        if (type === 'Academic Member') {
            req.body.role = role;

            const facultyResult = await facultyHelper(faculty);

            if (facultyResult.error) return res.send(facultyResult);
            else req.body.faculty = facultyResult;


            const departmentResult = await departmentHelper(faculty, department);

            if (departmentResult.error) return res.send(departmentResult);
            else req.body.department = departmentResult;
        }
        else {
            req.body.dayOff = 'Saturday';
            req.body.role = undefined;
            req.body.faculty = undefined;
            req.body.department = undefined;
        }

        const locResult = await locationHelper(officeLocation);
        if (locResult.error) return res.send(locResult);
        else req.body.officeLocation = locResult;

        //setting the automatic Id
        const typeStaff = await StaffMember.find({ type: type });
        const num = typeStaff.length + 1;

        var idRole = 'HR';
        if (type === 'Academic Member') {
            idRole = 'AC'
        }

        const temp = idRole + '-' + num;
        req.body.gucId = temp;

        req.body.attendanceRecord = [];
        req.body.courses = [];
        req.body.password = await bcrypt.hash('123456', 12);;


        const newStaffMember = await StaffMember.create(req.body);
        return res.send({ data: newStaffMember });
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ JOI_validation_error: err });
        }
        console.log('~ err', err);
        return res.send({ err: err });
    }
};

exports.updateStaff = async function (req, res) {
    try {
        let JOI_Result = await validation.updateSchema.validateAsync(req.body)

        const gucId = req.body.gucId;
        const name = req.body.name;
        const dayOff = req.body.dayOff;
        const role = req.body.role;
        const leaveBalance = req.body.leaveBalance;
        const officeLocation = req.body.officeLocation;
        const faculty = req.body.faculty;
        const department = req.body.department;

        if (!req.body.gucId) return res.send({ error: 'Please enter the GUC-ID ' });
        const newStaff = await StaffMember.findOne({ gucId: req.body.gucId });
        if (!newStaff)
            return res.send({ error: 'No staff with this id' });

        if (req.body.leaveBalance) newStaff.leaveBalance = leaveBalance;

        if (req.body.faculty && req.body.department && newStaff.type === 'Academic Member') {
            const facultyResult = await facultyHelper(faculty);

            if (facultyResult.error) return res.send(facultyResult);
            else newStaff.faculty = facultyResult;
        } else newStaff.faculty = undefined
        if (req.body.department && newStaff.type === 'Academic Member') {
            const departmentResult = await departmentHelper(newStaff.faculty, department);

            if (departmentResult.error) return res.send(departmentResult);
            else foundMail.department = departmentResult;
        } else newStaff.department = undefined

        await newStaff.save();

        const user = req.body;
        const result = await updateInfoHelper(user);

        return res.send(result);
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ JOI_validation_error: err });
        }
        console.log('~ err', err);
        return res.send({ err: err });
    }
};

exports.deleteStaff = async function (req, res) {
    try {
        let JOI_Result = await validation.updateSchema.validateAsync(req.body)

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
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ JOI_validation_error: err });
        }
        console.log('~ err', err);
        return res.send({ err: err });
    }
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
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ JOI_validation_error: err });
        }
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
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ JOI_validation_error: err });
        }
        console.log('~ err', err);
        return res.send({ err: err });
    }
};


exports.changePassword = async function (req, res) {
    try {
        let JOI_Result = await validation.changePasswordSchema.validateAsync(req.body)

        const user = req.user;
        const newPassword = req.body.newPassword;
        const oldPassword = req.body.oldPassword;

        if (!newPassword)
            return res.send({ error: 'Please enter the new password' });
        if (!oldPassword)
            return res.send({ error: 'Please enter the old password' });

        const userToEdit = await StaffMember.findOne({ gucId: user.gucId });
        if (!userToEdit)
            return res.send({ err: 'No user' });

        //Checking if oldPassword matches the user password
        const check = await bcrypt.compare(oldPassword, userToEdit.password);
        if (check) {
            // const salt = await bcrypt.genSalt(12);
            userToEdit.password = await bcrypt.hash(newPassword, 12);
            const updatedStaff = await userToEdit.save();
            return res.send({ data: "Password changed successfully" });
        } else {
            return res.send({ error: 'wrong password' });
        }
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ JOI_validation_error: err });
        }
        console.log('~ err', err);
        return res.send({ err: err });
    }
}

exports.updateProfile = async function (req, res) {
    try {
        let user = req.user;
        req.body.gucId = req.user.gucId;

        user = req.body;
        const result = await updateInfoHelper(user);

        return res.send(result);
    } catch (err) {
        console.log(err)
        return res.send({ err: err })
    }
}

exports.getProfile = async function (req, res) {
    try {
        const user = req.user;
        const staff = await StaffMember.findOne({ gucId: user.gucId });
        if (!staff)
            return res.send({ err: 'No user' });

        return res.send({ data: staff });
    } catch (err) {
        console.log(err)
        return res.send({ err: err })
    }

}