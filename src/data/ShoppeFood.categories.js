const data = [
    {
        _id: {
            $oid: "66235e79c99db74074241b59",
        },
        category_name: "Pizza",
        category_image:
            "https://www.moulinex-me.com/medias/?context=bWFzdGVyfHJvb3R8MTQzNTExfGltYWdlL2pwZWd8aGNlL2hmZC8xNTk2ODYyNTc4NjkxMC5qcGd8MmYwYzQ4YTg0MTgzNmVjYTZkMWZkZWZmMDdlMWFlMjRhOGIxMTQ2MTZkNDk4ZDU3ZjlkNDk2MzMzNDA5OWY3OA",
        __v: 0,
    },
    {
        _id: {
            $oid: "66235e91c99db74074241b5b",
        },
        category_name: "Bread",
        category_image:
            "https://banhmihuynhhoa.vn/wp-content/uploads/2022/10/loat-banh-mi-dat-khach-nhat-sai-gon-co-noi-khach-chi-tram-ngan-de-dat-ship-bang-taxi-3.jpg",
        __v: 0,
    },
    {
        _id: {
            $oid: "66235ead16982bc66c13adc8",
        },
        category_name: "BeefSteak",
        category_image:
            "https://www.vanhoanggroup.com/Portals/28054/lich%20su%20ra%20doi%20cua%20bit%20tet%20-%20anh%20dai%20dien.jpg",
        __v: 0,
    },
    {
        _id: {
            $oid: "66235ec5504b80bcb53d4852",
        },
        category_name: "Noodles",
        category_image:
            "https://kenh14cdn.com/2018/10/28/3-1540744857752154988877.jpg",
        __v: 0,
    },
    {
        _id: {
            $oid: "66235ecddd9d848c84ca61c5",
        },
        category_name: "Hot Dog",
        category_image:
            "https://img1.10bestmedia.com/Images/Photos/257003/p-1464053-427284300733347-2140187600-n_55_660x440_201406010322.jpg",
        __v: 0,
    },
    {
        _id: {
            $oid: "66235ed4d7a3140d47858026",
        },
        category_name: "Burger",
        category_image:
            "https://www.foodandwine.com/thmb/DI29Houjc_ccAtFKly0BbVsusHc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/crispy-comte-cheesburgers-FT-RECIPE0921-6166c6552b7148e8a8561f7765ddf20b.jpg",
        __v: 0,
    },
    {
        _id: {
            $oid: "6629bb681a052770b15632ad",
        },
        category_name: "Fast Food",
        category_image:
            "http://t2.gstatic.com/licensed-image?q=tbn:ANd9GcQdrJqKpkdu0J8nBqtuF2qebZmJUPq-ULozBGGyKzYXgbDxBrEZH2r8a3_M2sH2wjUkFwqvEBVy0s1gOnOWjoY",
        __v: 0,
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
