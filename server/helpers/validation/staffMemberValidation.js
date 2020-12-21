const Joi = require('@hapi/joi');

const registerSchema = Joi.object({
    // password: Joi.string().min(6).alphanum().required(),

    name: Joi.string().required(),
    gender: Joi.string().valid('female', 'male').required(),
    email: Joi.string().email().lowercase().required(),
    salary: Joi.number().integer().required(),
    officeLocation: Joi.string().regex(/[ABCDGMN][1-7].[0-4][0-9][1-9]/).required(),
    type: Joi.string().valid('HR', 'Academic Member').required(),

})

const registerACSchema = Joi.object({
    role: Joi.string().valid('Teaching Assistant', 'Course Instructor').required(),
    dayOff: Joi.string().valid('Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday').required(),
    faculty: Joi.string().required(),
    department: Joi.string().required()
})

const updateSchema = Joi.object({
    gucId: Joi.string().regex(/['HR','AC']-*/).required(),
    name: Joi.string(),
    dayOff: Joi.string().valid('Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'),
    role: Joi.string().valid('Teaching Assistant', 'Course Instructor'),
    faculty: Joi.string(),
    department: Joi.string(),
    officeLocation: Joi.string().regex(/[ABCDGMN][1-7].[0-4][0-9][1-9]/),
    leaveBalance: Joi.number().integer(),
})

const logInSchema = Joi.object({
    password: Joi.string().min(6).alphanum().required(),
    gucId: Joi.string().regex(/['HR','AC']-[1-10000000000]/).required(),
})

const changePasswordSchema = Joi.object({
    newPassword: Joi.string().min(6).alphanum().required(),
    oldPassword: Joi.string().min(6).alphanum().required()
})

module.exports = {
    registerSchema,
    registerACSchema,
    updateSchema,
    logInSchema,
    changePasswordSchema
}