const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            unique: true,
        },
        login: {
            type: "varchar",
        },
        password: {
            type: "varchar",
        },
        isAdmin: {
            type: "boolean"
        },
        accessToken: {
            type: "varchar",
            nullable: true,
        }
    },
})