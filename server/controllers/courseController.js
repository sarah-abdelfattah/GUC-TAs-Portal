const ObjectId = require('mongoose').Types.ObjectId;

const Faculty = require('../models/Faculty');
const Department = require('../models/Department');
const Course = require('../models/Course');

const validation = require('../helpers/validation');

exports.addCourse = async function (req, res) {
    try {
        let JOI_Result = await validation.courseSchema.validateAsync(req.body)

        let { facultyCode, departmentName, courseName } = req.body;

        facultyCode = facultyCode.toUpperCase();

        //all data entered
        if (!departmentName || !courseName || !facultyCode)
            return res.send({ error: "Please enter all details" });

        //faculty found? 
        const facultyFound = await Faculty.findOne({ code: facultyCode }).populate('faculty');
        if (!facultyFound)
            return res.send({ error: "No faculty with this name" });

        //department found in faculty ? 
        const depFound = await Department.findOne({ faculty: facultyFound._id, name: departmentName }).populate('department');
        if (!depFound)
            return res.send({ error: "No department with this name" });

        //course found in department?
        const courseFound = await Course.findOne({ department: depFound._id, name: courseName });
        if (courseFound)
            return res.send({ error: "There is another course with this name under the same department" });

        const newCourse = {
            department: depFound,
            name: courseName,
            slots: [],
        };

        const courseCreated = await Course.create(newCourse);
        return res.send({ data: courseCreated });
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ JOI_validation_error: err.details[0].message });
        }
        console.log('~ err', err);
        return res.send({ err: err });
    }
}

exports.updateCourse = async function (req, res) {
    try {
        let JOI_Result = await validation.courseSchema.validateAsync(req.body)

        let { facultyCode, departmentName, courseName, newDepartment, newName } = req.body;

        facultyCode = facultyCode.toUpperCase();

        //all data entered
        if (!(newName || newDepartment))
            return res.send({ error: "Please enter newDepartment and/or newName" });

        //faculty found? 
        const facultyFound = await Faculty.findOne({ code: facultyCode }).populate();
        if (!facultyFound)
            return res.send({ error: "No faculty with this name" });

        //department found? 
        const depFound = await Department.findOne({ faculty: facultyFound._id, name: departmentName }).populate();
        if (!depFound)
            return res.send({ error: "No department with this name" });

        //course found ?
        const courseFound = await Course.findOne({ department: depFound._id, name: courseName }).populate();
        if (!courseFound)
            return res.send({ error: "No course with this name" });

        if (newDepartment) {
            const newDepFound = await Department.findOne({ faculty: facultyFound._id, name: newDepartment }).populate();
            if (!newDepFound)
                return res.send({ error: "No department with this new name under this faculty" });

            const course = await Course.findOne({ name: courseName })
            courseFound.department = newDepFound;
        }
        if (newName) {
            const nameFound = await Course.findOne({ department: newDepFound, name: courseName }).populate();
            if (nameFound)
                return res.send({ error: "Sorry there is another course with this name" });

            courseFound.name = newName;
        }

        const updatedCourse = await courseFound.save();
        return res.send({ data: "Course Updated Successfully" });

    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ JOI_validation_error: err.details[0].message });
        }
        console.log('~ err', err);
        return res.send({ err: err });
    }
}

exports.deleteCourse = async function (req, res) {
    try {
        let JOI_Result = await validation.courseSchema.validateAsync(req.body)

        let facultyCode = req.body.facultyCode;
        const departmentName = req.body.departmentName;
        const courseName = req.body.courseName;

        facultyCode = facultyCode.toUpperCase();

        if (!courseName || !departmentName || !facultyCode)
            return res.send({ error: "Please enter all details" });

        const facultyFound = await Faculty.findOne({ code: facultyCode });
        if (!facultyFound)
            return res.send({ error: "Sorry no faculty with this name" });

        const depFound = await Department.findOne({ faculty: facultyFound._id, name: departmentName });
        if (!depFound)
            return res.send({ error: "Sorry no department with this name" });

        const courseFound = await Course.findOne({ department: depFound._id, name: courseName });
        if (!courseFound)
            return res.send({ error: "Sorry no course with this name" });

        await Course.findOneAndDelete({ department: depFound._id, name: courseName });
        return res.send({ data: "Course deleted successfully" });
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ JOI_validation_error: err.details[0].message });
        }
        console.log('~ err', err);
        return res.send({ err: err });
    }
}