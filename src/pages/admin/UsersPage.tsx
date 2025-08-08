
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/admin/DashboardLayout';
import UserTable from '../../components/admin/UserTable';
import { User } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { API_URL } from '../../config';
import { getStorageItem } from '../../utils/storage';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addNotification } = useNotification();

    const fetchUsers = async () => {
        const token = await getStorageItem('whisspra_token');
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch users.');
            const data = await response.json();
            setUsers(data.data.map((u: any) => ({ ...u, id: u._id })));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId: string, role: 'user' | 'creator' | 'admin') => {
        const token = await getStorageItem('whisspra_token');
        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role })
            });
            if (!response.ok) throw new Error('Failed to update user role.');
            
            addNotification('User role updated successfully.', 'success');
            await fetchUsers(); // Refresh the user list
        } catch (err: any) {
            addNotification(err.message, 'error');
        }
    };

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">User Management</h1>
            {loading && <p className="text-center p-8">Loading users...</p>}
            {error && <p className="text-red-500 bg-red-500/10 p-4 rounded-lg">{error}</p>}
            {!loading && !error && (
                <UserTable users={users} onRoleChange={handleRoleChange} />
            )}
        </DashboardLayout>
    );
};

export default UsersPage;
