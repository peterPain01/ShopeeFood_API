const express = require("express");
const router = express.Router();
const discountController = require("../controller/discount.C");
const errorHandler = require("../utils/errorHandler");
const { verifyToken } = require("../utils/auth"); 



// 1. create Flash sale 
// 2. delete flash sale 
// 3. update flash sale 
// 4. find Flash sale of shop 
module.exports = router