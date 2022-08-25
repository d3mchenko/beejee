const AppDataSource = require("../config/database.config");
const { v4: uuidv4 } = require('uuid');

class UserController {
    async login(req, res) {
        const userData = req.body;

        const updatedUser = await AppDataSource
            .createQueryBuilder()
            .update("User")
            .set({ accessToken: uuidv4() })
            .where("login = :login", { login: userData.login })
            .andWhere("password = :password", { password: userData.password })
            .returning("*")
            .execute()

        const user = updatedUser.raw[0];

        if (!user || (user && !user.isAdmin)) {
            res.status(400).json({ message: "Пользователь не существует или не является администратором" })
            return;
        }

        delete user.password;

        res.status(200).send(user);
    }

    async getUserData(req, res) {
        const userRepository = await AppDataSource.getRepository("User");
        const accessToken = req.headers['authorization'].split(' ')[1];

        const user = await userRepository
            .createQueryBuilder("user")
            .where("user.accessToken = :accessToken", { accessToken })
            .getOne()

        if (!user || (user && !user.isAdmin)) {
            res.status(400).json({ message: "Пользователь не существует или не авторизован" })
            return;
        }

        delete user.password;

        res.status(200).send(user);
    }
}

module.exports = new UserController();