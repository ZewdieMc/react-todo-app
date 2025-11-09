import React, { useState } from 'react';
import Header from 'components/Header';
import TodosLogic from 'components/TodosLogic';
// import Navbar from 'components/NavBar';
import styles from '../styles/App.module.css';

const TodoApp = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const todosPerPage = 5;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleUserChange = (user) => {
    setCurrentUser(user);
  };

  return (
    <div className={styles.appContainer}>
      <div className="wrapper">
        <div className="todos">
          <Header user={currentUser} onAuthChange={handleUserChange} />
          <TodosLogic
            currentPage={currentPage}
            todosPerPage={todosPerPage}
            onPageChange={handlePageChange}
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
