import styles from './pagination.module.css';
import {useState} from "react";

function Pagination({ tasksPerPage, totalTasks, paginate }) {
    const pageNumbers = [];

    for (let i=1; i<=Math.ceil(totalTasks/tasksPerPage); i++) {
        pageNumbers.push(i);
    }

    const [currentPage, setCurrentPage] = useState(1);

    const selectPage = (page) => {
        paginate(page);
        setCurrentPage(page);
    }

    const isActivePage = (page) => {
        return page === currentPage ? `${styles.activePage}` : '';
    }

    return (
        <div className={styles.pagination}>
            <ul className={styles.paginationList}>
                { pageNumbers.map(page => (
                    <li className={isActivePage(page)} onClick={() => selectPage(page)} key={page}>{page}</li>
                )) }
            </ul>
        </div>
    )
}

export default Pagination;