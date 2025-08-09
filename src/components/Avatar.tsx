import React from 'react';

interface AvatarProps {
    avatar: string;
    name: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-2xl',
};

const Avatar: React.FC<AvatarProps> = ({ avatar, name, size = 'md', className }) => {
    const isImageData = avatar?.startsWith('data:image');

    if (isImageData) {
        return (
            <img
                src={avatar}
                alt={`${name}'s avatar`}
                className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
            />
        );
    }

    // Fallback to initials
    const initial = name ? name.charAt(0).toUpperCase() : '?';

    return (
        <div
            className={`${sizeClasses[size]} rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
            aria-label={`${name}'s avatar`}
        >
            {initial}
        </div>
    );
};

export default Avatar;
