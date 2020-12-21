var express = require("express");
var router = express.Router();
const auth = require('./auth');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenKey = require('../config/keys').secretOrKey;

const Token = require('../models/Token');
const StaffMember = require('../models/StaffMember');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

router.post("", async function (req, res) {
    try {
        const { gucId, password } = req.body;

        if (!gucId || !password)
            return res.send({ error: "Please enter all details" });

        const staff = await StaffMember.findOne({ gucId: gucId });
        if (!staff)
            return res.status(400).json({ error: 'Wrong Id or password' });

        const match = bcrypt.compareSync(password, staff.password);
        // const match = true

        if (match) {
            let payload;
            if (staff.type === 'HR') {
                payload = {
                    gucId: staff.gucId,
                    password: staff.password,
                    name: staff.name,
                    email: staff.email,
                    type: staff.type
                }
            } else {
                payload = {
                    gucId: staff.gucId,
                    password: staff.password,
                    name: staff.name,
                    email: staff.email,
                    type: staff.type,
                    role: staff.role,
                    faculty: staff.faculty,
                    department: staff.department
                }
            }

            const token = jwt.sign(payload, tokenKey, { expiresIn: '24h' })
            await Token.create({ tokenId: token, iat: new Date() })

            if (!staff.lastLogIn) {
                console.log("not logged in before")
                await readline.question('Do you want to change your password (Y/N): ', async (answer) => {
                    if (answer === 'Y' || answer === 'y') {
                        await readline.question('New password: ', async (password) => {
                            if (password) {
                                console.log("creating...")
                                staff.password = await bcrypt.hash(password, 12);
                                staff.save();
                                console.log("changed password...")
                            } else {
                                console.log("password not changed...")
                            }
                            readline.close();
                        });
                    } else {
                        console.log("Password will not be changed");
                        readline.close();
                    }
                })

                staff.lastLogIn = new Date();
                await staff.save();
                return res.header("auth-token", token).send({ token: token, fistLogIn: true, message: "Update your password in the console (later it will be handled in frontend" });
            }

            staff.lastLogIn = new Date();
            await staff.save();
            return res.header("auth-token", token).send({ token: token, fistLogIn: false, lastLogIn: staff.lastLogIn });
            // return res.json({ data: `Bearer ${token}` })
        }
        else
            return res.status(400).send({ error: "Wrong Id or password" });
    } catch (err) {
        console.log(err)
        return res.send({ err: err })
    }
}
);

module.exports = router;  