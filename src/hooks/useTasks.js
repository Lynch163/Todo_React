import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import tasksAPI from "../api/tasksAPI.js";

const useTasks = () => {
  const [tasks, setTasks] = useState([]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const newTaskInputRef = useRef(null);


  const deleteAllTasks = useCallback(() => {
    const isConfirmed = confirm("Are you sure you want to delete all?");

    if (isConfirmed) {
      tasksAPI.deleteAll(tasks)
        .then(() => setTasks([]))
    }
  }, [tasks]);

  const deleteTask = useCallback((id) => {
    tasksAPI.delete(id)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
  }, [tasks])

  const toggleTaskComplete = useCallback((id, isDone) => {
    tasksAPI.toggleComplete(id, isDone)
      .then(() => {
        setTasks(
          tasks.map((task) => {
            if (id === task.id) {
              return {...task, isDone};
            }

            return task;
          })
        )
      })
  }, [tasks])

  const addTask = useCallback((title) => {
    const newTask = {
      title,
      isDone: false,
    }
    tasksAPI.add(newTask).then(addedTask => {
        setTasks((prevTasks) => [...prevTasks, addedTask]);
        setNewTaskTitle("");
        setSearchQuery("");
        newTaskInputRef.current.focus();
      })
  }, []);

  useEffect(() => {
    newTaskInputRef.current.focus();

    tasksAPI.getAll().then(setTasks)
  }, [])

  const filteredTasks = useMemo(() => {
    const clearSearchQuery = searchQuery.trim().toLowerCase();
    return clearSearchQuery.length > 0
      ? tasks.filter(({title}) => title.toLowerCase().includes(clearSearchQuery))
      : null
  }, [searchQuery, tasks])

  return {
    tasks,
    filteredTasks,
    deleteTask,
    deleteAllTasks,
    toggleTaskComplete,
    newTaskTitle,
    setNewTaskTitle,
    searchQuery,
    setSearchQuery,
    newTaskInputRef,
    addTask,
  }
}

export default useTasks;