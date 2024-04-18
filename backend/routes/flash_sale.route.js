const express = require("express");
const router = express.Router();
const errorHandler = require("../utils/errorHandler");
const { verifyToken } = require("../utils/auth"); 

const flashSaleController = require("../controller/flash_sale.C")

// 1. create Flash sale 
// 2. delete flash sale 
// 3. update flash sale 
// 4. find Flash sale of shop 
// check discounted price must be gt than original price 
// check xem shop do co san pham do hay khong, ang active hay khong 

router.get('/flash-sale/shop/:shopId',errorHandler(flashSaleController.getFlashSaleByShopId))

router.post('/shop/flash-sale', verifyToken,errorHandler(flashSaleController.createFlashSale))

router.patch('/shop/flash-sale/:flash_sale_id', verifyToken,errorHandler(flashSaleController.updateFlashSale))

router.delete('/shop/flash-sale/:flash_sale_id', verifyToken,errorHandler(flashSaleController.deleteFlashSale))

module.exports = router