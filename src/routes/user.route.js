const router = require('express').Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require("./middleware/authMiddleware");

router.post('/login', userController.login);
router.get('/get-data', authMiddleware, userController.getUserData);

module.exports = router;