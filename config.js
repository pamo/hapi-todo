var config = {
    mongo: {
        "url": "mongodb://localhost:27017/todos",
        "settings": {
            "db": {
                "native_parser": false
            }
        }
    }
};

module.exports = config;
