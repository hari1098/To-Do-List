import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trash2, Plus, Pencil, X, Check } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import type { Todo } from './types';

function App() {
  // Load todos from localStorage on initial render
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem('my-todos');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Error loading todos:', err);
      return [];
    }
  });

  const [newTask, setNewTask] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Save todos to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('my-todos', JSON.stringify(todos));
    } catch (err) {
      console.error('Error saving todos:', err);
    }
  }, [todos]);

  // Handle form submission for new todo
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedTask = newTask.trim();
    if (!trimmedTask) {
      toast.error('Please enter a task');
      return;
    }

    // Create new todo
    const newTodo: Todo = {
      id: Date.now().toString(),
      title: trimmedTask,
      completed: false,
      created_at: new Date().toISOString()
    };

    setTodos(currentTodos => [newTodo, ...currentTodos]);
    setNewTask('');
    toast.success('Task added!');
  };

  // Task editing functions
  const handleEditStart = (todo: Todo) => {
    setEditId(todo.id);
    setEditValue(todo.title);
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditValue('');
  };

  const handleEditSave = (id: string) => {
    const trimmedValue = editValue.trim();
    if (!trimmedValue) {
      toast.error('Task cannot be empty');
      return;
    }

    setTodos(currentTodos => 
      currentTodos.map(todo => 
        todo.id === id 
          ? { ...todo, title: trimmedValue }
          : todo
      )
    );
    
    setEditId(null);
    setEditValue('');
    toast.success('Task updated!');
  };

  // Toggle todo completion
  const handleToggle = (id: string) => {
    setTodos(currentTodos => 
      currentTodos.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  // Delete todo
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      toast.success('Task deleted!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h1 className="text-2xl font-bold text-white">My Tasks</h1>
            <p className="text-blue-100 mt-1">Stay organized, get things done</p>
          </div>

          {/* Add Task Form */}
          <form onSubmit={handleSubmit} className="p-6 border-b border-gray-100">
            <div className="flex gap-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                         transition-colors duration-200 flex items-center gap-2"
              >
                <Plus size={20} />
                Add
              </button>
            </div>
          </form>

          {/* Todo List */}
          <div className="divide-y divide-gray-100">
            {todos.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No tasks yet. Add one above to get started!</p>
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  <button
                    onClick={() => handleToggle(todo.id)}
                    className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="text-green-500" size={24} />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>

                  {editId === todo.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 px-3 py-1 border rounded 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleEditSave(todo.id)}
                        className="text-green-600 hover:text-green-700 transition-colors duration-200"
                        title="Save changes"
                      >
                        <Check size={20} />
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        title="Cancel editing"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`flex-1 ${
                          todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
                        }`}
                      >
                        {todo.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditStart(todo)}
                          className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          title="Edit task"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(todo.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                          title="Delete task"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;