import parseJwt from "./decryptAuthToken";
import { axios } from "./axios";

async function checkLogin(types) {
    if (!types) types = []
    const token = localStorage.getItem("user");
    console.log("🚀 ~ file: checkLogin.js ~ line 7 ~ checkLogin ~ token", token);
    if (token) {
        const userData = parseJwt(token);
        // await this.setState({ userType: userData.type, authorized: checkTypes(types, userData.type) });
        return userData;
    }
    else {
        document.location.href = '/login'
    }
}

export default checkLogin;