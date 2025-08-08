

import React, { useState, useEffect } from 'react';
import { StudyTask } from '../../../types';
import { useNotification } from '../../../context/NotificationContext';
import { useAuth } from '../../../context/AuthContext';

const API_URL = 'http://localhost:5000/api/edu';

interface PlannerTabProps {
    conversationId: string;
}

const PlannerTab: React.FC<PlannerTabProps> = ({ conversationId }) => {
    const [tasks, setTasks] = useState<StudyTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const { addNotification } = useNotification();
    const token = localStorage.getItem('whisspra_token');

    const fetchTasks = async () => {
        try {
            const res = await fetch(`${API_URL}/tasks/${conversationId}`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('Failed to fetch tasks.');
            const data = await res.json();
            setTasks(data);
        } catch (err: any) { addNotification(err.message, 'error'); }
        finally { setIsLoading(false); }
    };

    useEffect(() => {
        fetchTasks();
    }, [conversationId]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle || !newTaskDueDate) return;
        try {
            const res = await fetch(`${API_URL}/tasks/${conversationId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title: newTaskTitle, dueDate: newTaskDueDate })
            });
            if (!res.ok) throw new Error('Failed to add task.');
            const newTask = await res.json();
            setTasks(prev => [...prev, newTask]);
            setNewTaskTitle('');
            setNewTaskDueDate('');
        } catch (err: any) { addNotification(err.message, 'error'); }
    };

    const handleToggleComplete = async (task: StudyTask) => {
        try {
            const res = await fetch(`${API_URL}/tasks/${task._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ isCompleted: !task.isCompleted })
            });
            if (!res.ok) throw new Error('Failed to update task.');
            setTasks(prev => prev.map(t => t._id === task._id ? { ...t, isCompleted: !t.isCompleted } : t));
        } catch (err: any) { addNotification(err.message, 'error'); }
    };
    
    if (isLoading) return <p>Loading tasks...</p>;

    return (
        <div className="space-y-4">
            <form onSubmit={handleAddTask} className="flex gap-2">
                <input type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="New task..." className="flex-1 bg-slate-700 p-2 rounded-md" />
                <input type="date" value={newTaskDueDate} onChange={e => setNewTaskDueDate(e.target.value)} className="bg-slate-700 p-2 rounded-md" />
                <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 font-semibold px-4 rounded-md">Add</button>
            </form>
            <div className="space-y-2">
                {tasks.map(task => (
                    <div key={task._id} className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-md">
                        <input type="checkbox" checked={task.isCompleted} onChange={() => handleToggleComplete(task)} className="h-5 w-5 rounded text-indigo-500 bg-slate-600 border-slate-500 focus:ring-indigo-500" />
                        <div className="flex-1">
                            <p className={`${task.isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>{task.title}</p>
                            <p className="text-xs text-slate-400">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlannerTab;