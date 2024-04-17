const mongoose = require("mongoose");

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose
            .connect("mongodb://127.0.0.1/ShoppeFood")
            .then(() => console.log("Connected to Database"))
            .catch((err) => console.error(err));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;
