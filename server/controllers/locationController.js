const ObjectId = require('mongoose').Types.ObjectId;
const Location = require('../models/Location');

const locationValidation = require('../helpers/validation/locationValidation');


exports.getRoom = async function (req, res) {
    try {
        let JOI_Result = await staffMemberValidation.getRoomSchema.validateAsync({ params: req.params.num })

        if (req.params.num === "all") {
            const result = await Location.find();
            return res.send({ data: result });
        }
        else {
            const result = await Location.findOne({ location: req.params.num });
            if (result)
                return res.send({ data: result });
            else
                return res.send({ error: "Sorry no room with this location" });
        }
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ JOI_validation_error: err });
        }
        console.log("~ err", err);
        return res.send({ err: err })
    }
}

exports.createRoom = async function (req, res) {
    try {
        let JOI_Result = await staffMemberValidation.createRoomSchema.validateAsync(req.body)

        const { type, location, capacity } = req.body;

        //both are entered
        if (!type || !location || !capacity)
            return res.send({ error: "Missing details" })

        const roomFound = await Location.findOne({ location: location });
        if (roomFound)
            return res.send({ error: "Sorry there is already a room with that location" })

        const newRoom = await Location.create(req.body);
        return res.send({ data: newRoom })
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ JOI_validation_error: err });
        }
        console.log("~ err", err);
        return res.send({ err: err })
    }
};

exports.updateRoom = async function (req, res) {
    try {
        let JOI_Result = await staffMemberValidation.updateRoomSchema.validateAsync(user)
        const type = req.body.type;
        const location = req.body.location;
        const newLocation = req.body.newLocation;
        const capacity = req.body.capacity;

        if (!location)
            return res.send({ error: "Please enter the location of the room to be updated" })

        const newRoom = await Location.findOne({ location: location });
        if (!newRoom)
            return res.send({ error: "No room with this location" })
        else {
            if (type)
                newRoom.type = type;
            if (capacity)
                newRoom.capacity = capacity;
            if (newLocation) {
                const newLocationRoom = await Location.findOne({ location: newLocation });
                if (newLocationRoom)
                    return res.send({ error: "Sorry, there is another room with this location" })

                newRoom.location = newLocation;
            }

            const updatedRoom = await newRoom.save();
            return res.send({ data: updatedRoom })
        }
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ JOI_validation_error: err });
        }
        console.log("~ err", err);
        return res.send({ err: err })
    }
}

exports.deleteRoom = async function (req, res) {
    try {
        let JOI_Result = await staffMemberValidation.updateRoomSchema.validateAsync(user)
        const location = req.body.location;

        if (!location)
            return res.send({ error: "Location of the room to be deleted is required" })

        const room = await Location.findOne({ location: location });
        if (!room)
            return res.send({ error: "No room with this location is found" })

        const deleted = await Location.findOneAndDelete({ location: location });
        return res.send({ data: "Room deleted successfully" })

    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ JOI_validation_error: err });
        }
        console.log("~ err", err);
        return res.send({ err: err })
    }
}