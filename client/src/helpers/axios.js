const axiosReq = require('axios');

var tmp;
// if (process.env.NODE_ENV === "production")
//     tmp = 'https://BASE_URL.herokuapp.com/api/';
// else
tmp = `http://localhost:5000/`;
export const link = tmp;

export const axios = axiosReq.create({
    baseURL: tmp,
    headers: {
        "Content-type": "application/json"
    }
});

//result = await axios.get(url, body);