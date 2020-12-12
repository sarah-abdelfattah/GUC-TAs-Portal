const ObjectId = require('mongoose').Types.ObjectId;
// const { handleError } = require("../utils/handleError");
// required models
const Location = require('../models/Location');

exports.getRoom = async function (req, res) {
    if (req.params.num === "all") {
        const result = await Location.find({ is_deleted: { $ne: true } });
        return res.send({ data: result });
    }
    else {
        const result = await Location.findOne({ location: req.params.num, is_deleted: { $ne: true } });
        if (result)
            return res.send({ data: result });
        else
            return res.send({ msg: "Sorry no room with this location" });
    }
}

exports.createRoom = async function (req, res) {
    const { type, location, capacity } = req.body;

    //both are entered
    if (!type || !location || !capacity)
        return res.send({ error: "Missing details" })
    const roomFound = await Location.findOne({ location: location });
    if (roomFound)
        return res.send({ error: "Sorry there is already a room with that location" })

    try {
        const newRoom = await Location.create(req.body);
        return res.send({ data: newRoom })
    } catch (err) {
        return res.send({ error: err })
    }
};

exports.updateRoom = async function (req, res) {
    const location = req.body.location;
    const newCapacity = req.body.capacity;

    if (!location || !newCapacity)
        return res.send({ error: "Missing details" })

    const newRoom = await Location.findOne({ location: location });
    if (!newRoom || newRoom.is_deleted)
        return res.send({ msg: "No room with this location" })

    try {
        const newRoom = await Location.findOneAndUpdate({ location: location, is_deleted: { $ne: true } }, { capacity: newCapacity });
        return res.send({ data: newRoom })
    } catch (err) {
        return res.send({ error: err })
    }
}


exports.deleteRoom = async function (req, res) {
    const location = req.body.location;

    if (!location)
        return res.send({ error: "Missing details" })

    try {
        const room = await Location.findOneAndUpdate({ location: location }, { is_deleted: true });
        return res.send({ data: "Room deleted successfully" })
    } catch (err) {
        return res.send({ error: err })
    }
}