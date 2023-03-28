import Header from 'components/Header';
import TodosLogic from 'components/TodosLogic';
import Navbar from 'components/NavBar';
const TodoApp = () => {
  return (
    <div className="wrapper">
      <div className="todos">
        <Navbar />
        <Header />
        <TodosLogic />
      </div>
    </div>
  );
};
export default TodoApp;
