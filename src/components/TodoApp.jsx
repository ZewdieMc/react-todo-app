import Header from 'components/Header';
import TodosLogic from 'components/TodosLogic';
import Navbar from 'components/NavBar';
const TodoApp = () => {
  return (
    <>
      <Navbar />
      <Header />
      <TodosLogic />
    </>
  );
};
export default TodoApp;
