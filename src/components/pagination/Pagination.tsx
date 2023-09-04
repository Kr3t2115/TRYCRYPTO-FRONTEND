import React, {ReactNode} from "react";
import classes from './Pagination.module.css'


const Pagination = ({
  dataLength,
  imagePerPage,
  setCurrentPage,
  currentPage,
}: any) => {
  let pages = [];

  for (let i = 1; i <= Math.ceil(dataLength / imagePerPage); i++) {
    pages.push(i);
  }

  return (
    <div className={classes.pagination}>
      {pages.map((page, index) => {
        return (
          <button
            key={index}
            onClick={() => setCurrentPage(page)}
            className={page == currentPage ? classes.active : ""}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;