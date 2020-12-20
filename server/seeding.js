const StaffMember = require('./models/StaffMember');
const Location = require('./models/Location');
const Faculty = require('./models/Faculty');
const Department = require('./models/Department');
const Course = require('./models/Course');


const bcrypt = require('bcryptjs');


//seeding the database
exports.seedDB = async function () {
    //adding starting loc
    const allLoc = await Location.findOne({ location: 'A1.001' });
    if (!allLoc) {
        const newLoc = {
            type: 'Office',
            location: 'A1.001',
            capacity: 10,
        }

        await Location.create(newLoc);
        console.log("Seeded location into DB")
    }

    //adding starting HR 
    const allStaff = await StaffMember.findOne({ gucId: 'HR-1' });
    if (!allStaff) {
        const tempLoc = await Location.findOne({ location: 'A1.001', }).populate('officeLocation');

        const newStaff = {
            gucId: 'HR-1',
            name: 'seeded HR',
            gender: 'male',
            email: 'seeded@guc.edu.eg',
            password: await bcrypt.hash('123456', 12),
            salary: 1000,
            officeLocation: tempLoc,
            type: 'HR',
            attendanceRecords: [],
            lastLogIn: undefined,
        }

        await StaffMember.create(newStaff);
        console.log("Seeded Staff into DB")
    }

    const allFac = await Faculty.findOne({ code: 'FAC 1' });
    if (!allFac) {
        const newFac = {
            code: 'FAC 1',
            name: 'seeded faculty'
        }

        await Faculty.create(newFac);
        console.log("Seeded Faculty into DB")
    }

    const allDep = await Department.findOne({ name: 'seeded department' });
    if (!allDep) {
        const getFac = await (await Faculty.findOne({ code: 'FAC 1' })).populate('faculty');

        const newDep = {
            faculty: getFac,
            name: 'seeded department'
        }

        await Department.create(newDep);
        console.log("Seeded Department into DB")
    }

    // const allCourses2 = await Course.findOne({ name: 'seeded course2' });
    // if (!allCourses2) {
    //     const getDep = await (await Department.findOne({ name: 'seeded department' })).populate('department');
    //     const tempLoc = await Location.findOne({ location: 'A1.001', }).populate('officeLocation');

    //     const newCourse = {
    //         department: getDep,
    //         name: 'seeded Course2',
    //         slots: [
    //             // {
    //             //     day: "Saturday",
    //             //     time: 1970 - 01 - 01T15: 45: 00.000 + 00: 00,
    //             //     location: tempLoc
    //             // }
    //             // {
    //             //     day: "Sunday",
    //             //     time: 1970 - 01 - 01T15: 45: 00.000 + 00: 00,
    //             //     location: tempLoc
    //             // }
    //             // {
    //             //     day: "Monday",
    //             //     time: 1970 - 01 - 01T15: 45: 00.000 + 00: 00,
    //             //     location: tempLoc
    //             // }
    //             // {
    //             //     day: "Tuesday",
    //             //     time: 1970 - 01 - 01T15: 45: 00.000 + 00: 00,
    //             //     location: tempLoc
    //             // }
    //         ]
    //     }

    //     await Course.create(newCourse);
    //     console.log("Seeded Course2 into DB")
    // }

    // const allCourses3 = await Course.findOne({ name: 'seeded Course3' });
    // if (!allCourses3) {
    //     const getDep = await (await Department.findOne({ name: 'seeded department' })).populate('department');

    //     const newCourse = {
    //         department: getDep,
    //         name: 'seeded Course3'
    //     }

    //     await Course.create(newCourse);
    //     console.log("Seeded Course3 into DB")
    // }




}