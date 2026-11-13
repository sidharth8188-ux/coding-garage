import { useEffect, useState } from 'react'

const starterTasks = [
  { id: 1, text: 'Pick up a few things from the market', done: false },
  { id: 2, text: 'Reply to the messages I have been putting off', done: false },
  { id: 3, text: 'Take a proper break this afternoon', done: true },
]

function readTasks() {
  try {
    const saved = localStorage.getItem('little-list-tasks')
    return saved ? JSON.parse(saved) : starterTasks
  } catch {
    return starterTasks
  }
}

export default function App() {
  const [tasks, setTasks] = useState(readTasks)
  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('little-list-tasks', JSON.stringify(tasks))
  }, [tasks])

  function addTask(event) {
    event.preventDefault()
    const text = newTask.trim()
    if (!text) return
    setTasks([{ id: Date.now(), text, done: false }, ...tasks])
    setNewTask('')
  }

  function toggleTask(id) {
    setTasks(tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task))
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  function clearCompleted() {
    setTasks(tasks.filter((task) => !task.done))
  }

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.done
    if (filter === 'done') return task.done
    return true
  })
  const remaining = tasks.filter((task) => !task.done).length
  const today = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Little List home"><span className="brand-mark">l.</span> little list</a>
        <span className="top-note">A little space to get things done</span>
      </header>

      <section className="todo-card" id="top">
        <div className="intro">
          <p className="date-label">{today}</p>
          <h1>Make room<br />for <em>today.</em></h1>
          <p className="intro-copy">One thing at a time is still progress.</p>
        </div>

        <form className="add-form" onSubmit={addTask}>
          <label className="sr-only" htmlFor="new-task">Add a task</label>
          <input id="new-task" value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="What would you like to do?" />
          <button type="submit" aria-label="Add task">＋</button>
        </form>

        <div className="list-heading">
          <div><h2>Your list</h2><span className="task-count">{remaining} left</span></div>
          <div className="filters" aria-label="Filter tasks">
            {['all', 'active', 'done'].map((item) => <button key={item} className={filter === item ? 'filter active-filter' : 'filter'} onClick={() => setFilter(item)} type="button">{item}</button>)}
          </div>
        </div>
        {tasks.some((task) => task.done) && (
          <button className="clear-button" type="button" onClick={clearCompleted}>Clear completed</button>
        )}

        <ul className="task-list">
          {visibleTasks.map((task) => (
            <li className={task.done ? 'task done-task' : 'task'} key={task.id}>
              <button className="check-button" type="button" onClick={() => toggleTask(task.id)} aria-label={task.done ? `Mark ${task.text} as not done` : `Mark ${task.text} as done`}>
                {task.done && <span>✓</span>}
              </button>
              <span className="task-text">{task.text}</span>
              <button className="delete-button" type="button" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.text}`}>×</button>
            </li>
          ))}
          {visibleTasks.length === 0 && <li className="empty-state">Nothing here for now. Enjoy the breathing room.</li>}
        </ul>

        <footer className="card-footer"><span>Small steps count.</span><span>✳</span></footer>
      </section>
      <p className="page-footer">Made for your everyday, one tick at a time.</p>
    </main>
  )
}
