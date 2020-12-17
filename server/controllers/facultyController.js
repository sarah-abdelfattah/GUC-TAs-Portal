const ObjectId = require('mongoose').Types.ObjectId;
// const { handleError } = require("../utils/handleError");
const objectId = require('mongoose').Types.ObjectId;

const StaffMember = require('../models/StaffMember');
const Faculty = require('../models/Faculty');

exports.addFaculty = async function (req, res) {
    try {
        const name = req.body.name;

        if (!name)
            return res.send({ error: "Please enter the name of the faculty" });

        const facultyFound = await Faculty.findOne({ name: name })
        if (facultyFound) {
            if (facultyFound.is_deleted === false)
                return res.send({ error: "Sorry there is another faculty with the same name" });
            else {
                facultyFound.is_deleted = false;
                facultyFound.departments = [];
                const facultyCreated = await facultyFound.save();
                return res.send({ data: facultyCreated });
            }
        }

        const newFaculty = {
            name: name,
            departments: [],
        }

        const facultyCreated = await Faculty.create(newFaculty);
        return res.send({ data: facultyCreated });
    } catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
}

exports.updateFaculty = async function (req, res) {
    try {
        const name = req.body.name;
        const newName = req.body.newName;

        if (!name || !newName)
            return res.send({ error: "Please enter all details" });

        const facultyFound = await Faculty.findOne({ name: name, is_deleted: false });
        if (!facultyFound)
            return res.send({ error: "No faculty with this name" });

        const nameFacultyFound = await Faculty.findOne({ name: name, is_deleted: false });
        if (nameFacultyFound)
            return res.send({ error: "Sorry there is a new faculty with this name" });

        facultyFound.name = newName;

        const updatedFaculty = await facultyFound.save();
        return res.send({ data: updatedFaculty });
    } catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
}

exports.deleteFaculty = async function (req, res) {
    try {
        const name = req.body.name;

        if (!name)
            return res.send({ error: "Please enter the name of the faculty" });

        const facultyFound = await Faculty.findOne({ name: name });
        if (!facultyFound || !facultyFound.is_deleted == true)
            return res.send({ error: "Sorry no faculty with this name" });

        facultyFound.is_deleted = true;

        await facultyFound.save();
        return res.send({ data: "Faculty deleted successfully " });
    } catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
}

exports.addDepartment = async function (req, res) {
    try {
        const { faculty, name, HOD } = req.body;

        //all data entered
        if (!faculty || !name || !HOD)
            return res.send({ error: "Please enter all details" });

        //faculty found? 
        const facultyFound = await Faculty.findOne({ name: faculty, is_deleted: false })
        if (!facultyFound || facultyFound.is_deleted === true)
            return res.send({ error: "No faculty with this name" });

        // staff found? 
        const staffMember = await StaffMember.findOne({ gucId: HOD, is_deleted: false })
        if (!staffMember || staffMember.is_deleted)
            return res.send({ error: "No staff member with this ID" });

        //staff is not TA and not HR 
        if (staffMember.role === 'Teaching Assistant' || staffMember.type === 'HR')
            return res.send({ error: "Sorry Head of the department cannot be Teaching Assistant or HR member" });

        if (!(staffMember.faculty.equals(facultyFound._id)))
            return res.send({ error: "Sorry Head of the department should be of the same faculty" });

        const allDep = facultyFound.departments
        for (var i in allDep) {
            if (allDep[i].HOD.equals(staffMember._id)) {
                return res.send({ error: "Sorry this staff is a HOD of another department" });
            }

            if (allDep[i].name === name) {
                return res.send({ error: "Sorry this name is of another department" });
            }
        }

        const department = {
            name: name,
            HOD: staffMember._id,
            Courses: []
        }

        facultyFound.departments.push(department);
        const newFaculty = await facultyFound.save();

        return res.send({ data: newFaculty });
    } catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
}

exports.updateDepartment = async function (req, res) {
    try {
        const { faculty, department, HOD } = req.body;

        //all data entered
        if (!faculty || !name || !HOD)
            return res.send({ error: "Please enter all details" });

        //faculty found? 
        const facultyFound = await Faculty.findOne({ name: faculty, is_deleted: false })
        if (!facultyFound || facultyFound.is_deleted === true)
            return res.send({ error: "No faculty with this name" });

        // staff found? 
        const staffMember = await StaffMember.findOne({ gucId: HOD, is_deleted: false })
        if (!staffMember || staffMember.is_deleted)
            return res.send({ error: "No staff member with this ID" });

        //staff is not TA and not HR 
        if (staffMember.role === 'Teaching Assistant' || staffMember.type === 'HR')
            return res.send({ error: "Sorry Head of the department cannot be Teaching Assistant or HR member" });

        //staff of the same faculty?
        if (!(staffMember.faculty.equals(facultyFound._id)))
            return res.send({ error: "Sorry Head of the department should be of the same faculty" });


        let found = false;
        let allDep = facultyFound.departments
        for (var i in allDep) {
            if (allDep[i].name == department && allDep.is_deleted == false) {
                found = true;
                facultyFound.departments[i].HOD = staffMember._id;

                const updatedHOD = await facultyFound.save();
                return res.send({ data: updatedHOD });
            }
        }

        if (!found)
            return res.send({ error: "Sorry No department with this name" });

    } catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
}

exports.deleteDepartment = async function (req, res) {
    try {
        const faculty = req.body.faculty;
        const department = req.body.department;

        if (!faculty || !department)
            return res.send({ error: "Please enter all details" });

        const facultyFound = await Faculty.findOne({ name: faculty, is_deleted: false });
        if (!facultyFound)
            return res.send({ error: "Sorry no faculty with this name" });

        let found = false;
        let allDep = facultyFound.departments
        for (var i in allDep) {
            if (allDep[i].name == department && allDep.is_deleted == false) {
                found = true;
                facultyFound.departments[i].is_deleted = true;
                return res.send({ data: "Department deleted successfully " });
            }
        }

        if (!found)
            return res.send({ error: "Sorry no faculty with this name" });

    } catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
}