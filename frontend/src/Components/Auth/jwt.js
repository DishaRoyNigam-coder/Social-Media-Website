import { jwtDecode } from "jwt-decode";

let addToken = (token) => {
    localStorage.setItem("token", token);
}

let getToken = () => {
    return localStorage.getItem("token");
}

let removeToken = () => {
    localStorage.removeItem("token");
}

let isTokenExpired = () => {
    let token = getToken();

    if (!token) {
        return true;
    }

    try {
        let decoded = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
            removeToken();
            return true;
        }

        return false;
    } catch (err) {
        console.log("Invalid Token");
        removeToken();
        return true;
    }
}

export { addToken, getToken, removeToken, isTokenExpired };