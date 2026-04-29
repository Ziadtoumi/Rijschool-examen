const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "Geen token" });
    }

    try {
        const decoded = jwt.verify(token, "SECRET_KEY");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Ongeldige token" });
    }
}

module.exports = auth;