const objectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const tokenKey = require('../config/keys').secretOrKey;
// const { convertMapToObject } = require('../utils/convertMapToObject');
// const { handleError } = require("../utils/handleError");


exports.login = async function (req, res, next) {
    const guc_id = req.body.username;
    const password = req.body.password;

    try {
        //check staff entered both
        if (!guc_id || !password)
            return res.send({ error: "please enter both your email and password" })

        // check member id is found
        const member = staffMember.findOne({ GUCID: guc_id })
            res.status(400).json({ error: 'Email does not exist' });

        //check password
        const correctPassword = bcrypt.compareSync(password, staffMember.password);
        if (!correctPassword) {
            return res.status(400).send({ error: 'Invalid Password' });
        } else {
            //login
            const payload = {
                GUCID: staffMember.GUCID,
                name: staffMember.name,
                email: staffMember.email,
                type: staffMember.type
            }

            const token = jwt.sign(payload, tokenKey, { expiresIn: '24h' })
            return res.json({ data: `Bearer ${token}` })
        }

    } catch (err) {
        res.json({ error: err })
    }
};