import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { useSettings, AppSettings } from '../../context/SettingsContext';
import { useNotification } from '../../context/NotificationContext';

const API_URL = 'http://localhost:5000/api';

const SettingsPage: React.FC = () => {
    const { settings, refetchSettings, loading: settingsLoading } = useSettings();
    const { addNotification } = useNotification();
    
    const [formData, setFormData] = useState<Partial<AppSettings>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (settings) {
            setFormData(settings);
            setLogoPreview(settings.logoUrl);
        }
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        
        try {
            const token = localStorage.getItem('whisspra_token');
            const res = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: uploadFormData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Logo upload failed.');
            
            const serverUrl = 'http://localhost:5000';
            const fullUrl = `${serverUrl}${data.url}`;
            setFormData({ ...formData, logoUrl: fullUrl });
            setLogoPreview(fullUrl);
            addNotification('Logo uploaded. Save changes to apply.', 'info');
        } catch (err: any) {
            addNotification(err.message, 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const token = localStorage.getItem('whisspra_token');
            const res = await fetch(`${API_URL}/admin/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('Failed to save settings.');
            
            await refetchSettings();
            addNotification('Settings saved successfully!', 'success');
        } catch (err: any) {
            addNotification(err.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Application Settings</h1>

            {settingsLoading ? <p>Loading settings...</p> : (
                <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
                    {/* Branding Section */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-semibold mb-4">Branding</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Logo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                                        {logoPreview ? <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" /> : <span className="text-slate-500">?</span>}
                                    </div>
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-sm font-semibold py-2 px-4 rounded-lg">Change Logo</button>
                                    <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/png, image/jpeg, image/svg+xml" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="primaryColor" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Primary Color</label>
                                    <input type="color" id="primaryColor" name="primaryColor" value={formData.primaryColor || ''} onChange={handleChange} className="w-full h-12 p-1 bg-transparent border-2 border-slate-600 rounded-lg cursor-pointer" />
                                </div>
                                <div>
                                     <label htmlFor="accentColor" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Accent Color</label>
                                    <input type="color" id="accentColor" name="accentColor" value={formData.accentColor || ''} onChange={handleChange} className="w-full h-12 p-1 bg-transparent border-2 border-slate-600 rounded-lg cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Info Section */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                         <h2 className="text-xl font-semibold mb-4">Company & Founder Information</h2>
                         <div className="space-y-4">
                             <div>
                                <label htmlFor="companyName" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Company Name</label>
                                <input type="text" id="companyName" name="companyName" placeholder="Company Name" value={formData.companyName || ''} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-md border border-slate-300 dark:border-slate-600" />
                             </div>
                             <div>
                                <label htmlFor="aboutUs" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">About Us</label>
                                <textarea id="aboutUs" name="aboutUs" placeholder="About the company..." value={formData.aboutUs || ''} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-md border border-slate-300 dark:border-slate-600" rows={4}></textarea>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                     <label htmlFor="founderName" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Founder Name</label>
                                    <input type="text" id="founderName" name="founderName" placeholder="Founder's Name" value={formData.founderName || ''} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-md border border-slate-300 dark:border-slate-600" />
                                 </div>
                                  <div>
                                     <label htmlFor="founderContact" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Founder Contact</label>
                                    <input type="text" id="founderContact" name="founderContact" placeholder="Founder's Contact Info" value={formData.founderContact || ''} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-md border border-slate-300 dark:border-slate-600" />
                                 </div>
                             </div>
                             <div>
                                 <label htmlFor="founderInfo" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">About the Founder</label>
                                <textarea id="founderInfo" name="founderInfo" placeholder="About the founder..." value={formData.founderInfo || ''} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-md border border-slate-300 dark:border-slate-600" rows={3}></textarea>
                             </div>
                         </div>
                    </div>

                    {/* Contact Info Section */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                         <h2 className="text-xl font-semibold mb-4">Public Contact Information</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <input type="email" name="contactEmail" placeholder="Contact Email" value={formData.contactEmail || ''} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-md border border-slate-300 dark:border-slate-600" />
                             <input type="tel" name="contactPhone" placeholder="Contact Phone" value={formData.contactPhone || ''} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-md border border-slate-300 dark:border-slate-600" />
                            <textarea name="address" placeholder="Address" value={formData.address || ''} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-md border border-slate-300 dark:border-slate-600 md:col-span-2" rows={3}></textarea>
                         </div>
                    </div>
                    
                    <div className="flex justify-end">
                        <button type="submit" disabled={isSaving} className="bg-[var(--color-primary)] hover:brightness-90 text-white font-semibold py-2 px-6 rounded-lg transition-all disabled:opacity-50">
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            )}
        </DashboardLayout>
    );
};

export default SettingsPage;