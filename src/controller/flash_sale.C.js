const FlashSale = require("../model/flashSale.model");
const { BadRequest, Api404Error } = require("../modules/CustomError");
const flashSaleService = require("../services/flash_sale.service");
const { Types } = require("mongoose");
module.exports = {
    // GET all flash sale by ShopId

    // GET a specific flash sale by ShopId
    async getFlashSaleByShopId(req, res) {
        const { shopId } = req.params;
        if (!shopId) throw new BadRequest("Missing required arguments");

        const flashSale = await flashSaleService.findByShopId(shopId);
        if (!flashSale) return res.status(404).json("Flash sale not found");
        res.status(200).json(flashSale);
    },

    // CREATE a new flash sale
    async createFlashSale(req, res) {
        const { userId: shopId } = req.user;
        const flashSale = new FlashSale({
            flash_shopId: shopId,
            flash_startTime: req.body.startTime,
            flash_endTime: req.body.endTime,
            flash_discountedProducts: req.body.discountedProducts,
        });
        const newFlashSale = await flashSale.save();
        res.status(201).json(newFlashSale);
    },

    // UPDATE an existing flash sale
    async updateFlashSale(req, res) {
        const { userId: shopId } = req.user;
        const { flash_sale_id } = req.params;
        if (!flash_sale_id) throw new BadRequest("Missing required arguments");

        const filter = {
            flash_shopId: new Types.ObjectId(shopId),
            _id: new Types.ObjectId(flash_sale_id),
        };

        const flashSale = await FlashSale.findOneAndUpdate(filter, {
            $set: req.body,
        });
        if (!flashSale) throw new Api404Error("Flash sale Not Found");
        res.status(200).json(flashSale);
    },

    // DELETE a flash sale
    async deleteFlashSale(req, res) {
        const { userId: shopId } = req.user;
        const { flash_sale_id } = req.params;
        if (!flash_sale_id) throw new BadRequest("Missing require arguments");

        const filter = {
            flash_shopId: new Types.ObjectId(shopId),
            _id: new Types.ObjectId(flash_sale_id),
        };
        const flashSale = await FlashSale.findOneAndDelete(filter);
        if (!flashSale) {
            return res.status(404).json({ message: "Flash sale not found" });
        }
        res.status(200).json({ message: "Flash sale deleted" });
    },
};
