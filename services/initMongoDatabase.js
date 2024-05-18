const mongoose = require("mongoose");

const {
    MONGO_USER,
    MONGO_DATABASE,
    MONGO_PASSWORD,
    MONGO_IP,
    MONGO_PORT,
} = require("../config/database");
class Database {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose
            .connect(
                `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`,
                {
                    dbName: MONGO_DATABASE,
                }
            )
            .then(() => console.log("Connected to MongoDb"))
            .catch((e) => {
                console.log(e);
                setTimeout(this.connect(), 2000);
            });
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
