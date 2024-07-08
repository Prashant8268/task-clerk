'use client'
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import LoadingSpinner from '@/app/(components)/Spinner';
import AddCollaboratorsModal from '@/app/(components)/AddCollaboratorsModal';
import NewTaskModal from '@/app/(components)/NewTaskModal';
import AddViewsModal from '@/app/(components)/AddViewsModal';
import TaskCard from '@/app/(components)/TaskCard';

const Workspace = ({ params }) => {
  const { id } = params;
  const [tasks, setTasks] = useState([]);
  const [workspaceName, setWorkspaceName] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [newCollaboratorsModalOpen, setNewCollaboratorsModalOpen] = useState(false);
  const [newViewsModalOpen, setNewViewsModalOpen] = useState(false);
  const [showDeleteWorkspaceModal, setShowDeleteWorkspaceModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const SOCKET_SERVER_URL = 'https://task-clerk-backend.onrender.com';
  const socket = io(SOCKET_SERVER_URL);
  // Connect to the Socket.io server
  useEffect(() => {
    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prevTasks) => prevTasks.map(task => task._id === updatedTask._id ? updatedTask : task));
    });
    socket.on('taskDescriptionUpdated', (updatedTask)=>{
        setTasks((prevTasks)=> prevTasks.map(task => task._id ===updatedTask._id? updatedTask: task ));
    })
    socket.on('taskDeleted', (deletedTaskId) => {
      setTasks((prevTasks) => prevTasks.filter(task => task._id !== deletedTaskId));
    });

    socket.on('taskAdded', (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    });
    socket.on('cardAdded', ({ taskId, newCard }) => {
      setTasks((prevTasks) =>
        prevTasks.map(task => {
          if (task._id === taskId) {
            return { ...task, cards: [...task.cards, newCard] };
          }
          return task;
        })
      );
    });

    socket.on('cardDeleted', ({ taskId, cardIndex }) => {
      setTasks((prevTasks) =>
        prevTasks.map(task => {
          if (task._id === taskId) {
            return { ...task, cards: task.cards.filter((_, index) => index !== cardIndex) };
          }
          return task;
        })
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/tasks/${id}`);
      console.log('rtasks',response.data.tasks);
      setTasks(response.data.tasks);
      setWorkspaceName(response.data.workspaceName);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

// working 
  const handleTaskNameEdit = async (taskId, newName) => {
    try {
      socket.emit('editTask', { id: taskId, name: newName });

    } catch (error) {
      console.error('Error updating task name:', error);
    }
  };


  const handleTaskDescriptionEdit = async(taskId, newDescription ) =>{
    try{
        socket.emit('editTaskDescription',{id: taskId , description: newDescription});
    } catch(err){
        console.log('Error in updating description');
    }

  }

  const handleTaskDeadlineEdit = async (taskId, newDeadline) => {
    try {
      socket.emit('updateTask', { id: taskId, deadline: newDeadline });
    } catch (error) {
      console.error('Error updating task deadline:', error);
    }
  };

  const handleAddCard = async (taskId) => {
    try {
      const newCard = { id: Date.now(), text: 'New Card' };
      socket.emit('addCard', { taskId, newCard });
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

//   working 
  const handleDeleteTask = async (taskId) => {
    try {
      socket.emit('deleteTask', { id: taskId });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
// working 
  const handleAddNewTask = () => {
    const newTask = {
      name: newTaskName,
      description: newTaskDescription,
      deadline: newTaskDeadline,
      priority: 'low',
      status: 'pending',
      cards: [],
      workspaceId: id,
    };
    socket.emit('addTask', newTask,);
    setNewTaskDescription('');
    setNewTaskName('');
    setNewTaskDeadline('');
    setNewTaskModalOpen(false);
  };



  const handleDeleteCard = async (taskId, cardIndex) => {
    try {
      socket.emit('deleteCard', { taskId, cardIndex });
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const toggleNewTaskModal = () => setNewTaskModalOpen(!newTaskModalOpen);
  const toggleNewCollaboratorsModal = () => setNewCollaboratorsModalOpen(!newCollaboratorsModalOpen);
  const toggleNewViewsModal = () => setNewViewsModalOpen(!newViewsModalOpen);
  const toggleDeleteWorkspaceModal = () => setShowDeleteWorkspaceModal(!showDeleteWorkspaceModal);

//   
  const handleDeleteWorkspace = async () => {
    try {
      console.log('Workspace deleted successfully');
      // Optionally redirect or update UI after deletion
    } catch (error) {
      console.error('Error deleting workspace:', error);
    }
  };

  return (
    <div className="p-2 h-screen overflow-scroll">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        <span className="block text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          {workspaceName}
        </span>{' '}
        <span className="block text-center text-3xl font-bold text-gray-900">All Tasks</span>
      </h1>
      {loading && <LoadingSpinner />}
      <div className="flex flex-wrap space-y-2 md:space-y-0 md:space-x-4 mb-4">
        <button
          onClick={toggleNewTaskModal}
          className="w-full md:w-auto bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Add New Task
        </button>
        <button
          onClick={toggleNewCollaboratorsModal}
          className="w-full md:w-auto bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none mt-2 md:mt-0"
        >
          Add New Collaborators
        </button>
        <button
          onClick={toggleNewViewsModal}
          className="w-full md:w-auto bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none mt-2 md:mt-0"
        >
          New Views
        </button>
        <button
          onClick={toggleDeleteWorkspaceModal}
          className="w-full md:w-auto bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none mt-2 md:mt-0"
        >
          Delete Workspace
        </button>
        {showDeleteWorkspaceModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <p className="text-lg mb-4">Are you sure you want to delete this workspace?</p>
              <div className="flex justify-end">
                <button
                  onClick={toggleDeleteWorkspaceModal}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteWorkspace}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddCollaboratorsModal
        collaborators={[]}
        newCollaboratorsModalOpen={newCollaboratorsModalOpen}
        toggleNewCollaboratorsModal={toggleNewCollaboratorsModal}
      />
      <NewTaskModal
        newTaskModalOpen={newTaskModalOpen}
        toggleNewTaskModal={toggleNewTaskModal}
        newTaskName={newTaskName}
        setNewTaskName={setNewTaskName}
        newTaskDeadline={newTaskDeadline}
        setNewTaskDeadline={setNewTaskDeadline}
        handleAddNewTask={handleAddNewTask}
        newTaskDescription={newTaskDescription}
        setNewTaskDescription={setNewTaskDescription}
      />
      <AddViewsModal
        newViewsModalOpen={newViewsModalOpen}
        toggleNewViewsModal={toggleNewViewsModal}
      />

      <div className="flex flex-wrap -mx-2">
            {tasks.map((task) => (
            <div key={task._id} className="w-full md:w-1/2 lg:w-1/3 p-2">
                <TaskCard task={task}
                    handleTaskNameEdit={handleTaskNameEdit}
                    handleTaskDescriptionEdit = {handleTaskDescriptionEdit}
                    handleTaskDeadlineEdit = {handleTaskDeadlineEdit}
                    handleDeleteCard = {handleDeleteCard}
                    handleAddCard= {handleAddCard}
                    handleDeleteTask= {handleDeleteTask}
                    showOptions = {showOptions}
                    setTasks = {setTasks}
                />
            </div>
            ))}
        </div>
    </div>
  );
};

export default Workspace;
