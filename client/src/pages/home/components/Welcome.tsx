import { useState, useEffect } from 'react';
import firstImage from '../../../../public/Welcome.jpg';

interface WelcomeModalProps {
  imageUrl?: string;
}

export default function WelcomeModal({ imageUrl: propImageUrl }: WelcomeModalProps) {
  const [showModal, setShowModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Show modal on every home page refresh
    // Longer delay for smoother appearance
    const timer = setTimeout(() => {
      setShowModal(true);
      // Trigger animation after a brief moment
      setTimeout(() => {
        setIsAnimating(true);
      }, 50);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowModal(false);
    }, 400);
  };

  if (!showModal) return null;

  // Use prop image if provided, otherwise use default
  const imageToShow = propImageUrl || firstImage;
  const defaultImage = 'https://via.placeholder.com/800x600?text=Welcome+to+Refex+Industries';

  return (
    <>
      <style>{`
        .welcome-modal-backdrop {
          opacity: 0;
          transition: opacity 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: opacity;
          backface-visibility: hidden;
        }
        
        .welcome-modal-backdrop.animate {
          opacity: 1;
        }
        
        .welcome-modal-content {
          opacity: 0;
          transform: scale(0.85) translateY(20px);
          transition: opacity 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 100ms,
                      transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 100ms;
          will-change: opacity, transform;
          backface-visibility: hidden;
        }
        
        .welcome-modal-content.animate {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      `}</style>
      <div
        className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999] p-4 welcome-modal-backdrop ${isAnimating ? 'animate' : ''}`}
        onClick={handleClose}
      >
        <div
          className={`bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto relative welcome-modal-content ${isAnimating ? 'animate' : ''} shadow-2xl`}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all flex items-center justify-center w-10 h-10"
          aria-label="Close modal"
        >
          <i className="ri-close-line text-3xl font-bold"></i>
        </button>
        
          {/* Image */}
          <div className="p-4">
            <img
              src={imageToShow}
              alt="Welcome"
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultImage;
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}