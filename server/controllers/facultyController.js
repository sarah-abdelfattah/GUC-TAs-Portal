const ObjectId = require('mongoose').Types.ObjectId;
// const { handleError } = require("../utils/handleError");
const objectId = require('mongoose').Types.ObjectId;

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
                facultyFound.is_deleted = true;
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

exports.deleteFaculty = async function (req, res) {
    try {
        const name = req.body.name;

        if (!name)
            return res.send({ error: "Please enter the name of the faculty" });

        const facultyFound = await Faculty.findOne({ name: name });
        if (!facultyFound)
            return res.send({ error: "Sorry no faculty with this name" });

        facultyFound.is_deleted = true;

        await facultyFound.save();
        return res.send({ data: "Faculty deleted successfully " });
    } catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
}