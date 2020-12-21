const jwt = require("jsonwebtoken");

exports.HRAuth = async function (req, res, next) {
    if (req.user.type === 'HR') {
        next();
    } else {
        return res.sendStatus(401)
    }
}

exports.AcademicMemberAuth = async function (req, res, next) {
    if (req.user.type === 'Academic Member') {
        next();
    } else {
        return res.sendStatus(401)
    }
}

exports.TAAuth = async function (req, res, next) {
    if (req.user.role === 'Teaching Assistant') {
        next();
    } else {
        return res.sendStatus(401)
    }
}

exports.CIAuth = async function (req, res, next) {
    if (req.user.role === 'Course Instructor') {
        next();
    } else {
        return res.sendStatus(401)
    }
}

exports.CCAuth = async function (req, res, next) {
    if (req.user.type === 'Course Coordinator') {
        next();
    } else {
        return res.sendStatus(401)
    }
}