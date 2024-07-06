// TaskModal.js
'use client'
import React, { useState } from 'react';

const TaskModal = ({ isOpen, onClose, onAddTask }) => {
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDeadline, setNewTaskDeadline] = useState('');

    const handleAddTask = () => {
        if (newTaskName.trim() !== '') {
            onAddTask(newTaskName, newTaskDeadline);
            setNewTaskName('');
            setNewTaskDeadline('');
            onClose();
        } else {
            alert('Task name cannot be empty. Please enter a name for the task.');
        }
    };

    return (
        <>
            {isOpen && (
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
                                onClick={handleAddTask}
                                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
                            >
                                Add Task
                            </button>
                            <button
                                onClick={onClose}
                                className="ml-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TaskModal;
