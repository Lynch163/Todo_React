import { useState, useEffect } from "react";
import AddTaskForm from "./AddTaskForm.jsx";
import SearchTaskForm from "./SearchTaskForm.jsx";
import TodoInfo from "./TodoInfo.jsx";
import TodoList from "./TodoList.jsx";

const Todo = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      return JSON.parse(savedTasks);
    }

    return [
      {id: 'task-1', title: 'Купить молоко', isDone: false},
      {id: 'task-2', title: 'Погладить кота', isDone: true},
    ]
  });

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const deleteAllTasks = () => {
    const isConfirmed = confirm("Are you sure you want to delete all?");

    if (isConfirmed) setTasks([]);
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  }

  const toggleTaskComplete = (id, isDone) => {
    setTasks(
      tasks.map((task) => {
        if (id === task.id) {
          return {...task, isDone};
        }

        return task;
      })
    )
  }

  const addTask = () => {
    if (newTaskTitle.trim().length === 0) return;

    const newTask = {
      id: crypto?.randomUUID() ?? Date.now().toString(),
      title: newTaskTitle,
      isDone: false,
    }

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setSearchQuery("");
  }

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks])

  const clearSearchQuery = searchQuery.trim().toLowerCase();
  const filteredTasks = clearSearchQuery.length > 0
    ? tasks.filter(({title}) => title.toLowerCase().includes(clearSearchQuery))
    : null

  return (
    <div className="todo">
      <h1 className="todo__title">To Do List</h1>
      <AddTaskForm
        addTask={addTask}
        newTaskTitle={newTaskTitle}
        setNewTaskTitle={setNewTaskTitle}
      />
      <SearchTaskForm
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <TodoInfo
        total={tasks.length}
        done={tasks.filter(({isDone}) => isDone).length}
        onDeleteAllButtonClick={deleteAllTasks}
      />
      <TodoList
        tasks={tasks}
        filteredTasks={filteredTasks}
        onDeleteTaskButtonClick={deleteTask}
        onTaskCompleteChange={toggleTaskComplete}
      />
    </div>
  )
}

export default Todo;