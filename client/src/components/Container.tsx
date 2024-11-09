import { FormEvent, useEffect, useState } from 'react'
import { Todo } from '../App'
import TodoItem from './TodoItem'
import "../style/Container.css"

const Container = () => {
    const [todos, setTodos] = useState<Todo[]>([])
    const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetch("http://localhost:9000/todos")
      .then(resp => resp.json())
      .then(data => {
          console.log(data)
          setTodos(data)
      })
  }, [])

  async function addTodo(e: FormEvent) {
    e.preventDefault();

    if(newTodo == "") return

    const resp = await fetch("http://localhost:9000/todos", {
        method: "POST",
        body: JSON.stringify({
          task: newTodo,
          iscompleted: false
      })
    })

    if(resp.status != 201) {
        alert("Something went wrong!")
        return
    }
    
    const data = await resp.json()

    setNewTodo("")
    setTodos([...todos, {
      id: data.InsertedID,
      task: newTodo,
      iscompleted: false
  }])

    console.log("Todo added successfully!")
  }

  return (
    <div className='container'>
      <h1>Todoee</h1>
      <form>
        <input type="text" onChange={(e) => setNewTodo(e.target.value)} value={newTodo} placeholder='Enter a new todo...' />
        <button onClick={addTodo}>Add</button>
      </form>
      <div className='todos'>
      {
        todos?.map(todo => (
          <TodoItem key={todo.id} todo={todo} todos={todos} setTodos={setTodos} />
        ))
      }
      </div>
    </div>
  )
}

export default Container
