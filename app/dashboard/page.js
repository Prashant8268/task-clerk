'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import CreateWorkspaceModal from '../(components)/CreateWorkspace';
import axios from 'axios';
import LoadingSpinner from '../(components)/Spinner';
import PopupNotification from '../(components)/PopupNotification';

export default function Dashboard1() {
    const [workspaces, setWorkspaces] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('/api/workspaces');
                setIsLoading(false);
                setWorkspaces(response.data.workspaces);
            } catch (error) {
                console.error('Error fetching workspaces:', error);
            }
        };
        fetchWorkspaces();
    }, []);

    const handleCreateWorkspace = useCallback(async (newWorkspace) => {
        try {
            setIsLoading(true);
            setShowNotification(false);
            const response = await axios.post('/api/create-workspace', {
                workspace: JSON.stringify(newWorkspace.name)
            });
            setNotificationMessage(response.data.message);
            setShowNotification(true);
            setIsLoading(false);
            setWorkspaces(prevWorkspaces => [...prevWorkspaces, response.data.workspace]);
        } catch (error) {
            console.error('Error creating workspace:', error);
        }
    }, []);

    const memoizedWorkspaces = useMemo(() => {
        return workspaces.map(workspace => ({
            ...workspace,
            adminName: workspace.admin.name, 
            formattedDate: new Date(workspace.createdAt).toLocaleDateString(), 
        }));
    }, [workspaces]);

    return (
        <div className="p-6 h-screen md:h-[87vh] overflow-scroll">
            {showNotification && <PopupNotification message={notificationMessage} />}
            {isLoading ? <LoadingSpinner /> : null}
            <h1 className="text-2xl font-bold mb-6">Your Workspaces</h1>
            <button onClick={openModal} className="mb-6 px-4 py-2 bg-blue-600 text-white rounded">Create Workspace</button>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Name</th>
                            <th className="py-2 px-4 border-b text-left">Owner</th>
                            <th className="py-2 px-4 border-b text-left">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {memoizedWorkspaces.length > 0 && memoizedWorkspaces.map(workspace => (
                            <tr key={workspace._id} className="hover:bg-gray-50 cursor-pointer">
                                <td className="py-2 px-4 border-b text-left">
                                    <Link href={`/dashboard/${workspace._id}`}>
                                        {workspace.name}
                                    </Link>
                                </td>
                                <td className="py-2 px-4 border-b text-left">
                                    <Link href={`/dashboard/${workspace._id}`}>
                                        {workspace.adminName}
                                    </Link>
                                </td>
                                <td className="py-2 px-4 border-b text-left">
                                    <Link href={`/dashboard/${workspace._id}`}>
                                        {workspace.formattedDate}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CreateWorkspaceModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onCreate={handleCreateWorkspace}
            />
        </div>
    );
}
