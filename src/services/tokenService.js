class TokenService {
    getToken() {
        return localStorage.getItem("accessToken")
    }

    removeToken() {
        localStorage.removeItem("accessToken");
    }

    setToken(accessToken) {
        localStorage.setItem("accessToken", accessToken);
    }
}

export default new TokenService();