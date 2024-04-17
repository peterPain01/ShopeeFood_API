module.exports = {
    /* 
        originalPrice // gia chua giam 
        totalPrice  // gia da giam 
        discountPrice // gia tien giam duoc 
        feeShip 
    */
    async checkoutReview(req, res) {
        const { id: cardId } = req.params;
        const userId = req.user;


        

        res.status(200).json()
    },
};
