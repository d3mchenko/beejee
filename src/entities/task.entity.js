const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "Task",
    tableName: "tasks",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        user: {
            type: "varchar",
        },
        email: {
            type: "varchar",
        },
        task: {
            type: "text",
        },
        completed: {
            default: false,
            type: "boolean",
        },
        isEdited: {
            default: false,
            type: "boolean",
        }
    },
})