import React, { useState } from 'react';
import VideoModal from './VideoModal';

interface VideoSectionProps {
    videoUrl?: string;
    title?: string;
    description?: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({
    videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Default placeholder
    title = 'Celebrating 23 years of Excellence',
    description = "Refex's journey of excellence began over two decades ago, built on a foundation of learning, resilience, and agility. From Refrigerant Gases to Ash Utilization & Coal Handling, Renewables, MedTech, Mobility, and Pharmaceuticals, we've continually expanded our horizons."
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <section className="py-15 bg-gray-50">
                <div className="container mx-auto px-4 md:px-8 lg:px-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                        {/* Video Trigger Icon */}
                        <div className="flex justify-center md:justify-end order-2 md:order-1">
                            <button
                                onClick={openModal}
                                className="group relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300"
                                aria-label="Play video"
                            >
                                {/* Play Icon */}
                                <div className="relative">
                                    <i className="ri-play-fill text-5xl md:text-6xl lg:text-7xl text-white group-hover:scale-110 transition-transform duration-300"></i>

                                    {/* Pulse Animation Ring */}
                                    <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-30 group-hover:animate-ping"></div>
                                </div>

                                {/* Decorative Ring */}
                                <div className="absolute inset-0 rounded-full border-4 border-white opacity-20"></div>
                            </button>
                        </div>

                        {/* Text Content */}
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                                {title}
                            </h2>
                            <p className="text-body md:text-body-lg text-gray-700 leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Modal */}
            <VideoModal
                isOpen={isModalOpen}
                onClose={closeModal}
                videoUrl={videoUrl}
            />
        </>
    );
};

export default VideoSection;
