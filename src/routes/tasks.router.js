const router = require('express').Router();
const taskController = require('../controllers/tasks.controller');
const authMiddleware = require("./middleware/authMiddleware");

router.post('/create', taskController.createTask);
router.get('/get-all', taskController.getTasks);
router.put('/edit/:id', authMiddleware, taskController.editTask)

module.exports = router;

