const authMiddleware = (req, res, next) => {
    const accessToken = req.headers['authorization'].split(' ')[1];

    if (!accessToken || accessToken === 'null') {
        res.status(400).json({ message: "Пользователь не авторизован" })
        return;
    }

    next();
}

module.exports = authMiddleware;