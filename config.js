var config = {
    mongo: {
        "url": process.env.MONGOLAB_URI || "mongodb://localhost:27017/todos",
        "settings": {
            "db": {
                "native_parser": false
            }
        }
    }
};

module.exports = config;