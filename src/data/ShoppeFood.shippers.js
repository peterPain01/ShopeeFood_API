const data = [
    {
        _id: {
            $oid: "66293679f97d34060c218bf9",
        },
        avatar: "https://res.cloudinary.com/shoppefood/image/upload/v1714120526/shipper/avatar/grab-hop-tac-Mcdonalds-900x58958.jpg",
        balance: 984603000,
        license_plate_number: "77L2-25182",
        vehicle_image:
            "https://res.cloudinary.com/shoppefood/image/upload/v1714121697/shipper/avatar/ab-viet-up-thai-mau-do-den-son-3d-scaled77.jpg",
        createdAt: {
            $date: "2024-04-25T07:02:25.904Z",
        },
        updatedAt: {
            $date: "2024-05-06T03:22:43.452Z",
        },
        __v: 0,
        device_token:
            "eU1Y93lIQmCBPkcTHMO3yy:APA91bEeSBAU7D0IfYkxFEwhgPbzKgFc7AIqEe6JM2ZpMgbfTQRNhMhKRl0Ep1HA0kZ5ymPnN8nzrJGFTbmkAAIQJSN8m9iEieht8H32092WBoCbXAPwSJ9ZT0OniZYGmRs_5hyeAmmR",
        currentPosition: {
            lat: 10.756756756756756,
            lng: 106.6854453637345,
        },
        revenue: 236800,
        isActive: false,
    },
    {
        _id: {
            $oid: "662b27575a0f5bf2780265c1",
        },
        avatar: "https://res.cloudinary.com/shoppefood/image/upload/v1714105548/shipper/avatar/315446004128811091063736-162609237142255.png",
        balance: 12345,
        license_plate_number: "61E1-93853",
        vehicle_image:
            "https://res.cloudinary.com/shoppefood/image/upload/v1714105551/shipper/vehicle/images%20%281%2978.jpg",
        createdAt: {
            $date: "2024-04-26T04:25:51.782Z",
        },
        updatedAt: {
            $date: "2024-04-26T08:03:22.282Z",
        },
        __v: 0,
        isActive: "false",
    },
];

var mongoose = require("mongoose");
const formattedData = data.map((doc) => {
    const _id = new mongoose.Types.ObjectId(doc._id.$oid);
    delete doc._id;
    const newDoc = { ...doc, _id };
    return newDoc;
});
module.exports = formattedData;
