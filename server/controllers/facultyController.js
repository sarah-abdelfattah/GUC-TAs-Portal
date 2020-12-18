const ObjectId = require('mongoose').Types.ObjectId;

const Faculty = require('../models/Faculty');

exports.addFaculty = async function (req, res) {
    try {
        const code = req.body.code;
        const name = req.body.name;

        if (!name || !code)
            return res.send({ error: "Please enter all details" });

        let facultyFound = await Faculty.findOne({ code: code })
        if (facultyFound)
            return res.send({ error: "Sorry there is another faculty with the same code" });

        facultyFound = await Faculty.findOne({ name: name })
        if (facultyFound)
            return res.send({ error: "Sorry there is another faculty with the same name" });


        const newFaculty = {
            code: code,
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
        const code = req.body.code;
        const name = req.body.name;
        const newName = req.body.newName;

        if (!code || !name || !newName)
            return res.send({ error: "Please enter all details" });

        const facultyFound = await Faculty.findOne({ code: code, });
        if (!facultyFound)
            return res.send({ error: "No faculty with this code" });

        const nameFacultyFound = await Faculty.findOne({ name: newName });

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
        const code = req.body.code;

        if (!code)
            return res.send({ error: "Please enter the code of the faculty" });

        const facultyFound = await Faculty.findOne({ code: code });
        if (!facultyFound)
            return res.send({ error: "Sorry no faculty with this code" });

        await Faculty.findOneAndDelete({ code: code });
        return res.send({ data: "Faculty deleted successfully " });
    } catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
}