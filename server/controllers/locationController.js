const ObjectId = require('mongoose').Types.ObjectId;
// const { handleError } = require("../utils/handleError");
// required models
const Location = require('../models/Location');

exports.getRoom = async function (req, res) {
    try {
        if (req.params.num === "all") {
            const result = await Location.find({ is_deleted: { $ne: true } });
            return res.send({ data: result });
        }
        else {
            const result = await Location.findOne({ location: req.params.num, is_deleted: { $ne: true } });
            if (result)
                return res.send({ data: result });
            else
                return res.send({ error: "Sorry no room with this location" });
        }
    } catch (err) {
        console.log("~ err", err);
        return res.send({ err: err })
    }
}

exports.createRoom = async function (req, res) {
    try {
        const { type, location, capacity } = req.body;

        //both are entered
        if (!type || !location || !capacity)
            return res.send({ error: "Missing details" })

        const roomFound = await Location.findOne({ location: location });
        if (roomFound) {
            if (!roomFound.is_deleted)
                return res.send({ error: "Sorry there is already a room with that location" })
            else {
                roomFound.type = type;
                roomFound.capacity = capacity;
                roomFound.is_deleted = false;
                const newRoom = await roomFound.save();
                return res.send({ data: newRoom })
            }
        } else {
            const newRoom = await Location.create(req.body);
            return res.send({ data: newRoom })
        }
    } catch (err) {
        console.log("~ err", err);
        return res.send({ err: err })
    }
};

exports.updateRoom = async function (req, res) {
    try {
        const type = req.body.type;
        const location = req.body.location;
        const capacity = req.body.capacity;

        if (!location)
            return res.send({ error: "Please enter the location of the room to be updated" })

        const newRoom = await Location.findOne({ location: location });
        if (!newRoom || newRoom.is_deleted)
            return res.send({ error: "No room with this location" })
        else {
            if (type)
                newRoom.type = type;
            if (capacity)
                newRoom.capacity = capacity;

            const updatedRoom = await newRoom.save();
            return res.send({ data: updatedRoom })
        }
    } catch (err) {
        console.log("~ err", err);
        return res.send({ err: err })
    }
}

exports.deleteRoom = async function (req, res) {
    try {
        const location = req.body.location;

        if (!location)
            return res.send({ error: "Location of the room to be deleted is required" })


        const room = await Location.findOne({ location: location });
        if (!room || room.is_deleted)
            return res.send({ error: "No room with this location is found" })
        else {
            room.is_deleted = true;
            await room.save();
            return res.send({ data: "Room deleted successfully" })
        }
    } catch (err) {
        console.log("~ err", err);
        return res.send({ err: err })
    }
}