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
    <div className=" min-h-screen mt-10 flex-col items-center justify-center p-10 shadow-lg">
      <h1 className="text-4xl font-bold mb-4">Welcome to your To-Do List</h1>
      <div className="max-w-sm mx-auto  p-5 bg-white ">


        {/* Add Task Input */}
        <div className="flex gap-2">
          <input
            type="text"
            className="border p-2 w-full rounded-lg"
            placeholder="Add a task..."
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
          <button onClick={handleAddTask} className="bg-blue-500 text-white rounded-lg px-4 py-2">Add</button>
        </div>

        {/* Task List */}
        <div className="max-w-full mx-auto mt-10 shadow-lg bg-white  rounded-lg">
          <h3 className="text-sm font-bold mb-4 p-2 bg-blue-400 shadow-lg rounded-lg ">Add | Update | Delete</h3>
          <ul className="mt-4">
            {data.tasks.map((task) => (
              <li key={task.id} className="flex justify-between items-center  p-2 mt-2 rounded">
                
                
                {/* Buttons */}
                <div className="flex gap-2">
                  {/* Complete Checkbox */}
                  {editingTask === task.id ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="border p-1"
                  />
                ) : (
                  <span className={task.completed ? "line-through text-gray-500 bg-blue-200 p-2" : ""}>
                    {task.title}
                  </span>
                )}
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task.id, task.completed)}
                  />
                  
                


                  {/* Edit & Save Buttons */}
                  {editingTask === task.id ? (
                    <button onClick={() => handleSaveEdit(task.id)} ><img src="../pencil.png" /></button>
                  ) : (
                    <button onClick={() => handleEdit(task)} ><img src="../pencil.png" /></button>
                  )}

                  {/* Delete Button */}
                  <button onClick={() => handleDeleteTask(task.id)}><img src="../delete.png" /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
