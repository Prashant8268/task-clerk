import React, { useState, useEffect, useRef } from 'react';

const AddViewsModal = ({ newViewsModalOpen, toggleNewViewsModal }) => {
    const [viewSearch, setViewSearch] = useState('');
    const [views, setViews] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
    const modalRef = useRef(null);

    // Simulated fetch of views based on viewSearch (replace with actual API call)
    useEffect(() => {
        if (viewSearch.trim() !== '') {
            // Simulated search results
            const results = [
                { id: 1, name: 'Dashboard' },
                { id: 2, name: 'Analytics' },
                { id: 3, name: 'Tasks' },
                { id: 4, name: 'Calendar' },
            ].filter(view =>
                view.name.toLowerCase().includes(viewSearch.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [viewSearch]);

    const handleAddView = (view) => {
        if (!views.some(v => v === view.name)) {
            setViews([...views, view.name]);
            setShowDuplicateWarning(false);
        } else {
            setShowDuplicateWarning(true);
        }
        setViewSearch('');
        setSearchResults([]);
    };

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            toggleNewViewsModal();
        }
    };

    useEffect(() => {
        if (newViewsModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [newViewsModalOpen]);

    return (
        <div className={`fixed z-10 inset-0 overflow-y-auto ${newViewsModalOpen ? '' : 'hidden'}`}>
            <div className="flex items-center justify-center min-h-screen">
                <div ref={modalRef} className="bg-white rounded-lg p-6 shadow-lg relative">
                    <button
                        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
                        onClick={toggleNewViewsModal}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-xl mb-4">Add New Views</h2>
                    {showDuplicateWarning && (
                        <p className="text-red-500 mb-2">This view is already added.</p>
                    )}
                    <div className="flex space-x-2 mb-2">
                        {views.map((view, index) => (
                            <span key={index} className="bg-blue-200 text-blue-800 py-1 px-2 rounded-full">
                                {view}
                            </span>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={viewSearch}
                        onChange={(e) => setViewSearch(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md w-full mb-4"
                        placeholder="Search Views"
                    />
                    <div className="mt-2">
                        {searchResults.map(view => (
                            <div key={view.id} className="flex items-center justify-between p-2 bg-gray-100 mb-2 rounded-md">
                                <span>{view.name}</span>
                                <button
                                    onClick={() => handleAddView(view)}
                                    className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 focus:outline-none"
                                >
                                    Add
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={toggleNewViewsModal}
                        className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddViewsModal;
