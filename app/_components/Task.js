// Task.js
'use client'
import React, { useState } from 'react';

const Task = ({ task, onEditTaskName, onEditTaskDeadline, onDeleteTask, onAddCard, onDeleteCard }) => {
    const [editableDeadline, setEditableDeadline] = useState(false);
    const [newCardText, setNewCardText] = useState('');

    const handleTaskNameChange = (e) => {
        onEditTaskName(task.id, e.target.value);
    };

    const handleDeadlineChange = (e) => {
        onEditTaskDeadline(task.id, e.target.value);
    };

    const toggleEditableDeadline = () => {
        setEditableDeadline(!editableDeadline);
    };

    const handleAddCard = () => {
        if (newCardText.trim() !== '') {
            onAddCard(task.id, newCardText);
            setNewCardText('');
        } else {
            alert('Card text cannot be empty. Please enter some text.');
        }
    };

    const handleDeleteCard = (index) => {
        onDeleteCard(task.id, index);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="mb-2">
                <h2 className="text-lg font-semibold">{task.name}</h2>
            </div>

            <div className="mb-2">
                <p className="text-gray-600">
                    Deadline: {editableDeadline ? (
                        <input
                            type="date"
                            value={task.deadline}
                            onChange={handleDeadlineChange}
                            onBlur={toggleEditableDeadline}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                        />
                    ) : (
                        <span>{task.deadline}</span>
                    )}
                    <button
                        onClick={toggleEditableDeadline}
                        className="text-blue-500 hover:text-blue-700 focus:outline-none ml-2"
                    >
                        {editableDeadline ? 'Save' : 'Edit Deadline'}
                    </button>
                </p>
            </div>

            {task.cards.length > 0 && (
                <p className={`text-sm font-semibold ${task.status === 'done' ? 'text-green-500' : 'text-red-500'}`}>
                    Status: {task.status}
                </p>
            )}

            {task.cards && (
                <div className="overflow-y-auto max-h-48 mt-4">
                    <ul>
                        {task.cards.map((card, index) => (
                            <li key={index} className="flex items-center justify-between mb-2">
                                <span>{card}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-500 cursor-pointer"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    onClick={() => handleDeleteCard(index)}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-4">
                <input
                    type="text"
                    value={newCardText}
                    onChange={(e) => setNewCardText(e.target.value)}
                    placeholder="Add a card..."
                    className="w-full py-1 px-2 border border-gray-300 rounded-md focus:outline-none"
                />
                <button
                    onClick={handleAddCard}
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
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
                <button
                    onClick={() => onDeleteTask(task.id)}
                    className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                >
                    Delete Task
                </button>
            </div>
        </div>
    );
};

export default Task;
