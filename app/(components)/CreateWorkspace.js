// CreateWorkspaceModal.js
'use client'

import { useState } from 'react';

export default function CreateWorkspaceModal({ isOpen, onClose, onCreate }) {
    const [workspaceName, setWorkspaceName] = useState('');
    const [owner, setOwner] = useState('');
    const [createdAt, setCreatedAt] = useState('');

    const handleCreate = () => {
        onCreate({ name: workspaceName, owner, createdAt });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Create Workspace</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Workspace Name</label>
                    <input
                        type="text"
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Owner</label>
                    <input
                        type="text"
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Created At</label>
                    <input
                        type="date"
                        value={createdAt}
                        onChange={(e) => setCreatedAt(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                </div>
                <div className="flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded mr-2">Cancel</button>
                    <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
                </div>
            </div>
        </div>
    );
}
