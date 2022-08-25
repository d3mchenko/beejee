import styles from './tasks.module.css';
import {Checkbox, Grid, IconButton, Stack} from "@mui/material";
import Login from "../Login/Login";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {logoutUser} from "../../../redux/slices/userSlice";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import {createTask, editTask, getTasks, setSortedTasks} from "../../../redux/slices/tasksSlice";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "./Pagination/Pagination";
import {fieldForSort, sortFilters, typeSort} from "./sources/sortFilters";
import NotificationService from "../../../services/notificationService";

const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

function Tasks() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTasks());
    }, [])

    const user = useSelector((state) => state.userReducer);
    const tasksData = useSelector((state) => state.tasksReducer.tasks);

    const [isLoginModal, setIsLoginModal] = useState(false);
    const [taskForm , setTaskForm] = useState(false);
    const [isEditTask, setIsEditTask] = useState(false);
    const [errorState, setError] = useState({ isError: false, errorMessage: ""});
    const [state, setState] = useState({
        user: "",
        email: "",
        task: "",
        userValid: true,
        taskValid: true,
        emailValid: true,
        completed: false,
        isEdited: false
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage, setTasksPerPage] = useState(3);

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasksData.slice(indexOfFirstTask, indexOfLastTask);

    const isEmailValid = (email) => {
        const isValid = EMAIL_REGEXP.test(email);
        if (!isValid) {
            setError({ isError: true, errorMessage: "Невалидный email." })
        }
        return isValid;
    }

    const paginate = (page) => {
        setCurrentPage(page);
    }

    const clearTaskForm = () => {
        setState({ user: "", email: "", task: "", userValid: true, taskValid: true, emailValid: true, completed: false, isEdited: false });
        setError({ isError: false, errorMessage: ""});
    }

    const onLogin = () => {
        setIsLoginModal((prevState) => !prevState);
    }

    const onLogout = () => {
        dispatch(logoutUser());
    }

    const handleNewTask = () => {
        clearTaskForm();
        setTaskForm((prevState) => !prevState);
    }

    const handleChangeInput = (e) => {
        setError({ isError: false, errorMessage: "" });
        const { name, value } = e.target;

        setState((prevState) => ({
            ...prevState,
            [name]: value,
            taskValid: true,
            userValid: true,
            emailValid: true
        }))
    }

    const handleChangeTaskStatus = (status) => {
        setState((prevState) => ({
            ...prevState,
            completed: status,
        }))
    }

    const onChangeTaskStatus = (status, taskData) => {
        dispatch(editTask({...taskData, completed: status})).unwrap().then(() => {
            NotificationService.successNotif('Задача успешно отредактирована');
            setIsEditTask(false);
            clearTaskForm();
        }).catch((err) => {
            NotificationService.failedNotif(err.message)
        })
    }

    const setInputInvalid = (field) => {
        setState((prevState) => ({
            ...prevState,
            [field]: false,
        }))
    }

    const validateTaskForm = () => {
        setError({ isError: false, errorMessage: "" })
        let errorForm = false;
        if (!state.user) {
            setInputInvalid("userValid")
            errorForm = true;
        }
        if (!state.task) {
            setInputInvalid("taskValid")
            errorForm = true;
        }
        if (!isEmailValid(state.email)) {
            setInputInvalid("emailValid")
            errorForm = true;
            setError({ isError: true, errorMessage: "Невалидный email." })
        }

        if (errorForm) {
            setError((prevState) => ({ isError: true, errorMessage: `${prevState.errorMessage} Некорректно заполненная форма` }));
        }
        return errorForm;
    }

    const onAddNewTask = async () => {
        const isNotValidTaskForm = validateTaskForm();

        if (isNotValidTaskForm) {
            return;
        }

        const taskData = {
            email: state.email,
            user: state.user,
            task: state.task,
            completed: state.completed,
        }
        dispatch(createTask(taskData)).unwrap()
            .then(() => {
                NotificationService.successNotif('Задача успешно создана')
                setTaskForm(false);
                clearTaskForm();
            })
            .catch(() => {
                NotificationService.failedNotif('Ошибка создания задачи')
            })
    }

    const editSelectedTask = (taskData) => {
        setError({ isError: false, errorMessage: ""});
        setState({
            emailValid: true,
            taskValid: true,
            userValid: true,
            ...taskData,
        })
        setIsEditTask(true);
    }

    const onEditTask = () => {
        const isNotValidTaskForm = validateTaskForm();

        if (isNotValidTaskForm) {
            return;
        }

        dispatch(editTask(state)).unwrap().then(() => {
            NotificationService.successNotif('Задача успешно отредактирована');
            clearTaskForm();
            setIsEditTask(false);
        }).catch((err) => {
            NotificationService.failedNotif(err.message)
        })
    }

    const sortTasks = (filterName, sort) => {
        let sortedTasks = [];
        if (filterName !== fieldForSort.completed) {
            sortedTasks = [...tasksData].sort((a, b) => sort === typeSort.asc
                ?
                a[filterName].localeCompare(b[filterName]) :
                b[filterName].localeCompare(a[filterName]));
        } else {
            sortedTasks = [...tasksData].sort((a, b) => sort === typeSort.asc
                ?
                b.completed - a.completed :
                a.completed - b.completed)
        }

        dispatch(setSortedTasks(sortedTasks));
    }

    const changeFilter = (filterName) => {
        switch (filterName) {
            case sortFilters.user.asc:
                sortTasks(fieldForSort.user, typeSort.asc);
                break;
            case sortFilters.user.desc:
                sortTasks(fieldForSort.user, typeSort.desc);
                break;
            case sortFilters.email.asc:
                sortTasks(fieldForSort.email, typeSort.asc);
                break;
            case sortFilters.email.desc:
                sortTasks(fieldForSort.email, typeSort.desc);
                break;
            case sortFilters.status.completed:
                sortTasks(fieldForSort.completed, typeSort.asc);
                break;
            case sortFilters.status.notCompleted:
                sortTasks(fieldForSort.completed, typeSort.desc);
                break;
        }
    }

    const getClassInput = (nameInput) => {
        if (!state[nameInput]) {
            return `${styles.newTaskInput} ${styles.errorInput}`
        } else {
            return styles.newTaskInput;
        }
    }

    return (
        <div className={styles.wrapperTasks}>
            <h1 className={styles.title}>Todo List</h1>
            <div className={styles.tasks}>
                <div className={styles.headerTasks}>
                    <Grid container spacing={0}>
                        <Grid item xs={3} className={styles.wrapperTaskInfo}>
                            <p>Пользователь</p>
                        </Grid>
                        <Grid item xs={3} className={styles.wrapperTaskInfo}>
                            <p>Почта</p>
                        </Grid>
                        <Grid item xs={1.5} className={styles.wrapperTaskInfo}>
                            <p>Статус</p>
                        </Grid>
                        <Grid item xs={4} className={styles.wrapperTaskInfo}>
                            <p>Задача</p>
                        </Grid>
                        <Grid item xs={0.5} className={styles.wrapperTaskInfo}>
                            <p>Редакт.</p>
                        </Grid>
                    </Grid>
                </div>
                <div>
                    { currentTasks.map(taskData => {
                        return (<Grid container spacing={0} className={styles.task}>
                            <Grid item xs={3} className={styles.wrapperTaskInfo}>
                                <p>{taskData.user}</p>
                            </Grid>
                            <Grid item xs={3} className={styles.wrapperTaskInfo}>
                                <p>{taskData.email}</p>
                            </Grid>
                            <Grid item xs={1.5} className={styles.wrapperTaskInfo}>
                                <div className={styles.statuses}>
                                    <Checkbox disabled={!user.isAdmin} checked={taskData.completed} onChange={(event, checked) => onChangeTaskStatus(checked, taskData)}/>
                                </div>
                            </Grid>
                            <Grid item xs={4} className={styles.wrapperTaskInfo}>
                                <p>{taskData.task}</p>
                            </Grid>
                            <Grid item xs={0.5} className={styles.wrapperTaskInfo}>
                                <IconButton disabled={!user.isAdmin} onClick={() => editSelectedTask(taskData)}>
                                    <EditIcon />
                                </IconButton>
                            </Grid>
                        </Grid>)
                    })}
                </div>
            </div>
            { taskForm || isEditTask ? (
                <div className={styles.wrapperTaskForm}>
                    <div className={styles.wrapperNewTask}>
                        <div className={styles.newTaskInputs}>
                            <input className={getClassInput("userValid")} type="text" placeholder="Пользователь" name="user" value={state.user} onChange={handleChangeInput}/>
                            <input className={getClassInput("emailValid")} type="email" placeholder="Почта" name="email" value={state.email} onChange={handleChangeInput}/>
                            <input className={getClassInput("taskValid")} type="text" placeholder="Задача" name="task" value={state.task} onChange={handleChangeInput}/>
                            <Checkbox checked={state.completed} name="completed" onChange={(event, checked) => { handleChangeTaskStatus(checked) }}/>
                        </div>
                        { taskForm ?
                            (<IconButton className={styles.plusIcon} onClick={() => onAddNewTask()}>
                                <AddIcon />
                            </IconButton>) :
                            (<IconButton className={styles.plusIcon} onClick={() => onEditTask()}>
                                <DoneIcon />
                            </IconButton>)
                        }
                    </div>
                    { errorState.isError ? (
                        <div className={styles.wrapperErrorNewTask}>
                            <div className={styles.errorNewTask}>
                                <p>{errorState.errorMessage}</p>
                            </div>
                        </div>
                    ) : null }
                </div>
            ) : null }
            <div className={styles.wrapperFilters}>
                <select defaultValue={3} onChange={(event) => setTasksPerPage(event.target.value)}>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
                <select defaultValue="none" onChange={(event) => changeFilter(event.target.value)}>
                    <option value="none">No filter</option>
                    <option value={sortFilters.user.asc}>Имя пользователя(По возр.)</option>
                    <option value={sortFilters.user.desc}>Имя пользователя(По убыв.)</option>
                    <option value={sortFilters.email.asc}>Почта(По возр.)</option>
                    <option value={sortFilters.email.desc}>Почта(По убыв.)</option>
                    <option value={sortFilters.status.completed}>Статус(Выполн.)</option>
                    <option value={sortFilters.status.notCompleted}>Статус(Не выполн.)</option>
                </select>
            </div>
            <div className={styles.wrapperPagination}>
                <Pagination tasksPerPage={tasksPerPage} totalTasks={tasksData.length} paginate={paginate}/>
            </div>

            <div className={styles.wrapperButtons}>
                {
                    isEditTask ? null : (
                        <button className={styles.addNewTask} onClick={handleNewTask}>Новая задача</button>
                    )
                }
                { user.login ?
                    (<button className={styles.login} onClick={onLogout}>Выход</button>) :
                    (<button className={styles.login} onClick={onLogin}>Вход</button>)
                }
            </div>
            <Login isLoginModal={isLoginModal} closeLoginModal={onLogin}/>
            <ToastContainer />
        </div>
    )
}

export default Tasks;