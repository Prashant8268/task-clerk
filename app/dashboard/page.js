'use client'
import { useState ,useEffect} from 'react';
import Link from 'next/link';
import CreateWorkspaceModal from '../(components)/CreateWorkspace';
import { FaEllipsisV } from 'react-icons/fa';
import axios from 'axios';
import LoadingSpinner from '../(components)/Spinner';

export default function Dashboard1() {
    const [workspaces, setWorkspaces] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

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

    const handleCreateWorkspace = async (newWorkspace) => {
        try {
            setIsLoading(true);
            const response = await axios.post('/api/create-workspace', {
                workspace:JSON.stringify(newWorkspace.name)
            });
            setIsLoading(false);
            setWorkspaces([...workspaces, response.data.workspace]);
        } catch (error) {
            console.error('Error creating workspace:', error);
        }
    }

    const [selectedWorkspace, setSelectedWorkspace] = useState(null);

    const handleToggleOptions = (index) => {
        setSelectedWorkspace(selectedWorkspace === index ? null : index);
    };

    return (
        <div className="p-6 min-h-screen overflow-scroll">
            {isLoading? <LoadingSpinner /> : null}
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
                        {workspaces.length>0 && workspaces.map((workspace) => (
                            <tr key={workspace._id} className="hover:bg-gray-50 cursor-pointer">
                                <td className="py-2 px-4 border-b text-left">
                                    <Link href={`/dashboard/${workspace._id}`}>
                                        {workspace.name}
                                    </Link>
                                </td>
                                <td className="py-2 px-4 border-b text-left">
                                    <Link href={`/dashboard/${workspace._id}`}>
                                        {workspace.admin.name}
                                    </Link>
                                </td>
                                <td className="py-2 px-4 border-b text-left">
                                    <Link href={`/dashboard/${workspace._id}`}>
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
