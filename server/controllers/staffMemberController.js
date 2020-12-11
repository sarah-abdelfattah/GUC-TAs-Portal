const objectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { StaffMember } = require('../models/StaffMember');
const tokenKey = require('../config/keys').secretOrKey;

exports.login = async function (req, res, next) {
    const guc_id = req.body.username;
    const password = req.body.password;

    //both are entered
    if (!guc_id || !password)
        return res.send({ error: "Missing email or password" })

    passport.authenticate("staffMembers", async function (err, staffMember, message) {
        if (err) {
            return next(err);
        }
        //no member
        if (!staffMember) {
            return res.send({ error: message.message });
        }

        req.login(staffMember, async function (err) {
            try {
                const payload = await StaffMember.findOne({ GUCID: guc_id });
                const token = jwt.sign(payload.toJSON(), tokenKey, { expiresIn: '24h' });
                return res.json({ data: `Bearer ${token}`, info: payload });
            } catch (err) {
                return err;
            }
        });
    })(req, res, next);
};
