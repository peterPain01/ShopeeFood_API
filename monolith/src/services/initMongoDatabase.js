const mongoose = require("mongoose");

const {
    MONGO_USER,
    MONGO_DATABASE,
    MONGO_PASSWORD,
    MONGO_IP,
    MONGO_PORT,
} = require("../config/database");

const shopsData = require("../data/ShoppeFood.shops");
const usersData = require("../data/ShoppeFood.users");
const productsData = require("../data/ShoppeFood.products");
const catesData = require("../data/ShoppeFood.categories");
const shipperData = require("../data/ShoppeFood.shippers");

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose
            .connect(
                // `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`,
                process.env.MONGODB_LOCAL,
                {
                    dbName: MONGO_DATABASE,
                }
            )
            .then(async () => {
                console.log("Connected to MongoDb");
                await Database.loadInitData();
            })
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

    // ONLY use on development
    static async loadInitData() {
        const collections = [
            { name: "shops", data: shopsData },
            { name: "users", data: usersData },
            { name: "products", data: productsData },
            { name: "categories", data: catesData },
            { name: "shippers", data: shipperData },
        ];

        for (const collection of collections) {
            const count = await mongoose.connection.db
                .collection(collection.name)
                .countDocuments();
            if (count === 0) {
                console.log(`Start Initial ${collection.name}`);
                await mongoose.connection.db
                    .collection(collection.name)
                    .insertMany(collection.data);
                console.log(`End Initial ${collection.name}`);
            }
        }
    }
}

const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;
