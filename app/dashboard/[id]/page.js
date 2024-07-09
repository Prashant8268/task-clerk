'use client'
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import LoadingSpinner from '@/app/(components)/Spinner';
import AddCollaboratorsModal from '@/app/(components)/AddCollaboratorsModal';
import NewTaskModal from '@/app/(components)/NewTaskModal';
import TaskCard from '@/app/(components)/TaskCard';
import { useRouter } from 'next/navigation';
import AddViewerModal from '@/app/(components)/AddViewerModal';
import PopupNotification from '@/app/(components)/PopupNotification';

const Workspace = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const [allUsers, setAllUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [workspaceName, setWorkspaceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [newCollaboratorsModalOpen, setNewCollaboratorsModalOpen] = useState(false);
  const [newViewsModalOpen, setNewViewsModalOpen] = useState(false);
  const [showDeleteWorkspaceModal, setShowDeleteWorkspaceModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [socket, setSocket] = useState(null);
  const SOCKET_SERVER_URL = 'https://task-clerk-backend.onrender.com';
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);
    fetchUsers();

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
        setLoading(true);
        const usersResponse = await axios.get('/api/get-users');
        setAllUsers(usersResponse.data.allUsers);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching data:', error);
        setAllUsers([]);
    }
}, []); 


  
  useEffect(() => {
    if (!socket) return;
    const handleTaskUpdated = (updatedTask) => {
      setTasks((prevTasks) => prevTasks.map(task => task._id === updatedTask._id ? updatedTask : task));
    };

    const handleTaskDeleted = (deletedTaskId) => {
      setTasks((prevTasks) => prevTasks.filter(task => task._id !== deletedTaskId));
    };

    const handleTaskAdded = (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    };
// not working 
    const handleCardAdded = ({ taskId, newCard }) => {
      setTasks((prevTasks) =>
        prevTasks.map(task => {
          if (task._id === taskId) {
            return { ...task, cards: [...task.cards, newCard] };
          }
          return task;
        })
      );
    };

    const handleCardDeleted = ({ taskId, cardIndex }) => {
      setTasks((prevTasks) =>
        prevTasks.map(task => {
          if (task._id === taskId) {
            return { ...task, cards: task.cards.filter((_, index) => index !== cardIndex) };
          }
          return task;
        })
      );
    };

    socket.on('taskUpdated', handleTaskUpdated);
    socket.on('taskDeleted', handleTaskDeleted);
    socket.on('taskDescriptionUpdated',(updatedTask)=>{
        setTasks((prevTasks)=> prevTasks.map(task => task._id ===updatedTask._id? updatedTask: task ));
    })
    socket.on('taskAdded', handleTaskAdded);
    socket.on('workspaceDeleted',()=>{
      router.push('/dashboard');
      
    })
    socket.on('cardAdded', handleCardAdded);
    socket.on('cardDeleted', handleCardDeleted);

    return () => {
      socket.off('taskUpdated', handleTaskUpdated);
      socket.off('taskDeleted', handleTaskDeleted);
      socket.off('taskAdded', handleTaskAdded);
      socket.off('cardAdded', handleCardAdded);
      socket.off('cardDeleted', handleCardDeleted);
    };
  }, [socket]);

  // Fetch tasks on initial load
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/tasks/${id}`);
      setTasks(response.data.tasks);
      setWorkspaceName(response.data.workspaceName);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } 
  }, [id]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handlers for socket operations
  const handleTaskNameEdit = async(taskId, newName) => {
    try {
      socket.emit('editTask', { id: taskId, name: newName });
    } catch (error) {
      console.error('Error updating task name:', error);
    }
  };
// working 
  const handleTaskDescriptionEdit = async(taskId, newDescription) => {
    try {
      socket.emit('editTaskDescription', { id: taskId, description: newDescription });
    } catch (err) {
      console.error('Error in updating description:', err);
    }
  };

  const handleTaskDeadlineEdit = (taskId, newDeadline) => {
    try {
      socket.emit('editTaskDeadline', { id: taskId, deadline: newDeadline });
    } catch (error) {
      console.error('Error updating task deadline:', error);
    }
  };

  const handleAddCard = (taskId,newCardText) => {
    try {
      socket.emit('addCard', { taskId, newCardText});
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  const handleDeleteTask = (taskId) => {
    try {
      socket.emit('deleteTask', { id: taskId });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

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
    try {
      socket.emit('addTask', newTask);
      setNewTaskDescription('');
      setNewTaskName('');
      setNewTaskDeadline('');
      setNewTaskModalOpen(false);
    } catch (error) {
      console.error('Error adding new task:', error);
    }
  };

  const handleDeleteCard = (taskId, cardId) => {
    try {
      socket.emit('deleteCard', { taskId, cardId });
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const toggleNewTaskModal = () => setNewTaskModalOpen(!newTaskModalOpen);
  const toggleNewCollaboratorsModal = () => setNewCollaboratorsModalOpen(!newCollaboratorsModalOpen);
  const toggleNewViewsModal = () => setNewViewsModalOpen(!newViewsModalOpen);
  const toggleDeleteWorkspaceModal = () => setShowDeleteWorkspaceModal(!showDeleteWorkspaceModal);

  const handleDeleteWorkspace = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/delete-workspace`, { id: id });
      setShowDeleteWorkspaceModal(false);
      socket.emit("deleteWorkspace", { workspaceId: id });
    
    } catch (error) {
        console.error('Error deleting workspace:', error);
    }
};

  return (
    <div className="p-2 h-screen md:h-[87vh] overflow-scroll">
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
          Add Viewer
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
        allUsers={allUsers}
        params = {params}
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
      <AddViewerModal
        newViewsModalOpen={newViewsModalOpen}
        toggleNewViewsModal={toggleNewViewsModal}
        allUsers={allUsers}
        params={params}
      />

      <div className="flex flex-wrap flex-shrink -mx-2">
            {tasks.map((task) => (
            <div key={task._id} className="w-full md:w-1/2 lg:w-1/3 p-2">
                <TaskCard task={task}
                    handleTaskNameEdit={handleTaskNameEdit}
                    handleTaskDescriptionEdit = {handleTaskDescriptionEdit}
                    handleTaskDeadlineEdit = {handleTaskDeadlineEdit}
                    handleDeleteCard = {handleDeleteCard}
                    handleAddCard= {handleAddCard}
                    handleDeleteTask= {handleDeleteTask}
                    setTasks = {setTasks}
                />
            </div>
            ))}
        </div>
    </div>
  );
};

export default Workspace;
