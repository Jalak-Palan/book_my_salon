import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import hairBanner from '../../assets/banners/hair.png';
import spaBanner from '../../assets/banners/spa.png';
import makeupBanner from '../../assets/banners/makeup.png';
import nailsBanner from '../../assets/banners/nails.png';
import massageBanner from '../../assets/banners/massage.png';

const banners = [
    { id: 1, image: hairBanner, link: '/offers/hair', alt: 'Premium Haircut & Styling' },
    { id: 2, image: spaBanner, link: '/offers/spa', alt: 'Relaxing Spa Retreat' },
    { id: 3, image: makeupBanner, link: '/offers/makeup', alt: 'Bridal Makeup Packages' },
    { id: 4, image: nailsBanner, link: '/offers/nails', alt: 'Nail Art & Extensions' },
    { id: 5, image: massageBanner, link: '/offers/massage', alt: 'Ayurvedic Massage Therapy' },
];

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play interval
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 4000);
        return () => clearInterval(timer);
    }, [currentIndex]); // Depend on currentIndex so it resets the timer on manual navigation

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const getSlideStyle = (index) => {
        const diff = (index - currentIndex + banners.length) % banners.length;
        
        let translateOffset = '0%';
        let scale = 1;
        let opacity = 1;
        let zIndex = 20;

        if (diff === 0) {
            // Center active slide
            translateOffset = '0%';
            scale = 1;
            opacity = 1;
            zIndex = 20;
        } else if (diff === 1) {
            // Right adjacent slide
            translateOffset = '85%'; 
            scale = 0.9;
            opacity = 0.5;
            zIndex = 10;
        } else if (diff === banners.length - 1) {
            // Left adjacent slide
            translateOffset = '-85%'; 
            scale = 0.9;
            opacity = 0.5;
            zIndex = 10;
        } else {
            // Hidden slides
            translateOffset = diff > 1 && diff < banners.length / 2 ? '150%' : '-150%';
            scale = 0.8;
            opacity = 0;
            zIndex = 0;
            // hide visibility for offscreen elements to prevent layout issues
        }

        return {
            left: '50%',
            transform: `translateX(calc(-50% + ${translateOffset})) scale(${scale})`,
            opacity,
            zIndex,
            transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
            visibility: opacity === 0 ? 'hidden' : 'visible'
        };
    };

    return (
        <div className="relative w-full overflow-hidden bg-white pt-6 pb-12 group select-none">
            <div className="max-w-[1600px] mx-auto relative h-[160px] sm:h-[280px] md:h-[400px] lg:h-[450px]">
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className="absolute top-0 w-[85%] sm:w-[75%] lg:w-[70%] h-full rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                        style={getSlideStyle(index)}
                        onClick={() => {
                            if (index !== currentIndex) {
                                setCurrentIndex(index);
                            } else {
                                // Simulate click on banner
                                console.log('Clicked banner:', banner.link);
                            }
                        }}
                    >
                        <img 
                            src={banner.image} 
                            alt={banner.alt} 
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button 
                onClick={prevSlide}
                className="absolute left-2 sm:left-6 lg:left-12 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-30"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 mr-1" />
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-2 sm:right-6 lg:right-12 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-30"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 ml-1" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`transition-all duration-300 rounded-full shadow-sm ${
                            currentIndex === index 
                            ? 'w-8 h-2.5 bg-primary' 
                            : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
