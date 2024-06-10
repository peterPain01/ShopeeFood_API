// Define routes and corresponding microservices
const services = [
    {
        route: "/auth",
        target: "http://127.0.0.1:1234/auth",
    },
    {
        route: "/chat",
        target: "http://127.0.0.1:1235/",
    },

    {
        route: "/",
        target: "http://127.0.0.1:1234",
    },
];

export default services;
