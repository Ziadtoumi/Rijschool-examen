const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const lessonRoutes = require("./routes/lessonRoutes");

class Server {
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, "../frontend")));
    }

    routes() {
        this.app.use("/api/auth", authRoutes);
        this.app.use("/api/lessons", lessonRoutes);
    }

    start() {
        this.app.listen(3000, () => {
            console.log("Server running on http://localhost:3000");
        });
    }
}

new Server().start();