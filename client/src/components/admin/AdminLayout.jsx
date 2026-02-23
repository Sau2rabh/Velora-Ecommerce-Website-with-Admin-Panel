import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && !user.isAdmin) {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user || !user.isAdmin) {
        return null; 
    }

    return (
        <div className="flex bg-gray-50 dark:bg-zinc-900 min-h-screen font-['Inter'] transition-colors duration-300">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-zinc-900 p-6 lg:p-10 pt-20 lg:pt-10 transition-colors duration-300">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
