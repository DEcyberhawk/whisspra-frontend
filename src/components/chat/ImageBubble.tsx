import React from 'react';

interface ImageBubbleProps {
    imageUrl: string;
}

const ImageBubble: React.FC<ImageBubbleProps> = ({ imageUrl }) => {
    return (
        <div className="max-w-xs cursor-pointer" onClick={() => window.open(imageUrl, '_blank')}>
            <img 
                src={imageUrl} 
                alt="Sent image" 
                className="rounded-lg object-cover"
            />
        </div>
    );
};

export default ImageBubble;
