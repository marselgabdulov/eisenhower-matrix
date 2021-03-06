import React, { useReducer } from 'react';
import TasksContext from './tasksContext';
import tasksReducer from './tasksReducer';

import {
  CREATE_TASK,
  DELETE_TASK,
  SET_TASK_PRIORITY,
  SET_TASKS,
  CLEAR_ALL,
  EDIT_TASK,
  SET_DONE
} from '../types';

const TasksState = props => {
  const initialState = {
    tasks: []
  };

  const [state, dispatch] = useReducer(tasksReducer, initialState);

  // Set tasks
  function setTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks !== null) {
      dispatch({
        type: SET_TASKS,
        payload: tasks
      });
    }
  }

  // Get task list by priority
  function getTaskList(priority) {
    let taskList;
    if (state.tasks.length > 0) {
      taskList = state.tasks.filter(task => task.priority === priority);
    } else {
      taskList = [];
    }
    return taskList;
  }

  // Create new task
  function addTask(newTask) {
    dispatch({
      type: CREATE_TASK,
      payload: {
        id: Date.now(),
        priority: 'unordered',
        task: newTask,
        done: false
      }
    });
    localStorage.setItem(
      'tasks',
      JSON.stringify([
        ...state.tasks,
        { id: Date.now(), priority: 'unordered', task: newTask, done: false }
      ])
    );
  }

  // Edit task text
  function editTask(taskId, text) {
    const newTasks = state.tasks.map(task => {
      if (task.id === taskId) {
        task.task = text;
      }
      return task;
    });
    dispatch({ type: EDIT_TASK, payload: newTasks });
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  }

  // Change task's priority
  function setTaskPriority(taskId, priority) {
    const newTasks = state.tasks.map(task => {
      if (task.id === taskId) {
        task.priority = priority;
      }
      return task;
    });
    dispatch({ type: SET_TASK_PRIORITY, payload: newTasks });
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  }

  // Mark task as done
  function setDone(taskId, isDone) {
    const newTasks = state.tasks.map(task => {
      if (task.id === taskId) {
        task.done = isDone;
      }
      return task;
    });
    dispatch({ type: SET_DONE, payload: newTasks });
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  }

  // Delete task
  function deleteTask(taskId) {
    const newTasks = state.tasks.filter(task => task.id !== taskId);
    dispatch({ type: DELETE_TASK, payload: newTasks });
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  }

  // Clear app state and local storage
  function clearAll() {
    dispatch({ type: CLEAR_ALL, payload: [] });
    localStorage.clear();
  }

  return (
    <TasksContext.Provider
      value={{
        tasks: state.tasks,
        addTask,
        deleteTask,
        setTaskPriority,
        setTasks,
        getTaskList,
        clearAll,
        editTask,
        setDone
      }}
    >
      {props.children}
    </TasksContext.Provider>
  );
};

export default TasksState;
