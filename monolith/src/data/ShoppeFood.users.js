const data = [
    {
        _id: {
            $oid: "66293674f97d34060c218bf6",
        },
        state: "active",
        phone: "12345",
        password:
            "$2b$08$ZZacT5nFcKOXzYmto.UciepenePN0pl8wgUs5ZbaMRhNiXI.ZL/ni",
        addresses: [],
        role: "admin",
        createdAt: {
            $date: "2024-04-24T16:42:28.314Z",
        },
        updatedAt: {
            $date: "2024-04-27T09:45:33.034Z",
        },
        __v: 0,
    },
    {
        _id: {
            $oid: "66293679f97d34060c218bf9",
        },
        state: "active",
        phone: "123123",
        password:
            "$2b$08$Nrinz3JMLHQR8FjNCF6OROhUAjXO5XwOldniff9WDfnXWkWlrwMmG",
        addresses: [],
        role: "shipper",
        createdAt: {
            $date: "2024-04-24T16:42:33.170Z",
        },
        updatedAt: {
            $date: "2024-04-25T07:02:25.909Z",
        },
        __v: 0,
    },
    {
        _id: {
            $oid: "66293a75febe968ed072ea9c",
        },
        state: "active",
        phone: "123",
        password:
            "$2b$08$FNVwgweH0/k7HSI4jUBJb.CYcVvR0Q6jSNX1X.cXvSTCX7D.iuUkS",
        role: "shop",
        addresses: [
            {
                type: "Company",
                street: "227 Nguyen Van Cu, Quan 5",
                latlng: {
                    lat: "10.762514",
                    lng: "106.682306",
                },
            },
            {
                type: "Home",
                street: "TK12/22 Hem Ben Chuong Duong, PCau Kho, Q1",
                latlng: {
                    lat: " 10.75562286040524",
                    lng: "106.68622924985297",
                },
            },
        ],
        createdAt: {
            $date: "2024-04-24T16:59:33.997Z",
        },
        updatedAt: {
            $date: "2024-04-26T02:16:57.950Z",
        },
        __v: 0,
        bio: "I love Fat Food",
        birth_date: {
            $date: "2002-12-31T17:00:00.000Z",
        },
        email: "phghuy2121@gmail.com",
        gender: "male",
        avatar: "uploads\\z4945890224702_124f37f25265a54173392c6f5d21d5e0.jpg",
    },
    {
        _id: {
            $oid: "6629c2315df0d9c8a01135b4",
        },
        state: "active",
        phone: "2222",
        password:
            "$2b$08$ffIXw0r9RDfc.jrgDZ1cleVtsLC9cJzHhTax7ufElN/wVcaFrrzOy",
        addresses: [],
        role: "shop",
        createdAt: {
            $date: "2024-04-25T02:38:41.491Z",
        },
        updatedAt: {
            $date: "2024-04-25T03:47:47.430Z",
        },
        __v: 0,
    },
    {
        _id: {
            $oid: "662a557be9b56ccb7183e2e1",
        },
        state: "active",
        phone: "22223",
        password:
            "$2b$08$1.fehTtC8F5sT0BjliSEZeEnwCANFsPgGXBKe6B0aYmBH5jtBeqw.",
        addresses: [],
        role: "shop",
        createdAt: {
            $date: "2024-04-25T13:07:07.906Z",
        },
        updatedAt: {
            $date: "2024-04-25T23:42:16.924Z",
        },
        __v: 0,
    },
    {
        _id: {
            $oid: "662b2021630e3f699fea5a96",
        },
        state: "active",
        phone: "1234",
        password:
            "$2b$08$yDvJyMbLusDBCicf8gjAXeBhQ9FFV0SrDB0l4uSzKsNZSYVUS9awi",
        role: "shop",
        addresses: [
            {
                latlng: {
                    lat: 10.808373246733877,
                    lng: 106.69678296893835,
                },
                name: "tuonguni",
                street: "87 Đ. Phan Văn Trị, Phường 14, Bình Thạnh, Thành phố Hồ Chí Minh, Vietnam",
                type: "Other",
            },
            {
                latlng: {
                    lat: 10.756756816785286,
                    lng: 106.66710499674082,
                },
                name: "uni",
                street: "216 Đ. Hùng Vương, Phường 9, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
                type: "Company",
            },
            {
                latlng: {
                    lat: 10.795359228370515,
                    lng: 106.7217493057251,
                },
                name: "landmark",
                street: "L4 - 28.OT11 Trần Trọng Kim, VINHOMES, Khu phố 5, Bình Thạnh, Thành phố Hồ Chí Minh, Vietnam",
                type: "Company",
            },
        ],
        createdAt: {
            $date: "2024-04-24T16:59:33.997Z",
        },
        updatedAt: {
            $date: "2024-05-05T08:23:24.112Z",
        },
        __v: 0,
        bio: "I love Fat Food",
        birth_date: {
            $date: "2002-12-31T17:00:00.000Z",
        },
        email: "dvtuong21@gmail.com",
        gender: "male",
        avatar: "https://res.cloudinary.com/shoppefood/image/upload/v1714814310/avatar/100000056324.jpg",
        fullname: "Dang Vinh Tuong",
        shop_liked: [
            {
                $oid: "6629366ff97d34060c218bf3",
            },
            {
                $oid: "6629c2315df0d9c8a01135b4",
            },
        ],
    },
    {
        _id: {
            $oid: "662b27575a0f5bf2780265c1",
        },
        state: "active",
        phone: "0123",
        password:
            "$2b$08$44N/G.V.sijGnpZU8ZTOJ.2gJdlckFaGhsHqaWEVfD.CMJoogXhy6",
        addresses: [],
        role: "shipper",
        createdAt: {
            $date: "2024-04-26T04:02:31.907Z",
        },
        updatedAt: {
            $date: "2024-04-26T04:25:51.797Z",
        },
        __v: 0,
    },
    {
        _id: {
            $oid: "662c67a897eec536b67740de",
        },
        state: "active",
        phone: "12344",
        password:
            "$2b$08$PmhWOYoaajWjopbjS87q9evm439kCahRsenf9z9uTlGuKO1sAQG1.",
        addresses: [
            {
                latlng: {
                    lat: 10.766709672612082,
                    lng: 106.68281268328428,
                },
                name: "huy",
                street: "333 Đ. Nguyễn Thị Minh Khai, Phường Nguyễn Cư Trinh, Quận 1, Thành phố Hồ Chí Minh, Vietnam",
                type: "Company",
            },
            {
                latlng: {
                    lat: 10.761316126538805,
                    lng: 106.68149907141924,
                },
                name: "123",
                street: "288/9BIS Đ. An Dương Vương, Phường 4, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
                type: "Home",
            },
            {
                latlng: {
                    lat: 10.77088379928115,
                    lng: 106.69313248246908,
                },
                name: "new",
                street: "7/1C Đ. Nguyễn Trãi, Phường Phạm Ngũ Lão, Quận 1, Thành phố Hồ Chí Minh, Vietnam",
                type: "Home",
            },
        ],
        role: "user",
        createdAt: {
            $date: "2024-04-27T02:49:12.431Z",
        },
        updatedAt: {
            $date: "2024-05-06T03:29:24.695Z",
        },
        __v: 0,
        shop_liked: [
            {
                $oid: "662a557be9b56ccb7183e2e1",
            },
            {
                $oid: "6629366ff97d34060c218bf3",
            },
            {
                $oid: "663766a800b13f8c2e564603",
            },
        ],
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShG1VPd4M8DBk3sxgR3AQfJGedVYtggkx1MBQNp_zpRA&s",
        fullname: "Pham Hoang Gia Huy",
        bio: "You can do anything but not everything",
    },
    {
        _id: {
            $oid: "663200999ac51925cbb45bce",
        },
        state: "active",
        phone: "4321",
        password:
            "$2b$08$.nq6MjCjbBGY7aqwKt8tae73gAKs6qIJegSiXY/7pAczUQRwAZkHq",
        addresses: [],
        role: "shop",
        shop_liked: [],
        createdAt: {
            $date: "2024-05-01T08:43:05.758Z",
        },
        updatedAt: {
            $date: "2024-05-01T09:17:17.595Z",
        },
        __v: 0,
    },
    {
        _id: {
            $oid: "66375fff675c76667ea0c325",
        },
        state: "active",
        phone: "0328799999",
        password:
            "$2b$08$rs6h.m.vg8lji17hWtknj.ziQc0xsCA0.ZyLbpoNFzLlrd91Meeky",
        addresses: [],
        role: "shop",
        shop_liked: [],
        createdAt: {
            $date: "2024-05-05T10:31:27.533Z",
        },
        updatedAt: {
            $date: "2024-05-05T10:50:00.792Z",
        },
        __v: 0,
    },
    {
        _id: {
            $oid: "663766a800b13f8c2e564603",
        },
        state: "active",
        phone: "0322222222",
        password:
            "$2b$08$z8BBhLTKaYAED31tr8VLAe8vVU6fCnKNthO9jtWLJdZkzI0OXAnce",
        addresses: [],
        role: "shop",
        shop_liked: [],
        createdAt: {
            $date: "2024-05-05T10:59:52.502Z",
        },
        updatedAt: {
            $date: "2024-05-05T11:08:32.663Z",
        },
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
