const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {

    static async register(req, res) {
        const { email, password } = req.body;

        try {
            const hash = await bcrypt.hash(password, 10);
            await User.create(email, hash);

            res.json({ msg: "Account created" });
        } catch {
            res.status(500).json({ msg: "User exists" });
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findByEmail(email);

            if (!user) return res.status(404).json({ msg: "User not found" });

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return res.status(401).json({ msg: "Wrong password" });

            const token = jwt.sign({ id: user.id }, "SECRET_KEY");

            res.json({ token });
        } catch {
            res.status(500).json({ msg: "Error" });
        }
    }
}

module.exports = AuthController;