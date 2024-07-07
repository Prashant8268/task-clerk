import React, { useState, useEffect, useRef } from 'react';

const AddCollaboratorsModal = ({ newCollaboratorsModalOpen, toggleNewCollaboratorsModal }) => {
    const [collaboratorSearch, setCollaboratorSearch] = useState('');
    const [collaborators, setCollaborators] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        if (collaboratorSearch.trim() !== '') {
            // Simulated search results
            const results = [
                { id: 1, name: 'John Doe' },
                { id: 2, name: 'Jane Smith' },
                { id: 3, name: 'Michael Johnson' },
                { id: 4, name: 'Emma Brown' },
            ].filter(user =>
                user.name.toLowerCase().includes(collaboratorSearch.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [collaboratorSearch]);

    const handleAddCollaborator = (user) => {
        if (!collaborators.some(collab => collab === user.name)) {
            setCollaborators([...collaborators, user.name]);
            setShowDuplicateWarning(false);
        } else {
            setShowDuplicateWarning(true);
        }
        setCollaboratorSearch('');
        setSearchResults([]);
    };

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            toggleNewCollaboratorsModal();
        }
    };

    useEffect(() => {
        if (newCollaboratorsModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [newCollaboratorsModalOpen]);

    return (
        <div className={`fixed z-10 inset-0 overflow-y-auto ${newCollaboratorsModalOpen ? '' : 'hidden'}`}>
            <div className="flex items-center justify-center min-h-screen">
                <div ref={modalRef} className="bg-white rounded-lg p-6 shadow-lg relative">
                    <button
                        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
                        onClick={toggleNewCollaboratorsModal}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-xl mb-4">Add New Collaborators</h2>
                    {showDuplicateWarning && (
                        <p className="text-red-500 mb-2">This collaborator is already added.</p>
                    )}
                    <div className="flex space-x-2 mb-2">
                        {collaborators.map((collaborator, index) => (
                            <span key={index} className="bg-blue-200 text-blue-800 py-1 px-2 rounded-full">
                                {collaborator}
                            </span>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={collaboratorSearch}
                        onChange={(e) => setCollaboratorSearch(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md w-full mb-4"
                        placeholder="Search Collaborators"
                    />
                    <div className="mt-2">
                        {searchResults.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-2 bg-gray-100 mb-2 rounded-md">
                                <span>{user.name}</span>
                                <button
                                    onClick={() => handleAddCollaborator(user)}
                                    className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 focus:outline-none"
                                >
                                    Add
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={toggleNewCollaboratorsModal}
                        className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCollaboratorsModal;
