const mongoose = require("mongoose");

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose
            .connect(process.env.MONGODB_URL, { 
                dbName: process.env.DB_NAME
            })
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