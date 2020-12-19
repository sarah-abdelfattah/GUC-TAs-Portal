const ObjectId = require('mongoose').Types.ObjectId;

const Faculty = require('../models/Faculty');
const Department = require('../models/Department');
const Course = require('../models/Course');

exports.addCourse = async function (req, res) {
    try {
        const { faculty, department, name } = req.body;

        //all data entered
        if (!department || !name)
            return res.send({ error: "Please enter all details" });

        //faculty found? 
        const facultyFound = await Faculty.findOne({ code: faculty }).populate();
        if (!facultyFound)
            return res.send({ error: "No faculty with this name" });

        //department found? 
        const depFound = await Department.findOne({ faculty: facultyFound._id, name: department }).populate();
        if (!depFound)
            return res.send({ error: "No department with this name" });

        //course found ?
        const courseFound = await Course.findOne({ department: depFound._id, name: name }).populate();
        if (courseFound)
            return res.send({ error: "There is another course with this name" });

        const newCourse = {
            department: depFound,
            name: name,
            slots: [],
        };

        const courseCreated = await Course.create(newCourse);
        return res.send({ data: courseCreated });
    } catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
}

exports.updateCourse = async function (req, res) {
    try {
        const { faculty, department, name, newDepartment, newName } = req.body;

        //all data entered
        if (!faculty || !department || !name)
            return res.send({ error: "Please enter all details" });

        //faculty found? 
        const facultyFound = await Faculty.findOne({ code: faculty }).populate();
        if (!facultyFound)
            return res.send({ error: "No faculty with this name" });

        //department found? 
        const depFound = await Department.findOne({ faculty: facultyFound._id, name: department }).populate();
        if (!depFound)
            return res.send({ error: "No department with this name" });

        //course found ?
        const courseFound = await Course.findOne({ department: depFound._id, name: name }).populate();
        if (!courseFound)
            return res.send({ error: "No course with this name" });


        if (newDepartment) {
            const newDepFound = await Department.findOne({ faculty: facultyFound._id, name: newDepartment }).populate();
            if (!newDepFound)
                return res.send({ error: "No department with this new name under this faculty" });

            courseFound.department = newDepFound;
        }
        if (newName) {
            const nameFound = await Course.findOne({ name: newName }).populate();
            if (nameFound)
                return res.send({ error: "Sorry there is another course with this name" });

            courseFound.name = newName;
        }

        const updatedCourse = await courseFound.save();
        return res.send({ data: updatedCourse });

    } catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
}

exports.deleteCourse = async function (req, res) {
    try {
        const faculty = req.body.faculty;
        const department = req.body.department;
        const course = req.body.course;

        if (!course || !department || !faculty)
            return res.send({ error: "Please enter all details" });

        const facultyFound = await Faculty.findOne({ code: faculty });
        if (!facultyFound)
            return res.send({ error: "Sorry no faculty with this name" });

        const depFound = await Department.findOne({ faculty: facultyFound._id, name: department });
        if (!depFound)
            return res.send({ error: "Sorry no department with this name" });

        const courseFound = await Course.findOne({ department: depFound._id, name: course });
        if (!courseFound)
            return res.send({ error: "Sorry no course with this name" });

        await Course.findOneAndDelete({ department: depFound._id, name: course });
        return res.send({ data: "Course deleted successfully" });
    } catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
}