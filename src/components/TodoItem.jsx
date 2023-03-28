const TodoItem = ({ itemProp, onChange , deleteTodo}) => {

  return (
    <li>
      <input 
      type="checkbox"
      checked={itemProp.completed}
      onChange={()=>onChange(itemProp.id)}/>
      <button 
      onClick={()=>deleteTodo(itemProp.id)}
      >Delete</button>
      {itemProp.title}
    </li>
  );
};
export default TodoItem;
