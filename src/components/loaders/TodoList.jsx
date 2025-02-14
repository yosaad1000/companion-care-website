import React, { useState, useEffect } from "react";
import { Trash2, Check, Plus } from "lucide-react";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(storedTodos);
  }, []);

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const newTask = { id: Date.now(), text: newTodo.trim(), completed: false };
    localStorage.setItem("todos", JSON.stringify([...todos, newTask]));
    setTodos([...todos, newTask]);
  };

  const toggleTodo = (id) => {
    localStorage.setItem(
      "todos",
      JSON.stringify(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      )
    );

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    localStorage.setItem(
      "todos",
      JSON.stringify(todos.filter((todo) => todo.id !== id))
    );
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="max-w-md mx-auto scrollable-hidden p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Todo List</h2>
        <span className="text-sm text-gray-500">{todos.length} tasks</span>
      </div>

      <form onSubmit={addTodo} className="mt-3 flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <Plus size={16} />
        </button>
      </form>

      <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                  todo.completed
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300 hover:border-blue-500"
                }`}
              >
                {todo.completed && <Check size={14} className="text-white" />}
              </button>
              <span
                className={`text-sm ${
                  todo.completed
                    ? "line-through text-gray-500"
                    : "text-gray-800"
                }`}
              >
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="p-1 text-gray-500 hover:text-red-500 transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
