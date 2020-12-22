const Joi = require('@hapi/joi');

//staff member
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
    gucId: Joi.string().regex(/^(HR|AC)-\d{1,}/).required(),
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
    gucId: Joi.string().regex(/^(HR|AC)-\d{1,}/).required(),
})

const changePasswordSchema = Joi.object({
    newPassword: Joi.string().min(6).alphanum().required(),
    oldPassword: Joi.string().min(6).alphanum().required()
})


//location
const getRoomSchema = Joi.object({
    params: Joi.string().regex(/['all'-[ABCDGMN][1-7].[0-4][0-9][1-9]]/).required(),
})

const roomSchema = Joi.object({
    type: Joi.string().valid('Tutorial Room', 'Lecture Hall', 'Lab', 'Office'),
    location: Joi.string().regex(/[ABCDGMN][1-7].[0-4][0-9][1-9]/).required(),
    capacity: Joi.number().integer(),
    newLocation: Joi.string().regex(/[ABCDGMN][1-7].[0-4][0-9][1-9]/),
})

//faculty
const facultySchema = Joi.object({
    code: Joi.string().alphanum().required(),
    name: Joi.string(),
    newName: Joi.string(),
})

//department
const departmentSchema = Joi.object({
    facultyCode: Joi.string().required(),
    depName: Joi.string(),
    HOD: Joi.string(),
    newFacultyCode: Joi.string(),
})

const departmentAssignmentSchema = Joi.object({
    instructorId: Joi.string().regex(/^(HR|AC)-\d{1,}/).required(),
    courseName: Joi.string().required(),
    newCourseName: Joi.string(),
    oldCourseName: Joi.string(),
})

//course
const courseSchema = Joi.object({
    facultyCode: Joi.string().required(),
    departmentName: Joi.string().required(),
    courseName: Joi.string().required(),
    newDepartment: Joi.string(),
    newName: Joi.string(),
})

//AC
const ACSchema = Joi.object({
    courseName: Joi.string().required(),
})

//Attendance
const viewMonthAttendance = Joi.object({
    month1: Joi.number().integer().min(1).max(12).required(),
    month2: Joi.number().integer().min(1).max(12).required(),
})

const viewAllAttendance = Joi.object({
    all: Joi.string().valid('all','month').required()
})

const addMissingSign = Joi.object({
    id: Joi.string().regex(/['HR','AC']-*/).required(),
    signIn: Joi.string().regex(/(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])/),
    signOut: Joi.string().regex(/(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])/),
    date: Joi.string().regex(/(2[0-9][0-9][0-9])-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])/).required(),
    day: Joi.number().integer().min(0).max(6).required(),
    number: Joi.number().integer().required()
})

const viewStaffAttendance = Joi.object({
    id: Joi.string().regex(/['HR','AC']-*/).required(),
    all: Joi.string().valid('all','month').required()
})

const validateCourse = Joi.object({
    course: Joi.string().required()
})

const validateSlotCC = Joi.object({
    day:Joi.string().valid('Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday').required(),
    time:Joi.string().regex(/(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])/).required(),
    location:Joi.string().regex(/([ABCDGMN][1-7]).([0-4][0-9][1-9])/).required()
})

module.exports = {
    registerSchema,
    registerACSchema,
    updateSchema,
    logInSchema,
    changePasswordSchema,
    roomSchema,
    facultySchema,
    departmentSchema,
    departmentAssignmentSchema,
    courseSchema,
    ACSchema,
    viewMonthAttendance,
    viewAllAttendance,
    addMissingSign,
    viewStaffAttendance,
    validateCourse,
    validateSlotCC
}