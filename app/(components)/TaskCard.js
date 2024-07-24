import React, { useRef, useEffect, useState } from "react";
import { FiTrash, FiPlusCircle, FiXCircle } from "react-icons/fi";

const getRandomColor = () => {
  const colors = [
    "bg-red-100",
    "bg-green-100",
    "bg-blue-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const TaskCard = ({
  task,
  handleTaskNameEdit,
  handleTaskDescriptionEdit,
  handleTaskDeadlineEdit,
  handleDeleteCard,
  handleAddCard,
  handleDeleteTask,
  showOptions,
  isAllowed,
}) => {
  const cardRef = useRef(null);
  const [newCardText, setNewCardText] = useState("");
  const [cardColors, setCardColors] = useState([]);

  // Initialize card colors when task.cards changes
  useEffect(() => {
    if (task.cards.length > 0 && cardColors.length !== task.cards.length) {
      const colors = task.cards.map(() => getRandomColor());
      setCardColors(colors);
    }
  }, [task.cards, cardColors]);

  // Adjust card height dynamically when task description or number of cards change
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.height = "auto"; // Reset height before recalculating
      cardRef.current.style.height = `${cardRef.current.scrollHeight}px`;
    }
  }, [task.description, task.cards.length]);

  const handleAddNewCard = (taskId, cardText) => {
    if (!isAllowed) return;
    if (cardText.trim() !== "") {
      handleAddCard(taskId, cardText);
      setCardColors([...cardColors, getRandomColor()]);
      setNewCardText("");
    }
  };

  return (
    <div
      ref={cardRef}
      className="bg-white p-3 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
    >
      <div className="mb-3">
        <h2 className="text-md font-semibold">
          <input
            type="text"
            value={task.name}
            onChange={(e) => {
              if (!isAllowed) return;
              handleTaskNameEdit(task._id, e.target.value);
            }}
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </h2>
        {task.name.trim() === "" && (
          <p className="text-red-500 mt-1">Task name cannot be empty.</p>
        )}
      </div>
      <div className="mb-3">
        <p className="text-gray-600 text-sm">
          Deadline:{" "}
          <input
            type="date"
            value={task.deadline ? task.deadline.split("T")[0] : ""}
            onChange={(e) => {
              if (!isAllowed) return;
              handleTaskDeadlineEdit(task._id, e.target.value);
            }}
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </p>
      </div>
      <div className="mb-3">
        <p className="text-gray-600 text-sm">Description:</p>
        <textarea
          value={task.description}
          onChange={(e) => {
            if (!isAllowed) return;
            handleTaskDescriptionEdit(task._id, e.target.value);
          }}
          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          style={{ minHeight: "40px", resize: "vertical" }}
          placeholder="Enter task description..."
        />
      </div>
      <div className="overflow-y-auto max-h-36 mt-3">
        <ul>
          {task.cards.map((card, index) => (
            <li
              key={index}
              className={`flex items-center justify-between mb-2 px-2 py-1 rounded-md ${cardColors[index]}`}
            >
              <span>{card.text}</span>
              <FiXCircle
                className="text-gray-500 cursor-pointer hover:text-red-500"
                onClick={() => {
                  if (!isAllowed) return;
                  handleDeleteCard(task._id, card._id);
                }}
                size={16}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3">
        <input
          type="text"
          value={newCardText}
          onChange={(e) => {
            if (!isAllowed) return;
            setNewCardText(e.target.value);
          }}
          placeholder="Add a card..."
          className="w-full py-1 px-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        {task.newCardTextError && (
          <p className="text-red-500 mt-1 text-sm">{task.newCardTextError}</p>
        )}
        <button
          onClick={() => {
            if (!isAllowed) return;
            handleAddNewCard(task._id, newCardText);
          }}
          className="mt-2 py-1 px-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none flex items-center justify-center text-sm"
        >
          <FiPlusCircle size={16} className="mr-1" /> Add Card
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between text-gray-500 cursor-pointer">
        <button
          onClick={() => {
            if (!isAllowed) return;
            handleDeleteTask(task._id);
          }}
          className="text-red-500 hover:text-red-700 focus:outline-none flex items-center text-sm"
        >
          <FiTrash size={16} className="mr-1" /> Delete Task
        </button>
      </div>
    </div>
  );
};

export default TaskCard;

TaskCard.displayName = "Task Card";
