const Joi = require('@hapi/joi');

const getRoomSchema = Joi.object({
    params: Joi.string().regex(/['all'-[ABCDGMN][1-7].[0-4][0-9][1-9]]/).required(),
})

const createRoomSchema = Joi.object({
    type: Joi.string().valid('Tutorial Room', 'Lecture Hall', 'Lab', 'Office').required(),
    location: Joi.string().regex(/[ABCDGMN][1-7].[0-4][0-9][1-9]/).required(),
    capacity: Joi.number().integer().required()
})


const updateRoomSchema = Joi.object({
    location: Joi.string().regex(/[ABCDGMN][1-7].[0-4][0-9][1-9]/).required(),
    newLocation: Joi.string().regex(/[ABCDGMN][1-7].[0-4][0-9][1-9]/),
    type: Joi.string().valid('Tutorial Room', 'Lecture Hall', 'Lab', 'Office'),
    capacity: Joi.number().integer()
})


module.exports = {
    getRoomSchema,
    createRoomSchema,
    updateRoomSchema,
}