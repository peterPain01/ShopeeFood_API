import mongoose from "mongoose";

class MongoDBService {
    private url: string;
    private dbName: string;

    constructor() {
        if (process.env.NODE_ENV === "production") {
            this.url = process.env.MONGODB_URL || "";
        } else {
            this.url = process.env.MONGODB_LOCAL || "";
        }
        this.dbName = process.env.MONGODB_DATABASE || "";
    }

    async connectWithRetry() {
        const maxRetries = 5;
        let retries = 0;
        const retries_timeout = 2000;
        try {
            await mongoose.connect(this.url, {
                dbName: this.dbName,
            });
            console.log("Connected to MongoDB");
            return mongoose.connection.getClient();
        } catch (error) {
            console.log(error);
            if (retries < maxRetries) {
                retries++;
                console.log(
                    `Retrying connection (${retries}/${maxRetries})...`
                );
                setTimeout(() => this.connectWithRetry(), retries_timeout);
            } else {
                throw new Error(
                    "Failed to connect to MongoDB after multiple retries"
                );
            }
        }
    }
}

const MongoInstance = new MongoDBService();
export default MongoInstance;
