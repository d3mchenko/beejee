const AppDataSource = require("../config/database.config");

class TasksController {
    async createTask(req, res) {
        const taskData = req.body;

        const taskRepository = AppDataSource.getRepository("Task");
        const createdTask = await taskRepository.save(taskData);

        res.send(createdTask);
    }

    async getTasks(req, res) {
        const taskRepository = AppDataSource.getRepository("Task");

        const taskList = await taskRepository.find({
            order: {
                id: "ASC"
            }
        });

        res.send(taskList);
    }

    async editTask(req, res) {
        const taskId = req.params.id;
        const { user, email, task, isEdited, completed } = req.body;

        const updatedTaskResult = await AppDataSource
            .createQueryBuilder()
            .update("Task")
            .set({ user, email, task, isEdited, completed })
            .where("id = :id", { id: taskId })
            .returning("*")
            .execute()

        res.send(updatedTaskResult.raw[0]);
    }
}

module.exports = new TasksController();