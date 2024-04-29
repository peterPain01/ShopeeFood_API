const productService = require("../services/product.service");
const orderModel = require("../model/order.model");
const { default: mongoose } = require("mongoose");
const userModel = require("../model/user.model");
const { getSelectData } = require("../utils");
const { Api404Error } = require("../modules/CustomError");
const productModel = require("../model/product.model");
const shopModel = require("../model/shop.model");

module.exports = {
    async countSubPriceOfCart(list_product) {
        let subPrice = 0;
        const select = ["product_discounted_price", "product_original_price"];
        for (product of list_product) {
            const foundProduct = await productModel
                .findById(product.productId)
                .select(getSelectData(select));
            subPrice +=
                foundProduct.product_discounted_price * product.quantity;
        }
        return subPrice;
    },

    async getFeeShip() {},

    async getSubOrderInfo(userId, list_product, note) {
        let subPrice = await this.countSubPriceOfCart(list_product);
        // let shippingFee = await this.getFeeShip(userId, shopId);
        let shippingFee = await this.getFeeShip(userId);

        // plus shippingFee
        let totalPrice = subPrice;

        let subOrderInfo = {
            subPrice,
            shippingFee,
            unit: "VND",
            list_product,
            totalPrice,
        };
        if (note) subOrderInfo = { ...subOrderInfo, note };
        return subOrderInfo;
    },

    async getOrderInfo(
        userId,
        shopId,
        address,
        totalItems,
        paymentMethod,
        list_products,
        note
    ) {
        let subPrice = await this.countSubPriceOfCart(list_products);
        // let shippingFee = await this.getFeeShip(userId, shopId);
        let shippingFee = await this.getFeeShip(userId);
        // plus shippingFee
        let totalPrice = subPrice;

        const selectUser = ["_id", "fullname", "phone"];
        const userOrder = await userModel
            .findById(userId)
            .select(getSelectData(selectUser));

        const selectShop = ["image", "name", "_id"];
        const shopOrder = await shopModel
            .findById(shopId)
            .select(getSelectData(selectShop));

        let orderInfo = {
            order_user: {
                _id: userOrder._id,
                fullname: userOrder.fullname || "",
                phone: userOrder.phone,
                address,
            },
            order_shop: {
                _id: shopOrder._id,
                name: shopOrder.name,
                image: shopOrder.image,
                addresses: shopOrder?.addresses?.at(0),
            },
            subPrice,
            shippingFee,
            unit: "VND",
            list_products,
            totalPrice,
            shopId,
            totalItems,
            paymentMethod,
        };
        if (note) orderInfo = { ...orderInfo, note };
        return orderInfo;
    },
    async createOrder(orderInfo) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const newOrder = await orderModel.create({
                order_user: orderInfo.order_user,
                order_shop: orderInfo.order_shop,
                order_totalPrice: orderInfo.totalPrice,
                order_subPrice: orderInfo.subPrice,
                order_listProducts: orderInfo.list_products,
                order_note: orderInfo.note,
                order_paymentMethod: orderInfo.paymentMethod,
                order_totalItems: orderInfo.totalItems,
            });

            for (product of newOrder.order_listProducts) {
                const update = {
                    $inc: { product_sold: product.quantity },
                };
                await productService.getProductByIdAndUpdate(
                    product.productId,
                    update
                );
            }
            return newOrder;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    },

    async findOrderByUserId(userId, skip = 0, limit = 10) {
        return await orderModel
            .find({
                order_user: userId,
            })
            .skip(skip)
            .limit(limit);
    },

    async getAllOnGoingOrder(userId, select) {
        const filter = {
            "order_user._id": userId,
            $or: [{ order_state: "pending" }, { order_state: "shipping" }],
        };
        return await orderModel.find(filter).select(getSelectData(select));
    },

    async getAllSuccessOrderOverview(userId, select) {
        const filter = {
            "order_user._id": userId,
            order_state: "success",
        };
        return await orderModel.find(filter).select(getSelectData(select));
    },
};
