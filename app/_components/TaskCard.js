// TaskCard.js
'use client'
import React from 'react';

const TaskCard = ({ card, onDeleteCard }) => {
    const handleDelete = () => {
        onDeleteCard(card.id);
    };

    return (
        <li className="flex items-center justify-between mb-2">
            <span>{card.text}</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={handleDelete}
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </li>
    );
};

export default TaskCard;
