import { Routes, Route } from 'react-router-dom';
import MainPage from "./components/MainPage/MainPage";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import styles from './app.module.css';
import {getUser} from "./redux/slices/userSlice";

function App() {
    const dispatch = useDispatch();
    const isUserLogin = useSelector((state) => state.userReducer.isLogin);
    useEffect(() => {
        dispatch(getUser());
    }, [isUserLogin]);
    return (
      <div className={styles.app}>
          <Routes>
              <Route path="/" element={<MainPage />} />
          </Routes>
      </div>
    );
}

export default App;
