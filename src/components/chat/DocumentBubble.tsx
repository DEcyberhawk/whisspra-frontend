import React from 'react';

interface DocumentBubbleProps {
    fileUrl: string;
    fileName: string;
    fileSize: number; // in bytes
    isOwnMessage: boolean;
}

const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};


const DocumentIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);


const DocumentBubble: React.FC<DocumentBubbleProps> = ({ fileUrl, fileName, fileSize, isOwnMessage }) => {
    
    const textColor = isOwnMessage ? 'text-white' : 'text-slate-800 dark:text-gray-200';
    const iconColor = isOwnMessage ? 'text-indigo-200' : 'text-indigo-400';
    const metaColor = isOwnMessage ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400';

    return (
        <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center space-x-3 w-64 cursor-pointer"
            download={fileName}
            title={`Download ${fileName}`}
        >
            <div className={iconColor}>
                <DocumentIcon />
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${textColor}`}>{fileName}</p>
                <p className={`text-xs ${metaColor}`}>{formatBytes(fileSize)}</p>
            </div>
        </a>
    );
};

export default DocumentBubble;
