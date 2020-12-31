const jwt = require('jsonwebtoken');
const tokenKey = require('../config/keys').secretOrKey;


async function checkLogin() {
    const token = localStorage.getItem("user");
    if (token) {
        const userData = jwt.verify(token, tokenKey);
        return userData;
    }
    else {
        document.location.href = '/login'
    }
}

export default checkLogin;