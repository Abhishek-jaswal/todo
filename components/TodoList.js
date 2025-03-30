"use client"; // Ensure this runs on the client

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TASKS, ADD_TASK, UPDATE_TASK, DELETE_TASK } from "../lib/graphqlQueries";

export default function TodoList() {
  const { loading, error, data, refetch } = useQuery(GET_TASKS);
  const [addTask] = useMutation(ADD_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [taskInput, setTaskInput] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  // 🔹 Add Task
  const handleAddTask = async () => {
    if (!taskInput.trim()) return;
    try {
      await addTask({ variables: { title: taskInput, completed: false } });
      setTaskInput("");
      refetch();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // 🔹 Toggle Task Completion
  const handleToggleComplete = async (id, completed) => {
    try {
      await updateTask({
        variables: { id: id.toString(), completed: !completed },
        update: (cache, { data: { update_tasks_by_pk } }) => {
          const existingTasks = cache.readQuery({ query: GET_TASKS });
  
          cache.writeQuery({
            query: GET_TASKS,
            data: {
              tasks: existingTasks.tasks.map((task) =>
                task.id === id ? { ...task, completed: !completed } : task
              ),
            },
          });
        },
      });
  
      refetch(); // Ensure UI updates
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  
  

  // 🔹 Delete Task
  const handleDeleteTask = async (id) => {
    try {
      await deleteTask({ variables: { id: id.toString() } }); // Convert id to string
      refetch();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  

  // 🔹 Enable Edit Mode
  const handleEdit = (task) => {
    setEditingTask(task.id);
    setEditedTitle(task.title);
  };

  // 🔹 Save Edited Task
  const handleSaveEdit = async (id) => {
    if (!editedTitle.trim()) return;
    try {
      await updateTask({ variables: { id, title: editedTitle } }); // Update only title
      setEditingTask(null);
      refetch();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading tasks</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg">
      <h1 className="text-xl font-bold mb-4">To-Do List</h1>

      {/* Add Task Input */}
      <div className="flex gap-2">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Add a task..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <button onClick={handleAddTask} className="bg-blue-500 text-white px-4 py-2">Add</button>
      </div>

      {/* Task List */}
      <ul className="mt-4">
        {data.tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center bg-gray-100 p-2 mt-2 rounded">
            {/* Task Title (Editable) */}
            {editingTask === task.id ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="border p-1"
              />
            ) : (
              <span className={task.completed ? "line-through text-gray-500" : ""}>
                {task.title}
              </span>
            )}

            {/* Buttons */}
            <div className="flex gap-2">
              {/* Complete Checkbox */}
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id, task.completed)}
              />

              {/* Edit & Save Buttons */}
              {editingTask === task.id ? (
                <button onClick={() => handleSaveEdit(task.id)} className="text-green-500">✔️</button>
              ) : (
                <button onClick={() => handleEdit(task)} className="text-yellow-500">✏️</button>
              )}

              {/* Delete Button */}
              <button onClick={() => handleDeleteTask(task.id)} className="text-red-500">🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
