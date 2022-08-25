const { DataSource } = require('typeorm');
const UserEntity = require('../entities/user.entity');
const TaskEntity = require('../entities/task.entity');
require('dotenv').config()

const AppDataSource = new DataSource({
    type: process.env.TYPE_DATABASE,
    host: process.env.HOST,
    port: Number(process.env.PORT_DATABASE),
    username: process.env.USER_DATABASE,
    password: process.env.USER_PASSWORD_DATABASE,
    database: process.env.edb_admin,
    synchronize: true,
    logging: true,
    entities: [UserEntity, TaskEntity],
    subscribers: [],
    migrations: [],
})

module.exports = AppDataSource;