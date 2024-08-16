import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import LoadingSpinner from "./Spinner";
import PopupNotification from "./PopupNotification";

const AddViewerModal = ({
  newViewsModalOpen,
  toggleNewViewsModal,
  params,
  allUsers,
  isAllowed
}) => {
  const [viewSearch, setViewSearch] = useState("");
  const [views, setViews] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const modalRef = useRef(null);
  const workspaceId = params.id;

  useEffect(() => {
    fetchUsersAndViewers();
  }, []);

  const fetchUsersAndViewers = useCallback(async () => {
    try {
      setLoading(true);
      const viewerResponse = await axios.post("/api/get-viewers", {
        workspaceId,
      });
      setViews(viewerResponse.data.viewers);
    } catch (error) {
      console.error("Error fetching data:", error);
      setViews([]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    if (viewSearch.trim() !== "") {
      const filteredResults = allUsers.filter((user) =>
        user.toLowerCase().includes(viewSearch.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [viewSearch, allUsers]);

  const handleAddView = useCallback(
    async (view) => {
        if(!isAllowed) return ; 
      if (!views.includes(view) ) {
        try {
          setLoading(true);
          setShowNotification(false);
          const response = await axios.post("/api/add-viewer", {
            userEmail: view,
            workspaceId,
          });
          setNotificationMessage(response.data.message);
          setShowNotification(true);
          setShowDuplicateWarning(false);
          setLoading(false);
          if (!response.data.exist) {
            setViews((prevViews) => [...prevViews, view]);
          }
        } catch (error) {
          console.error("Error adding view:", error);
        }
      } else {
        setShowDuplicateWarning(true);
      }
      // setViewSearch('');
    },
    [views, workspaceId,isAllowed]
  );

  const handleClickOutside = useCallback(
    (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        toggleNewViewsModal();
      }
    },
    [toggleNewViewsModal]
  );

  useEffect(() => {
    if (newViewsModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [newViewsModalOpen, handleClickOutside]);

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto ${
        newViewsModalOpen ? "" : "hidden"
      }`}
    >
      {loading && <LoadingSpinner />}
      {showNotification && <PopupNotification message={notificationMessage} />}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          ref={modalRef}
          className="bg-white rounded-lg p-6 shadow-lg relative w-full max-w-lg"
        >
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={toggleNewViewsModal}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="text-xl font-bold mb-4 text-center">Add New Viewer</h2>
          {showDuplicateWarning && (
            <p className="text-red-500 mb-2 text-center">
              This viewer is already added.
            </p>
          )}
          <div className="flex flex-wrap space-x-2 mb-2">
            {views.map((view, index) => (
              <span
                key={index}
                className="bg-blue-200 text-blue-800 py-1 px-2 rounded-full"
              >
                {view}
              </span>
            ))}
          </div>
          <input
            type="text"
            value={viewSearch}
            onChange={(e) => setViewSearch(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search Views"
          />
          <div className="mt-2 max-h-40 overflow-y-auto">
            {searchResults.map((view) => (
              <div
                key={view}
                className="flex items-center justify-between p-2 bg-gray-100 mb-2 rounded-md"
              >
                <span>{view}</span>
                <button
                  onClick={() => handleAddView(view)}
                  className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 focus:outline-none"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={toggleNewViewsModal}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddViewerModal;
