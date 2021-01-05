const axiosReq = require('axios');
var tmp;
//TODO: when deployed
// if (process.env.NODE_ENV === "production")
//     tmp = 'https://BASE_URL.herokuapp.com/api/';
// else
tmp = `http://localhost:5000/`;
export const link = tmp;

export const axios = axiosReq.create({
  baseURL: tmp,
  headers: {
    'Content-type': 'application/json',
    'auth-token': localStorage.getItem('user'),
  },
});
console.log("🚀 ~ file: axios.js ~ line 17 ~ axios", axios);
