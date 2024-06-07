import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import path from "path";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
});

const ADMIN = "Admin";
interface User {
    id: string;
    name: string;
    room: string;
}

const UsersState = {
    users: [] as User[],
    setUsers: function (newUsersArray: User[]) {
        this.users = newUsersArray;
    },
};

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("enterRoom", ({ name, room }) => {
        socket.join(room);
        const prevRoom = getUser(socket.id)?.room;
        if (prevRoom) {
            socket.leave(prevRoom);
            io.to(prevRoom).emit(
                "message",
                buildMsg(ADMIN, `${name} has left the room`)
            );
        }

        const user = activateUser(socket.id, name, room);
        if (prevRoom) {
            io.to(prevRoom).emit("userList", {
                users: getUsersInRoom(prevRoom),
            });
        }
        socket.join(user.room);

        // To user who joined
        socket.emit(
            "message",
            buildMsg(ADMIN, `You have joined the ${user.room} chat room`)
        );

        // To everyone else
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                buildMsg(ADMIN, `${user.name} has joined the room`)
            );

        io.to(user.room).emit("userList", {
            users: getUsersInRoom(user.room),
        });

        // Update rooms list for everyone
        io.emit("roomList", {
            rooms: getAllActiveRooms(),
        });

        console.log("user entered room: " + room);
    });

    socket.on("message", ({ name, text }) => {
        const room = getUser(socket.id)?.room;
        if (room) {
            io.to(room).emit("message", buildMsg(name, text));
        }
    });

    // Listen for activity
    socket.on("activity", (name) => {
        const room = getUser(socket.id)?.room;
        if (room) {
            socket.broadcast.to(room).emit("activity", name);
        }
    });
});

function buildMsg(name: string, text: string) {
    return {
        name,
        text,
        time: new Intl.DateTimeFormat("default", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        }).format(new Date()),
    };
}

function activateUser(id: string, name: string, room: string) {
    const user = { id, name, room };
    UsersState.setUsers([
        ...UsersState.users.filter((user) => user.id !== id),
        user,
    ]);
    return user;
}

function getUser(id: string): User | undefined {
    return UsersState.users.find((user) => user.id === id);
}

function getUsersInRoom(room: string) {
    return UsersState.users.filter((user) => user.room === room);
}

function getAllActiveRooms() {
    return Array.from(new Set(UsersState.users.map((user) => user.room)));
}

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
