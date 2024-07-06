// Dashboard1.js
'use client'

import { useState } from 'react';
import Link from 'next/link';
import CreateWorkspaceModal from '../(components)/CreateWorkspace';

export default function Dashboard1() {
    console.log('hey there');

    // Dummy data for workspaces
    const [workspaces, setWorkspaces] = useState([
        { id: 1, name: 'Workspace 1', owner: 'User A', createdAt: '2023-01-01' },
        { id: 2, name: 'Workspace 2', owner: 'User B', createdAt: '2023-02-15' },
        { id: 3, name: 'Workspace 3', owner: 'User C', createdAt: '2023-03-20' },
        { id: 4, name: 'Workspace 4', owner: 'User D', createdAt: '2023-04-05' },
    ]);

    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleCreateWorkspace = (newWorkspace) => {
        setWorkspaces([...workspaces, { ...newWorkspace, id: workspaces.length + 1 }]);
    };

    return (
        <div className="p-6 min-h-screen overflow-scroll">
            <h1 className="text-2xl font-bold mb-6">Your Workspaces</h1>
            <button onClick={openModal} className="mb-6 px-4 py-2 bg-blue-600 text-white rounded">Create Workspace</button>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">ID</th>
                            <th className="py-2 px-4 border-b text-left">Name</th>
                            <th className="py-2 px-4 border-b text-left">Owner</th>
                            <th className="py-2 px-4 border-b text-left">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workspaces.map((workspace) => (
                            <tr key={workspace.id} className="hover:bg-gray-50 cursor-pointer">
                                <td className="py-2 px-4 border-b text-left">
                                    <Link href={`/dashboard/${workspace.id}`}>
                                        {workspace.id}
                                    </Link>
                                </td>
                                <td className="py-2 px-4 border-b text-left">
                                    <Link href={`/dashboard/${workspace.id}`}>
                                        {workspace.name}
                                    </Link>
                                </td>
                                <td className="py-2 px-4 border-b text-left">
                                    <Link href={`/dashboard/${workspace.id}`}>
                                        {workspace.owner}
                                    </Link>
                                </td>
                                <td className="py-2 px-4 border-b text-left">
                                    <Link href={`/dashboard/${workspace.id}`}>
                                        {workspace.createdAt}
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
