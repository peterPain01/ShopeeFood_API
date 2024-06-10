const productService = require("../services/product.service");
const orderModel = require("../model/order.model");
const { default: mongoose } = require("mongoose");
const userModel = require("../model/user.model");
const {
    getSelectData,
    removeNestedNullUndefined,
    unSelectData,
} = require("../utils");
const { Api404Error } = require("../modules/CustomError");
const productModel = require("../model/product.model");
const shopModel = require("../model/shop.model");
const temporaryOrderModel = require("../model/temporaryOrder.model");
const { revenuePercentage } = require("../model/revenuePercentage");
const shipperModel = require("../model/shipper.model");

module.exports = {
    async countSubPriceOfCart(list_product) {
        let subPrice = 0;
        const select = ["product_discounted_price", "product_original_price"];
        for (product of list_product) {
            const foundProduct = await productModel
                .findOne({ _id: product.productId, isDraft: false })
                .select(getSelectData(select));
            if (foundProduct) {
                subPrice +=
                    foundProduct.product_discounted_price * product.quantity;
            }
        }
        return subPrice;
    },

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
        list_products,
        note,
        shippingFee
    ) {
        let subPrice = await this.countSubPriceOfCart(list_products);
        // let shippingFee = await this.getFeeShip(userId, shopId);
        // plus shippingFee
        console.log("sub price:::", subPrice);
        const selectUser = ["_id", "fullname", "phone"];
        const userOrder = await userModel
            .findById(userId)
            .select(getSelectData(selectUser));

        const selectShop = ["image", "name", "_id", "addresses"];
        const shopOrder = await shopModel
            .findById(shopId)
            .select(getSelectData(selectShop));
        console.log("shopOrder:::", shopOrder);

        const shipperPercentage = await revenuePercentage.findOne({});
        const shipperReceive =
            (shippingFee * (100 - shipperPercentage.shipper)) / 100;
        console.log("shipperReceive:::", shipperReceive);

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
                address: shopOrder?.addresses?.at(0),
            },
            subPrice,
            shippingFee,
            unit: "VND",
            list_products,
            totalPrice: subPrice + shippingFee,
            shopId,
            totalItems,
            shipperReceive,
        };

        console.log("order_shop:::", orderInfo.order_shop.address);

        if (note) orderInfo = { ...orderInfo, note };
        return orderInfo;
    },

    async createOrder(orderInfo) {
        const session = await mongoose.startSession();
        session.startTransaction();
        removeNestedNullUndefined(orderInfo);
        try {
            const orderData = {
                order_user: orderInfo.order_user,
                order_shop: orderInfo.order_shop,
                order_totalPrice: orderInfo.totalPrice,
                order_subPrice: orderInfo.subPrice,
                order_listProducts: orderInfo.list_products,
                order_paymentMethod: orderInfo.paymentMethod,
                order_totalItems: orderInfo.totalItems,
                order_shipperReceive: orderInfo.shipperReceive,
                order_shippingFee: orderInfo.shippingFee,
            };

            if (orderInfo.note) orderData.order_note = orderInfo.note;

            const newOrder = await orderModel.create(orderData);

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

    async findOrderById(orderId, select = []) {
        return await orderModel.findById(orderId).select(getSelectData(select));
    },

    async findOrder(filter, select = []) {
        return await orderModel
            .findOne(filter)
            .select({ ...getSelectData(select), shipperReceive: 0 })
            .populate("order_shipper", "fullname license_plate_number avatar");
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

    async findByIdAndUpdate(orderId, update) {
        return await orderModel.findByIdAndUpdate(orderId, update, {
            new: true,
        });
    },

    async finishOrder(shipperId, shipperReceived, orderId) {
        await orderModel.findByIdAndUpdate(
            orderId,
            {
                $set: { order_state: "success", order_finishAt: Date.now() },
            },
            { new: true }
        );
        return await shipperModel.findByIdAndUpdate(shipperId, {
            $inc: { revenue: shipperReceived },
        });
    },

    async findOrderByShipperId(shipperId, unSelect) {
        return await orderModel
            .find({
                order_shipper: shipperId,
            })
            .select(unSelectData(unSelect))
            .skip(0)
            .limit(50);
    },

    async assignShipperForOrder(shipperId, orderId) {
        const update = {
            $set: { order_shipper: shipperId },
        };
        return await orderModel.findByIdAndUpdate(orderId, update, {
            new: true,
        });
    },

    async findOrderDetailForShipper(shipperId, orderId) {
        const orderObject = await temporaryOrderModel
            .findOne({
                shipper_id: shipperId,
                order_id: orderId,
            })
            .populate("order_id")
            .select({ order_shippingFee: 0 });

        // order object co the bang null
        return orderObject.order_id;
    },

    async calcShippingFee() {},
};
