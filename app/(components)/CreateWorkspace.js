'use client'
import { useState } from 'react';

export default function CreateWorkspaceModal({ isOpen, onClose, onCreate }) {
    const [workspaceName, setWorkspaceName] = useState('');
    const [showWarning, setShowWarning] = useState(false);

    const handleCreate = () => {
        if (workspaceName.trim() === '') {
            setShowWarning(true);
            return;
        }

        const newWorkspace = {
            name: workspaceName,
            collaborators:[],
            viewers:[],
        };
        onCreate(newWorkspace);
        setWorkspaceName('');
        setShowWarning(false);;

        onClose();
    };


    return isOpen ? (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Create Workspace</h2>
                <input
                    type="text"
                    placeholder="Workspace Name"
                    value={workspaceName}
                    onChange={(e) => {
                        setWorkspaceName(e.target.value);
                        if (e.target.value.trim() !== '') {
                            setShowWarning(false);
                        }
                    }}
                    className="mb-2 p-2 border border-gray-300 rounded w-full"
                />
                {showWarning && (
                    <p className="text-red-500 text-sm mb-4">Workspace name is required.</p>
                )}
                <div className="flex justify-end">
                    <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded">Cancel</button>
                    <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
                </div>
            </div>
        </div>
    ) : null;
}

CreateWorkspaceModal.displayName = 'CreateWorkspaceModal';
