var express = require("express");
var router = express.Router();
const auth = require('./auth');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenKey = require('../config/keys').secretOrKey;

const StaffMember = require('../models/StaffMember');

router.post("", async function (req, res) {
    try {
        const { gucId, password } = req.body;

        if (!gucId || !password)
            return res.send({ error: "Please enter all details" });

        const staff = await StaffMember.findOne({ gucId: gucId });
        if (!staff)
            return res.status(400).json({ error: 'Wrong Id or password' });

        const match = bcrypt.compareSync(password, staff.password);
        if (match) {
            const payload = {
                gucId: staff.gucId,
                password: staff.password,
                name: staff.name,
                email: staff.email,
                type: staff.type,
                role: staff.role
            }

            const token = jwt.sign(payload, tokenKey, { expiresIn: '60min' })
            return res.header("auth-token", token).send(token);
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