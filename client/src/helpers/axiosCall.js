import axios from 'axios';


export async function axiosCall(requestType, url, body) {
    console.log("🚀 ~ file: axiosCall.js ~ line 5 ~ axiosCall ~ body", body);
    try {
        var tmp;
        //TODO: when deployed
        // if (process.env.NODE_ENV === "production")
        //     tmp = 'https://BASE_URL.herokuapp.com/api/';
        // else
        tmp = `http://localhost:5000/`;

        const fullURL = tmp + url;
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }

        let result;
        switch (requestType) {
            case "get": { result = await axios.get(fullURL, body); break; }
            case "post": { result = await axios.post(fullURL, body); break; }
            case "put": { result = await axios.put(fullURL, body); break; }
            case "delete": { result = await axios.delete(fullURL, { data: body }, config); break; }
            case "patch": { result = await axios.patch(fullURL, body); break; }
            default: { return "Wrong request type: can either be get, post, put, delete or patch"; }
        }
        return result;
    }
    catch (error) {
        return { error: error.toString() };
    }
}

export default axiosCall;