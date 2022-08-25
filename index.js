const express = require("express");
const cors = require("cors");
const AppDataSource = require("./src/config/database.config");
const tasksRouter = require("./src/routes/tasks.router");
const userRouter = require("./src/routes/user.route");
AppDataSource.initialize();

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4005;
app.listen(PORT);

app.use('/api/tasks', tasksRouter);
app.use('/api/user', userRouter);