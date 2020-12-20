// const StaffMember = require('./models/StaffMember');
// const Location = require('./models/Location');
// const Faculty = require('./models/Faculty');
// const Department = require('./models/Department');
// const Course = require('./models/Course');


// const bcrypt = require('bcryptjs');


// //seeding the database
// exports.seedDB = async function () {
//     //adding starting loc
//     const allLoc = await Location.findOne({ location: 'A1.001' });
//     if (!allLoc) {
//         const newLoc = {
//             type: 'Office',
//             location: 'A1.001',
//             capacity: 10,
//         }

//         await Location.create(newLoc);
//         console.log("Seeded location into DB")
//     }

//     //adding starting HR 
//     const allStaff = await StaffMember.find();
//     if (allStaff.length == 0) {
//         const tempLoc = await Location.findOne({ location: 'A1.001', }).populate('officeLocation');

//         const newStaff = {
//             gucId: 'HR-1',
//             name: 'seeded HR',
//             gender: 'male',
//             email: 'seeded@guc.edu.eg',
//             password: await bcrypt.hash('123456', 12),
//             salary: 1000,
//             officeLocation: tempLoc,
//             type: 'HR',
//             attendanceRecords: [],
//             lastLogIn: undefined,
//         }

//         await StaffMember.create(newStaff);
//         console.log("Seeded Staff into DB")
//     }

//     const allFac = await Faculty.findOne({ code: 'FAC 1' });
//     if (!allFac) {
//         const newFac = {
//             code: 'FAC 1',
//             name: 'seeded faculty'
//         }

//         await Faculty.create(newFac);
//         console.log("Seeded Faculty into DB")
//     }

//     const allDep = await Department.findOne({ name: 'seeded department' });
//     if (!allDep) {
//         const getFac = await (await Faculty.findOne({ code: 'FAC 1' })).populate('faculty');

//         const newDep = {
//             faculty: getFac,
//             name: 'seeded department'
//         }

//         await Department.create(newDep);
//         console.log("Seeded Department into DB")
//     }

//     const allCourses = await Course.findOne({ name: 'seeded Course' });
//     if (!allCourses) {
//         const getDep = await (await Department.findOne({ name: 'seeded department' })).populate('department');

//         const newCourse = {
//             department: getDep,
//             name: 'seeded Course'
//         }

//         await Course.create(newCourse);
//         console.log("Seeded Course into DB")
//     }

//     const CImem = await StaffMember.findOne({ gucId: 'AC-1' });
//     if (!CImem) {
//         const tempLoc = await Location.findOne({ location: 'A1.001', }).populate('officeLocation');
//         const getDep = await (await Department.findOne({ name: 'seeded department' })).populate('department');
//         const getFac = await (await Faculty.findOne({ code: 'FAC 1' })).populate('faculty');

//         const newCI = {
//             gucId: 'AC-1',
//             name: 'seeded CI',
//             gender: 'male',
//             email: 'ci@guc.edu.eg',
//             password: await bcrypt.hash('123456', 12),
//             salary: 1000,
//             officeLocation: tempLoc,
//             type: 'Academic Member',
//             role: 'Course Instructor',
//             attendanceRecords: [],
//             lastLogIn: undefined,
//             faculty: getFac,
//             department: getDep,
//         }

//         await StaffMember.create(newCI);
//         console.log("Seeded newCI into DB")
//     }

//     const TAmem = await StaffMember.findOne({ gucId: 'AC-2' });
//     if (!TAmem) {
//         const tempLoc = await Location.findOne({ location: 'A1.001', }).populate('officeLocation');
//         const getDep = await (await Department.findOne({ name: 'seeded department' })).populate('department');
//         const getFac = await (await Faculty.findOne({ code: 'FAC 1' })).populate('faculty');

//         const newTA = {
//             gucId: 'AC-2',
//             name: 'seeded TA',
//             gender: 'male',
//             email: 'ta@guc.edu.eg',
//             password: await bcrypt.hash('123456', 12),
//             salary: 1000,
//             officeLocation: tempLoc,
//             type: 'Academic Member',
//             role: 'Teaching Assistant',
//             attendanceRecords: [],
//             lastLogIn: undefined,
//             faculty: getFac,
//             department: getDep,
//         }

//         await StaffMember.create(newTA);
//         console.log("Seeded newTA into DB")
//     }

//     const TAmemWithCourse = await StaffMember.findOne({ gucId: 'AC-3' });
//     if (!TAmemWithCourse) {
//         const tempLoc = await Location.findOne({ location: 'A1.001', }).populate('officeLocation');
//         const getDep = await (await Department.findOne({ name: 'seeded department' })).populate('department');
//         const getFac = await (await Faculty.findOne({ code: 'FAC 1' })).populate('faculty');
//         const getCourse = await (await Course.findOne({ name: 'seeded Course' })).populate('course');

//         const newTA = {
//             gucId: 'AC-3',
//             name: 'seeded TA2',
//             gender: 'male',
//             email: 'ta2@guc.edu.eg',
//             password: await bcrypt.hash('123456', 12),
//             salary: 1000,
//             officeLocation: tempLoc,
//             type: 'Academic Member',
//             role: 'Teaching Assistant',
//             attendanceRecords: [],
//             lastLogIn: undefined,
//             faculty: getFac,
//             department: getDep,
//             courses: [getCourse],
//         }

//         await StaffMember.create(newTA);
//         console.log("Seeded newTA into DB")
//     }
// }