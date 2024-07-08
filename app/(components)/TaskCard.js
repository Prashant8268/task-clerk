import React, { useRef, useEffect } from 'react';

const TaskCard = ({
    task,
    handleTaskNameEdit,
    handleTaskDescriptionEdit,
    handleTaskDeadlineEdit,
    handleDeleteCard,
    handleAddCard,
    handleDeleteTask,
    showOptions,
    setTasks,
}) => {
    const cardRef = useRef(null);
    useEffect(() => {
        // Adjust height of the card dynamically based on its content
        if (cardRef.current) {
            cardRef.current.style.height = `${cardRef.current.scrollHeight}px`;
        }
    }, [task.description, task.cards]);

    return (
        <div ref={cardRef} className="bg-white p-4 rounded-lg shadow-md overflow-hidden">
            <div className="mb-2">
                <h2 className="text-lg font-semibold">
                    <input
                        type="text"
                        value={task.name}
                        onChange={(e) => handleTaskNameEdit(task._id, e.target.value)}
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
                        value={task.deadline.split('T')[0]}
                        onChange={(e) => handleTaskDeadlineEdit(task._id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                    />
                </p>
            </div>
            <div className="mb-2">
                <p className="text-gray-600">
                    Description:
                </p>
                <textarea
                    value={task.description}
                    onChange={(e) => handleTaskDescriptionEdit(task._id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                    style={{ minHeight: '50px', resize: 'vertical' }}
                    placeholder="Enter task description..."
                />
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
                                onClick={() => handleDeleteCard(task._id, index)}
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
                        
                    }}
                    placeholder="Add a card..."
                    className="w-full py-1 px-2 border border-gray-300 rounded-md focus:outline-none"
                />
                {task.newCardTextError && <p className="text-red-500 mt-1">{task.newCardTextError}</p>}
                <button
                    onClick={() => handleAddCard(task._id)}
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
                    onClick={() => showOptions(task._id)}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
                <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                >
                    Delete Task
                </button>
            </div>
        </div>
    );
};

export default TaskCard;

TaskCard.displayName = 'Task Card';
