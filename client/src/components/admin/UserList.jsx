import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Trash2, UserCog, Mail } from 'lucide-react';
import ConfirmationModal from '../ConfirmationModal';

const UserList = () => {
    const { user: currentUser } = useAuth();
    const { showSuccess, showError } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${currentUser.token}` },
            };
            const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/users', config);
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            showError('Failed to fetch users');
            setLoading(false);
        }
    };

    const deleteHandler = (id) => {
        setModalConfig({
            isOpen: true,
            title: 'Delete User',
            message: 'Are you sure you want to delete this user? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${currentUser.token}` },
                    };
                    await axios.delete(`\${import.meta.env.VITE_API_URL}/api/users/${id}`, config);
                    showSuccess('User deleted successfully');
                    fetchUsers();
                } catch (error) {
                    console.error(error);
                    showError('Failed to delete user');
                }
            }
        });
    };

    const toggleAdmin = (user) => {
        setModalConfig({
            isOpen: true,
            title: 'Update User Role',
            message: `Are you sure you want to make ${user.name} ${user.isAdmin ? 'a regular user' : 'an admin'}?`,
            onConfirm: async () => {
                 try {
                    const config = {
                        headers: { Authorization: `Bearer ${currentUser.token}` },
                    };
                    await axios.put(`\${import.meta.env.VITE_API_URL}/api/users/${user._id}`, { isAdmin: !user.isAdmin }, config);
                    showSuccess(`User role updated to ${!user.isAdmin ? 'Admin' : 'Customer'}`);
                    fetchUsers();
                } catch (error) {
                    console.error(error);
                    showError('Failed to update user role');
                }
            }
        });
    }

    return (
        <div className="space-y-6">
            <ConfirmationModal 
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
            />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-['Outfit'] text-gray-900">Users</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage system users and permissions</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading users...</td></tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3 h-3 text-gray-400" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${user.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {user.isAdmin ? 'Admin' : 'Customer'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">

                                                <button 
                                                    onClick={() => deleteHandler(user._id)} 
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserList;
