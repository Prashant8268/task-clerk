"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import LoadingSpinner from "./Spinner";
import PopupNotification from "./PopupNotification";

const AddCollaboratorsModal = ({
  newCollaboratorsModalOpen,
  toggleNewCollaboratorsModal,
  allUsers,
  params,
  isAllowed
}) => {
  const [collaboratorSearch, setCollaboratorSearch] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const modalRef = useRef(null);
  const workspaceId = params.id;

  const fetchUsersAndCollaborators = useCallback(async () => {
    try {
      setLoading(true);
      const collaboratorsResponse = await axios.post("/api/get-collaborators", {
        workspaceId,
      });
      setCollaborators(collaboratorsResponse.data.collaborators);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setCollaborators([]);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchUsersAndCollaborators();
  }, [fetchUsersAndCollaborators]);

  const searchResults = useMemo(() => {
    if (collaboratorSearch.trim() !== "") {
      return allUsers.filter((user) =>
        user.toLowerCase().includes(collaboratorSearch.toLowerCase())
      );
    } else {
      return [];
    }
  }, [collaboratorSearch, allUsers]);

  const handleAddCollaborator = useCallback(
    async (user) => {
      if(!isAllowed) return ;
      if (!collaborators.some((collab) => collab === user)) {
        const currentUrl = window.location.href;
        setLoading(true);
        setShowNotification(false);
        const response = await axios.post("/api/add-collaborator", {
          user,
          url: currentUrl,
        });
        setNotificationMessage(response.data.message);
        if (!response.exist) {
          setCollaborators((prevCollaborators) => [...prevCollaborators, user]);
        }
        setShowNotification(true);
        setShowDuplicateWarning(false);
        setLoading(false);
      } else {
        setShowDuplicateWarning(true);
      }
      // setCollaboratorSearch('');
    },
    [collaborators]
  );

  const handleClickOutside = useCallback(
    (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        toggleNewCollaboratorsModal();
      }
    },
    [toggleNewCollaboratorsModal]
  );

  useEffect(() => {
    if (newCollaboratorsModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [newCollaboratorsModalOpen, handleClickOutside]);

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto ${
        newCollaboratorsModalOpen ? "" : "hidden"
      }`}
    >
      {loading ? <LoadingSpinner /> : null}
      {showNotification && <PopupNotification message={notificationMessage} />}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          ref={modalRef}
          className="bg-white rounded-lg p-6 shadow-lg relative w-full max-w-lg"
        >
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={toggleNewCollaboratorsModal}
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
          <h2 className="text-xl font-bold mb-4 text-center">
            Add New Collaborators
          </h2>
          {showDuplicateWarning && (
            <p className="text-red-500 mb-2 text-center">
              This collaborator is already added.
            </p>
          )}
          <div className="flex flex-wrap space-x-2 mb-2">
            {collaborators.map((collaborator, index) => (
              <span
                key={index}
                className="bg-blue-200 text-blue-800 py-1 px-2 rounded-full"
              >
                {collaborator}
              </span>
            ))}
          </div>
          <input
            type="text"
            value={collaboratorSearch}
            onChange={(e) => {
              setShowDuplicateWarning(false);
              setCollaboratorSearch(e.target.value);
            }}
            className="border border-gray-300 p-2 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search Collaborators"
          />
          <div className="mt-2">
            {searchResults.map((user) => (
              <div
                key={user}
                className="flex items-center justify-between p-2 bg-gray-100 mb-2 rounded-md"
              >
                <span>{user}</span>
                <button
                  onClick={() => handleAddCollaborator(user)}
                  className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 focus:outline-none"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={toggleNewCollaboratorsModal}
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
AddCollaboratorsModal.displayName = "Add Collaborator";
export default AddCollaboratorsModal;
