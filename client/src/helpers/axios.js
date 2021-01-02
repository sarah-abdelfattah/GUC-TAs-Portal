const axiosReq = require('axios');

export const axios = axiosReq.create({
    headers: {
        "Content-type": "application/json",
        'auth-token': localStorage.getItem('user')
    }
});
