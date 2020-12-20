const StaffMember = require('./models/StaffMember');
const Location = require('./models/Location');
const bcrypt = require('bcryptjs');


//seeding the database
exports.seedDB = async function () {
    const allLoc = await Location.find();
    if (allLoc.length == 0) {
        const newLoc = {
            type: 'Office',
            location: 'A1.001',
            capacity: 10,
        }

        const newLocation = await Location.create(newLoc);
        console.log("Seeded location into DB")
    }

    const allStaff = await StaffMember.find();

    if (allStaff.length == 0) {
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

        const newMember = await StaffMember.create(newStaff);
        console.log("Seeded Staff into DB")
    }
}