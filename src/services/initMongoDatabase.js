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
                process.env.MONGODB_URL,
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
        const shopCollection = mongoose.connection.db.collection("shops");
        const userCollection = mongoose.connection.db.collection("users");
        const productCollection = mongoose.connection.db.collection("products");
        const catesCollection = mongoose.connection.db.collection("categories");
        const shipperCollection = mongoose.connection.db.collection("shippers");

        const countShop = await shopCollection.countDocuments();
        const countUser = await userCollection.countDocuments();
        const countProduct = await productCollection.countDocuments();
        const countCategories = await catesCollection.countDocuments();
        const countShippers = await shipperCollection.countDocuments();

        if (
            !countShop &&
            !countProduct &&
            !countUser &&
            !countCategories &&
            !countShippers
        ) {
            console.log("Start Initial Data");
            await shopCollection.insertMany(shopsData);
            await userCollection.insertMany(usersData);
            await productCollection.insertMany(productsData);
            await catesCollection.insertMany(catesData);
            await shipperCollection.insertMany(shipperData);
            console.log("End Initial Data");
        }

        return;
    }
}

const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;
