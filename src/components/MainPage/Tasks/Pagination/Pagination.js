import styles from './pagination.module.css';
import {useState} from "react";

function Pagination({ tasksPerPage, totalTasks, paginate }) {
    const pageNumbers = [];
    const countPages = Math.ceil(totalTasks/tasksPerPage);

    for (let i=1; i<=countPages; i++) {
        pageNumbers.push(i);
    }

    const [currentPage, setCurrentPage] = useState(1);

    const selectPage = (page) => {
        paginate(page);
        setCurrentPage(page);
    }

    const getPageClass = (page) => {
        return page === currentPage ? `${styles.activePage}` : '';
    }

    return (
        <div className={styles.pagination}>
            <ul className={styles.paginationList}>
                { pageNumbers.map(page => (
                    <li className={getPageClass(page)} onClick={() => selectPage(page)} key={page}>{page}</li>
                )) }
            </ul>
        </div>
    )
}

export default Pagination;