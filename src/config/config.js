class Config {
    getBaseUrl() {
        return process.env.REACT_APP_NODE_ENV === 'production' ? process.env.REACT_APP_BASE_URL_PRODUCTION : process.env.REACT_APP_BASE_URL;
    }
}

export default new Config();