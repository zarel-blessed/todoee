import { Dispatch, SetStateAction } from 'react'
import {Todo} from '../App'
import "../style/TodoItem.css"

const TodoItem = ({todo, todos, setTodos}: {todo: Todo, todos: Todo[], setTodos: Dispatch<SetStateAction<Todo[]>>}) => {
    function deleteTodo() {
        fetch(`http://localhost:9000/todos/${todo.id}`, {
            method: "DELETE"
        }).then(resp => {
            if(resp.status != 200) {
                alert("Error deleting the todo!")
                return
            }
            console.log("Todo deleted successfully!")
        })
        
        setTodos(todos?.filter(x => x.id != todo.id))
    }

  return (
    <article>
      <p>{todo.task}</p>
      <div className='icons'>
        <div><img src="./tick.png" alt="" /></div>
        <div onClick={deleteTodo}>&times;</div>
      </div>
    </article>
  )
}

export default TodoItem
