import Tasks from "./Tasks/Tasks";
import styles from './main-page.module.css';

function MainPage() {
    return (
        <div className={styles.wrapperMainPage}>
            <Tasks />
        </div>
    )
}

export default MainPage;