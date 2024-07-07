'use client'
import { useState } from 'react';

export default function CreateWorkspaceModal({ isOpen, onClose, onCreate }) {
    const [workspaceName, setWorkspaceName] = useState('');
    const [collaborators, setCollaborators] = useState([]);
    const [viewers, setViewers] = useState([]);
    const [collaboratorSearchTerm, setCollaboratorSearchTerm] = useState('');
    const [viewerSearchTerm, setViewerSearchTerm] = useState('');
    const [users, setUsers] = useState([
        'User A', 'User B', 'User C', 'User D', 'User E', // Dummy users
    ]);
    const [showWarning, setShowWarning] = useState(false);
    const [collaboratorWarning, setCollaboratorWarning] = useState(false);
    const [viewerWarning, setViewerWarning] = useState(false);

    const handleCreate = () => {
        if (workspaceName.trim() === '') {
            setShowWarning(true);
            return;
        }

        if (collaboratorSearchTerm) {
            setCollaboratorWarning(true);
            return;
        }

        if (viewerSearchTerm) {
            setViewerWarning(true);
            return;
        }

        const invalidCollaborators = collaborators.filter(c => !users.includes(c));
        const invalidViewers = viewers.filter(v => !users.includes(v));

        if (invalidCollaborators.length > 0) {
            setCollaboratorWarning(true);
            return;
        }

        if (invalidViewers.length > 0) {
            setViewerWarning(true);
            return;
        }

        const newWorkspace = {
            name: workspaceName,
            collaborators,
            viewers,
        };
        onCreate(newWorkspace);

        // Reset the fields
        setWorkspaceName('');
        setCollaborators([]);
        setViewers([]);
        setCollaboratorSearchTerm('');
        setViewerSearchTerm('');
        setShowWarning(false);
        setCollaboratorWarning(false);
        setViewerWarning(false);

        onClose();
    };

    const handleAddCollaborator = (user) => {
        if (!collaborators.includes(user)) {
            setCollaborators([...collaborators, user]);
            setCollaboratorSearchTerm('');
        }
        

    };

    const handleAddViewer = (user) => {
        if (!viewers.includes(user)) {
            setViewers([...viewers, user]);
            setViewerSearchTerm('');
        }

    };

    const filteredCollaborators = users.filter(user =>
        user.toLowerCase().includes(collaboratorSearchTerm.toLowerCase())
    );

    const filteredViewers = users.filter(user =>
        user.toLowerCase().includes(viewerSearchTerm.toLowerCase())
    );

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
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Add Collaborators"
                        value={collaboratorSearchTerm}
                        onChange={(e) => {
                            setCollaboratorSearchTerm(e.target.value);
                            setCollaboratorWarning(false);
                        }}
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                    {collaboratorSearchTerm && (
                        <div className="border border-gray-300 rounded mt-2 p-2 max-h-32 overflow-y-auto">
                            {filteredCollaborators.map((user, index) => (
                                <div key={index} onClick={() => handleAddCollaborator(user)} className="cursor-pointer p-2 hover:bg-gray-100">
                                    {user}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-2">
                        {collaborators.map((collaborator, index) => (
                            <span key={index} className="mr-2 p-1 bg-blue-100 rounded">
                                {collaborator}
                            </span>
                        ))}
                    </div>
                    {collaboratorWarning && (
                        <p className="text-red-500 text-sm mt-2">Some collaborators are invalid.</p>
                    )}
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Add Viewers"
                        value={viewerSearchTerm}
                        onChange={(e) => {
                            setViewerSearchTerm(e.target.value);
                            setViewerWarning(false);
                        }}
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                    {viewerSearchTerm && (
                        <div className="border border-gray-300 rounded mt-2 p-2 max-h-32 overflow-y-auto">
                            {filteredViewers.map((user, index) => (
                                <div key={index} onClick={() => handleAddViewer(user)} className="cursor-pointer p-2 hover:bg-gray-100">
                                    {user}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-2">
                        {viewers.map((viewer, index) => (
                            <span key={index} className="mr-2 p-1 bg-green-100 rounded">
                                {viewer}
                            </span>
                        ))}
                    </div>
                    {viewerWarning && (
                        <p className="text-red-500 text-sm mt-2">Some viewers are invalid.</p>
                    )}
                </div>
                <div className="flex justify-end">
                    <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded">Cancel</button>
                    <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
                </div>
            </div>
        </div>
    ) : null;
}

CreateWorkspaceModal.displayName = 'CreateWorkspaceModal';
