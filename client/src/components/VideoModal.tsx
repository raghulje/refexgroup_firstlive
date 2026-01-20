import React, { useEffect } from 'react';
import Modal from 'react-modal';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl: string;
}

// Set the app element for accessibility (important for screen readers)
if (typeof window !== 'undefined') {
    Modal.setAppElement('#root');
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl }) => {
    // Close modal on ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Add autoplay parameter to video URL if it's a YouTube/Vimeo embed
    const getVideoUrlWithAutoplay = (url: string) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`;
        }
        if (url.includes('vimeo.com')) {
            return url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`;
        }
        return url;
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="fixed inset-0 flex items-center justify-center p-4 z-50 outline-none"
            overlayClassName="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm z-50 animate-fadeIn"
            closeTimeoutMS={300}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
        >
            <div className="relative w-full max-w-5xl bg-black rounded-lg overflow-hidden shadow-2xl animate-fadeInUp">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all duration-300 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Close video"
                >
                    <i className="ri-close-line text-2xl"></i>
                </button>

                {/* Video Container */}
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    {/* 16:9 Aspect Ratio */}
                    <iframe
                        src={getVideoUrlWithAutoplay(videoUrl)}
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Video Player"
                    ></iframe>
                </div>

                {/* Optional: Video Title/Description */}
                <div className="p-4 bg-gray-900 text-white">
                    <p className="text-sm text-gray-300">
                        Press <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">ESC</kbd> or click outside to close
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default VideoModal;
