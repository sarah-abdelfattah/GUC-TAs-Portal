const ObjectId = require('mongoose').Types.ObjectId;

const StaffMember = require('../models/StaffMember');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');
const Course = require('../models/Course');

exports.addDepartment = async function (req, res) {
    try {
        const { facultyCode, depName, HOD } = req.body;

        //all data entered
        if (!facultyCode || !depName)
            return res.send({ error: "Please enter all details" });

        //faculty found? 
        let facultyFound = await Faculty.findOne({ code: facultyCode });
        if (!facultyFound)
            return res.send({ error: "No faculty with this code" });

        facultyFound = await (await Faculty.findOne({ code: facultyCode })).populate('faculty');

        //faculty found? 
        const depFound = await Department.findOne({ faculty: facultyFound._id, name: depName })
        if (depFound)
            return res.send({ error: "Sorry there is another department with this name" });

        let staffMember;
        if (HOD) {
            // staff found? 
            staffMember = (await StaffMember.findOne({ gucId: HOD })).populate('staffMember');
            if (!staffMember)
                return res.send({ error: "No staff member with this ID" });

            //staff is not TA and not HR 
            if (staffMember.role === 'Teaching Assistant' || staffMember.type === 'HR')
                return res.send({ error: "Sorry Head of the department cannot be Teaching Assistant or HR member" });

            if (!(staffMember.faculty.equals(facultyFound._id)))
                return res.send({ error: "Sorry Head of the department should be of the same faculty" });

            const depHOD = await Department.findOne({ HOD: staffMember._id })
            if (depHOD)
                return res.send({ error: "Sorry this staff is Head of another department" });
        } else {
            staffMember = undefined;
        }

        const newDep = {
            faculty: facultyFound,
            name: depName,
            HOD: staffMember,
            Courses: [],
        };

        const depCreated = await Department.create(newDep);
        return res.send({ data: depCreated });
    } catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
}

exports.updateDepartment = async function (req, res) {
    try {
        const { facultyCode, depName, HOD, newFacultyCode } = req.body;

        //all data entered
        if (!facultyCode || !depName || !(HOD || newFacultyCode))
            return res.send({ error: "Please enter all details" });

        //faculty found? 
        const facultyFound = await Faculty.findOne({ code: facultyCode }).populate('faculty');
        if (!facultyFound)
            return res.send({ error: "No faculty with this name" });

        const depFound = await Department.findOne({ name: depName }).populate('department');
        if (!depFound)
            return res.send({ error: "No department with this name" });

        if (HOD) {// staff found? 
            const staffMember = await (await StaffMember.findOne({ gucId: HOD })).populate('staffMember');
            if (!staffMember)
                return res.send({ error: "No staff member with this ID" });

            //staff is not TA and not HR 
            if (staffMember.role === 'Teaching Assistant' || staffMember.type === 'HR')
                return res.send({ error: "Sorry Head of the department cannot be Teaching Assistant or HR member" });

            //staff of the same faculty?
            if (!(staffMember.faculty.equals(facultyFound._id)))
                return res.send({ error: "Sorry Head of the department should be of the same faculty" });

            const dep = await Department.findOne({ HOD: staffMember._id, })
            if (dep && dep.HOD.name != HOD)
                return res.send({ error: "Sorry this staff is a HOD of another department" });

            depFound.HOD = staffMember;
        }

        if (newFacultyCode) {
            const newFacultyFound = await Faculty.findOne({ code: newFacultyCode }).populate();
            if (!newFacultyFound)
                return res.send({ error: "No faculty with this new name" });

            depFound.faculty = newFacultyFound;
        }

        const updatedDep = await depFound.save();
        return res.send({ data: updatedDep });
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

        const facultyFound = await Faculty.findOne({ code: faculty, });
        if (!facultyFound)
            return res.send({ error: "Sorry no faculty with this name" });

        let depFound = await Department.findOne({ faculty: facultyFound._id, name: department });
        if (!depFound)
            return res.send({ error: "Sorry no department with this name" });


        const courses = await Course.find({ department: depFound._id })
        for (let i = 0; i < courses.length; i++) {
            courses[i].department = undefined;
            await courses[i].save();
        }

        depFound = await Department.findOneAndDelete({ faculty: facultyFound._id, name: department });
        return res.send({ data: "Department deleted successfully" });
    } catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
}