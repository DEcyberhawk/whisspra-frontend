

import React, { useState, useRef, useEffect } from 'react';
import { User } from '../../types';
import Avatar from '../Avatar';

interface UserTableProps {
    users: User[];
    onRoleChange: (userId: string, role: 'user' | 'creator' | 'admin') => void;
}

const RoleDropdown: React.FC<{ user: User, onRoleChange: (userId: string, role: 'user' | 'creator' | 'admin') => void }> = ({ user, onRoleChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const roles: ('user' | 'creator' | 'admin')[] = ['user', 'creator', 'admin'];
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelectRole = (role: 'user' | 'creator' | 'admin') => {
        if (user.role !== role) {
            onRoleChange(user.id, role);
        }
        setIsOpen(false);
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-slate-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {user.role}
                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        {roles.map(role => (
                            <a
                                href="#"
                                key={role}
                                onClick={(e) => { e.preventDefault(); handleSelectRole(role); }}
                                className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 capitalize"
                                role="menuitem"
                            >
                                {role}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const UserTable: React.FC<UserTableProps> = ({ users, onRoleChange }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Joined</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                        <Avatar avatar={user.avatar} name={user.name} size="sm" />
                                        <div>
                                            <div className="font-semibold">{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.email || 'Anonymous'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                        user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                        user.role === 'creator' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                        'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                    <RoleDropdown user={user} onRoleChange={onRoleChange} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;