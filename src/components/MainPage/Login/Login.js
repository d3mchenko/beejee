import { Box, IconButton, Modal } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import styles from './login.module.css';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../redux/slices/userSlice";
import NotificationService from "../../../services/notificationService";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 420,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function Login({ isLoginModal, closeLoginModal }) {
    const dispatch = useDispatch();
    const [state, setState] = useState({ login: "", password: "", loginValid: true, passwordValid: true });
    const handleClose = () => {
        clearLoginForm();
        closeLoginModal();
    }

    const handleChangeInput = (e) => {
        setError({ isError: false, errorMessage: "" })
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
            loginValid: true,
            passwordValid: true,
        }))
    }

    const getClassInput = (nameInput) => {
        if (!state[nameInput]) {
            return `${styles.input} ${styles.errorInput}`
        } else {
            return styles.input;
        }
    }

    const [errorState, setError] = useState({ isError: false, errorMessage: ''});

    const clearLoginForm = () => {
        setState({ login: "", password: "", loginValid: true, passwordValid: true })
        setError({ errorMessage: "", isError: false })
    }

    const setInputInvalid = (field) => {
        setState((prevState) => ({
            ...prevState,
            [field]: false,
        }))
    }

    const onLogin = () => {
        let errorForm = false;
        if (!state.login) {
            setInputInvalid("loginValid")
            errorForm = true;
        }
        if (!state.password) {
            setInputInvalid("passwordValid")
            errorForm = true;
        }

        if (errorForm) {
            setError({ isError: true, errorMessage: "Некорректно заполненная форма" });
            return;
        }

        const userData = {
            login: state.login,
            password: state.password,
        }

        dispatch(loginUser(userData)).unwrap()
            .then(user => {
                NotificationService.successNotif(`Добро пожаловать, ${user.login}`)
                closeLoginModal();
                clearLoginForm();
            })
            .catch(err => {
                setError({ isError: true, errorMessage: err.message })
            })
    }

    return (
        <div>
            <Modal
                open={isLoginModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                    { errorState.isError ?
                        (<div className={styles.errorForm}>
                            <p>{errorState.errorMessage}</p>
                        </div>) :
                        null
                    }
                    <div className={styles.wrapperForm}>
                        <p className={styles.titleInput}>Логин</p>
                        <input
                            type="text"
                            placeholder="Логин"
                            className={getClassInput("loginValid")}
                            value={state.login}
                            name="login"
                            onChange={handleChangeInput}
                        />
                        <p className={styles.titleInput}>Пароль</p>
                        <input
                            type="password"
                            placeholder="Пароль"
                            className={getClassInput("passwordValid")}
                            value={state.password}
                            name="password"
                            onChange={handleChangeInput}
                        />
                    </div>
                    <div className={styles.wrapperLogin}>
                        <button className={styles.login} onClick={onLogin}>Войти</button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default Login;