'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Dummy data for tasks (for initial rendering)
const dummyTasks = [
    { 
        id: 1, 
        name: 'Task 1', 
        description: 'Task description 1', 
        deadline: '2023-07-10', 
        priority: 'high', 
        status: 'done', 
        cards: [
            { id: 1, text: 'Card 1 for Task 1' },
            { id: 2, text: 'Card 2 for Task 1' },
        ], 
        workspaceId: 1,
        newCardText: '', // Added for task-specific new card text
        newCardTextError: '', // Added for task-specific new card text error
    },
    // Add other tasks similarly
];

const Workspace = ({params, currentUser}) => {
    const { id } = params;
    console.log(currentUser, 'current user'); 

    const [tasks, setTasks] = useState([]);
    const [editableTaskId, setEditableTaskId] = useState(null);
    const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDeadline, setNewTaskDeadline] = useState('');
    const [loading, setLoading] = useState(false);
    const [newTaskNameError, setNewTaskNameError] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            // Simulate fetching tasks from backend (replace with actual API endpoint)
            // Example API call: const response = await axios.get(`/api/tasks/${id}`);
            setTasks(dummyTasks);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
        }
    };

    const handleTaskNameEdit = async (taskId, newName) => {
        try {
            // Simulate updating task name on backend (replace with actual API endpoint)
            // Example API call: const response = await axios.put(`/api/tasks/${taskId}`, { name: newName });
            setTasks(tasks.map(task => task.id === taskId ? { ...task, name: newName } : task));
        } catch (error) {
            console.error('Error updating task name:', error);
        }
    };

    const handleTaskDeadlineEdit = async (taskId, newDeadline) => {
        try {
            // Simulate updating task deadline on backend (replace with actual API endpoint)
            // Example API call: const response = await axios.put(`/api/tasks/${taskId}`, { deadline: newDeadline });
            setTasks(tasks.map(task => task.id === taskId ? { ...task, deadline: newDeadline } : task));
        } catch (error) {
            console.error('Error updating task deadline:', error);
        }
    };

    const handleAddCard = async (taskId) => {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            const currentTask = tasks[taskIndex];
            const { newCardText } = currentTask;

            if (newCardText.trim() !== '') {
                try {
                    // Simulate adding a card to task on backend (replace with actual API endpoint)
                    // Example API call: const response = await axios.put(`/api/tasks/add-card/${taskId}`, { card: newCardText });
                    const updatedCards = [...currentTask.cards, { id: currentTask.cards.length + 1, text: newCardText }];
                    const updatedTask = { ...currentTask, cards: updatedCards, newCardText: '', newCardTextError: '' };
                    const updatedTasks = [...tasks];
                    updatedTasks[taskIndex] = updatedTask;
                    setTasks(updatedTasks);
                } catch (error) {
                    console.error('Error adding card:', error);
                }
            } else {
                const updatedTask = { ...currentTask, newCardTextError: 'Card text cannot be empty. Please enter some text.' };
                const updatedTasks = [...tasks];
                updatedTasks[taskIndex] = updatedTask;
                setTasks(updatedTasks);
            }
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            // Simulate deleting task on backend (replace with actual API endpoint)
            // Example API call: const response = await axios.delete(`/api/tasks/${taskId}`);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const toggleNewTaskModal = () => {
        setNewTaskModalOpen(!newTaskModalOpen);
    };

    const handleAddNewTask = async () => {
        if (newTaskName.trim() !== '' && newTaskDeadline.trim() !== '') {
            try {
                // Simulate adding new task on backend (replace with actual API endpoint)
                // Example API call: const response = await axios.post('/api/tasks', { name: newTaskName, deadline: newTaskDeadline, status: 'pending', cards: [], workspaceId: id });
                const newTask = {
                    id: tasks.length + 1,
                    name: newTaskName,
                    description: '',
                    deadline: newTaskDeadline,
                    priority: 'low',
                    status: 'pending',
                    cards: [],
                    workspaceId: id,
                    newCardText: '', // Added for task-specific new card text
                    newCardTextError: '', // Added for task-specific new card text error
                };
                setTasks([...tasks, newTask]);
                setNewTaskName('');
                setNewTaskDeadline('');
                setNewTaskModalOpen(false);
                setNewTaskNameError('');
            } catch (error) {
                console.error('Error adding new task:', error);
            }
        } else {
            setNewTaskNameError('Task name cannot be empty. Please enter a name.');
        }
    };

    const handleDeleteCard = async (taskId, cardIndex) => {
        try {
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                const currentTask = tasks[taskIndex];
                const updatedCards = currentTask.cards.filter((_, index) => index !== cardIndex);
                const updatedTask = { ...currentTask, cards: updatedCards };
                const updatedTasks = [...tasks];
                updatedTasks[taskIndex] = updatedTask;
                setTasks(updatedTasks);
            }
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };

    const showOptions = (taskId) => {
        console.log(`Options for task ${taskId}`);
    };

    return (
        <div className="p-2  h-screen overflow-scroll">
            <h1 className="text-2xl font-bold mb-6">Tasks for Workspace {id}</h1>
            <button
                onClick={toggleNewTaskModal}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none mb-4"
            >
                Add New Task
            </button>

            {newTaskModalOpen && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New Task</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Task Name</label>
                            <input
                                type="text"
                                value={newTaskName}
                                onChange={(e) => setNewTaskName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                            />
                            {newTaskNameError && <p className="text-red-500 mt-1">{newTaskNameError}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                            <input
                                type="date"
                                value={newTaskDeadline}
                                onChange={(e) => setNewTaskDeadline(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleAddNewTask}
                                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
                            >
                                Add Task
                            </button>
                            <button
                                onClick={toggleNewTaskModal}
                                className="ml-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                    <p>Loading...</p>
                ) : tasks.length === 0 ? (
                    <p>No tasks found.</p>
                ) : (
                    tasks.map(task => (
                        <div key={task.id} className="bg-white p-4 rounded-lg shadow-md">
                            <div className="mb-2">
                                <h2 className="text-lg font-semibold">
                                    <input
                                        type="text"
                                        value={task.name}
                                        onChange={(e) => handleTaskNameEdit(task.id, e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                    />
                                </h2>
                                {task.name.trim() === '' && <p className="text-red-500 mt-1">Task name cannot be empty.</p>}
                            </div>

                            <div className="mb-2">
                                <p className="text-gray-600">
                                    Deadline:{" "}
                                    <input
                                        type="date"
                                        value={task.deadline}
                                        onChange={(e) => handleTaskDeadlineEdit(task.id, e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                    />
                                </p>
                            </div>
                            <div className="overflow-y-auto max-h-48 mt-4">
                                <ul>
                                    {task.cards.map((card, index) => (
                                        <li key={index} className="flex items-center justify-between mb-2">
                                            <span>{card.text}</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-gray-500 cursor-pointer"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                onClick={() => handleDeleteCard(task.id, index)}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-4">
                                <input
                                    type="text"
                                    value={task.newCardText}
                                    onChange={(e) => {
                                        const updatedTask = { ...task, newCardText: e.target.value };
                                        const updatedTasks = [...tasks];
                                        updatedTasks[tasks.findIndex(t => t.id === task.id)] = updatedTask;
                                        setTasks(updatedTasks);
                                    }}
                                    placeholder="Add a card..."
                                    className="w-full py-1 px-2 border border-gray-300 rounded-md focus:outline-none"
                                />
                                {task.newCardTextError && <p className="text-red-500 mt-1">{task.newCardTextError}</p>}
                                <button
                                    onClick={() => handleAddCard(task.id)}
                                    className="mt-2 py-1 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                                >
                                    Add Card
                                </button>
                            </div>

                            <div className="mt-4 text-gray-500 cursor-pointer">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 inline-block align-middle"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    onClick={() => showOptions(task.id)}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                                <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                                >
                                    Delete Task
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Workspace;
