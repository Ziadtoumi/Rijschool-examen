const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {

    static async register(req, res) {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Vul alle velden in" });
        }

        try {
            const hash = await bcrypt.hash(password, 10);
            await User.create(name, email, hash);
            res.status(201).json({ msg: "Account aangemaakt" });

        } catch (error) {
            console.log("REGISTER ERROR:", error.message);
            res.status(500).json({ msg: error.message });
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Vul alle velden in" });
        }

        try {
            const user = await User.findByEmail(email);

            if (!user) {
                return res.status(404).json({ msg: "Gebruiker niet gevonden" });
            }

            const valid = await bcrypt.compare(password, user.password);

            if (!valid) {
                return res.status(401).json({ msg: "Verkeerd wachtwoord" });
            }

            const token = jwt.sign(
                { id: user.id },
                "SECRET_KEY",
                { expiresIn: "2h" }
            );

            res.json({ token, name: user.name });

        } catch (error) {
            console.log("LOGIN ERROR:", error.message);
            res.status(500).json({ msg: error.message });
        }
    }

}

module.exports = AuthController;