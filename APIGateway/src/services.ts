// Define routes and corresponding microservices
const services = [
    {
        route: "/auth",
        target: "https://localhost:1234/auth",
    },
    {
        route: "/chat",
        target: "https://localhost:1234/chat/",
    },
    {
        route: "/main",
        target: "https://localhost:1234/",
    },
];

export default services;
