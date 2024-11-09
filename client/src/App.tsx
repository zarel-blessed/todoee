import Container from "./components/Container"

export interface Todo {
  id?: string
  task: string
  iscompleted: boolean
}

const App = () => {
  return (
    <div className="page">
      <Container />
    </div>
  )
}

export default App
