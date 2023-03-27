const TodosLogic = () => {
  const todos = [
    {
      id: 1,
      title: 'Setup development environment',
      completed: true,
    },
    {
      id: 2,
      title: 'Develop website and add content',
      completed: false,
    },
    {
      id: 3,
      title: 'Deploy to live server',
      completed: false,
    },
  ].map(todo => <li key={todo.id}>{todo.title}</li>);

  return (
    <ul>{todos}</ul>
  )
}
export default TodosLogic;
