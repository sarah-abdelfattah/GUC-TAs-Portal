const Joi = require('@hapi/joi');

//staff member
const registerSchema = Joi.object({
    name: Joi.string().required(),
    gender: Joi.string().valid('female', 'male').required(),
    email: Joi.string().email().lowercase().required(),
    salary: Joi.number().integer().required(),
    officeLocation: Joi.string().regex(/[ABCDGMN][1-7].[0-4][0-9][1-9]/ || /^H[1-9]{1,}/).required(),
    type: Joi.string().valid('HR', 'Academic Member').required(),
    role: Joi.string().valid('Teaching Assistant', 'Course Instructor'),
    dayOff: Joi.string().valid('Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'),
    faculty: Joi.string(),
    department: Joi.string()
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
    role: Joi.string().valid('Teaching Assistant', 'Course Instructor'),
    faculty: Joi.string(),
    department: Joi.string(),
    officeLocation: Joi.string().regex(/[ABCDGMN][1-7].[0-4][0-9][1-9]/ || /^H[1-9]{1,}/),
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
// const getRoomSchema = Joi.object({
//     params: Joi.string().regex(/['all'-[ABCDGMN][1-7].[0-4][0-9][1-9]]/).required(),
// })

const createRoomSchema = Joi.object({
    type: Joi.string().valid('Tutorial Room', 'Lecture Hall', 'Lab', 'Office').required(),
    location: Joi.string().regex(/[ABCDGMN][1-7].[0-4][0-9][1-9]/).required(),
    capacity: Joi.number().integer().required(),
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
    //TODO: regex if id
    instructorId: Joi.string().required(),
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
const ACSchema = {
  withSlot: Joi.object({
    courseName: Joi.string().required(),
    gucId: Joi.string()
      .required()
      .regex(/^(HR|AC)-\d{1,}/),
    slot: Joi.object({
      day: Joi.string().required(),
      time: Joi.string().required(),
    }).required(),
    newSlot: Joi.object({
      day: Joi.string().required(),
      time: Joi.string().required(),
    }),
  }),
  withoutSlot: Joi.object({
    courseName: Joi.string().required(),
    gucId: Joi.string()
      .required()
      .regex(/^(HR|AC)-\d{1,}/),
  }),
};

module.exports = {
    registerSchema,
    registerACSchema,
    updateSchema,
    logInSchema,
    changePasswordSchema,
    createRoomSchema,
    roomSchema,
    facultySchema,
    departmentSchema,
    departmentAssignmentSchema,
    courseSchema,
    ACSchema
}