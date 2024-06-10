const mongoose = require("mongoose");

const {
    MONGO_USER,
    MONGO_DATABASE,
    MONGO_PASSWORD,
    MONGO_IP,
    MONGO_PORT,
} = require("../config/database");

class Database {
    public static instance: Database;
    constructor() {
        this.connect();
    }

    connect() {
        mongoose
            .connect(process.env.MONGODB_URL, {
                dbName: MONGO_DATABASE,
            })
            .then(async () => {
                console.log("Connected to MongoDb");
            })
            .catch((e: Error) => {
                console.log(e);
                console.log("Retry after 2 seconds");
                setTimeout(this.connect, 2000);
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
export default instanceMongoDb;
