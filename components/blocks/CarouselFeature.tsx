import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { TinaTemplate } from '@tinacms/cli';
import { Container } from './Container';
import { Actions } from './Actions';
import GradGlow from '../../public/svg/grad-glow.svg';
import { tinaField } from 'tinacms/dist/react';
import { sanitizeLabel } from './Actions';
import { FaClock, FaUnlock, FaCodeBranch, FaCloudDownloadAlt, FaPuzzlePiece, FaMarkdown, FaGithub, FaFileAlt } from 'react-icons/fa';

const icons = {
  FaClock,
  FaUnlock,
  FaCodeBranch,
  FaCloudDownloadAlt,
  FaPuzzlePiece,
  FaMarkdown,
  FaGithub,
  FaFileAlt,
};

const CarouselItem = ({ data, index, id, isHovered, onMouseEnter, onMouseLeave, isSmallOrMediumScreen, renderMedia }) => {
  const { headline, text, actions, icon, videoSrc } = data;

  const commonStyles = 'transition duration-500 hover:scale-105 hover:z-20';
  const nonHoveredStyles = 'pl-4';

  const Icon = icons[icon];

  return (
    <div
      className={`${isHovered && !isSmallOrMediumScreen ? 'group block bg-gradient-to-br from-white/25 via-white/50 to-white/75 shadow-[inset_0_0_0_1px_rgba(223,219,252,0.15),_0_0_1px_1px_rgba(223,219,252,0.5)] pl-4 pr-8 md:py-9 md:pr-11 lg:py-12 lg:pr-14 rounded-2xl' : nonHoveredStyles} ${commonStyles}`}
      onMouseEnter={!isSmallOrMediumScreen ? onMouseEnter : null}
      onMouseLeave={!isSmallOrMediumScreen ? onMouseLeave : null}
      style={{ textDecoration: 'none', overflow: 'visible' }}
    >
      <div data-tina-field={tinaField(data, 'headline')} className="flex flex-col">
        <div className='block lg:hidden pb-5'>
          {renderMedia(index)}
        </div>
        <div className="flex items-center mb-2">
          {Icon && (
            <Icon className={`text-xl md:text-3xl ${isHovered && !isSmallOrMediumScreen ? 'text-orange-500/90' : ''}`} />
          )}
          {headline && (
            <h3 className={`text-xl md:text-3xl font-tuner leading-tight pl-8 ${isHovered && !isSmallOrMediumScreen ? 'text-transparent bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 bg-clip-text' : ''}`}>
              {headline}
            </h3>
          )}
        </div>
        {((!isSmallOrMediumScreen && isHovered && text) || (isSmallOrMediumScreen && text)) && (
          <p className='md:pl-12 md:ml-4 text-lg font-medium'>{text}</p>
        )}
        {((!isSmallOrMediumScreen && isHovered && actions) || (isSmallOrMediumScreen && actions)) && (
          <div className="md:pl-11">
            <Actions items={actions} />
          </div>
        )}
      </div>
    </div>
  );
};

export function CarouselFeatureBlock({ data, index }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isSmallOrMediumScreen, setIsSmallOrMediumScreen] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const mediaQueryLarge = window.matchMedia('(min-width: 1024px)');
    const mediaQuerySmallOrMedium = window.matchMedia('(max-width: 1023px)');
    
    setIsLargeScreen(mediaQueryLarge.matches);
    setIsSmallOrMediumScreen(mediaQuerySmallOrMedium.matches);

    const handleMediaChange = (e) => {
      setIsLargeScreen(mediaQueryLarge.matches);
      setIsSmallOrMediumScreen(mediaQuerySmallOrMedium.matches);
      if (!e.matches) {
        clearInterval(intervalRef.current);
        setHoveredIndex(null);
      } else if (mediaQueryLarge.matches) {
        intervalRef.current = setInterval(() => {
          setHoveredIndex((prevIndex) => {
            if (prevIndex === null || prevIndex === data.items.length - 1) {
              return 0;
            }
            return prevIndex + 1;
          });
        }, 3000);
      }
    };

    mediaQueryLarge.addEventListener('change', handleMediaChange);
    mediaQuerySmallOrMedium.addEventListener('change', handleMediaChange);

    return () => {
      mediaQueryLarge.removeEventListener('change', handleMediaChange);
      mediaQuerySmallOrMedium.removeEventListener('change', handleMediaChange);
    };
  }, [data.items.length]);

  useEffect(() => {
    if (!isPaused && isLargeScreen) {
      intervalRef.current = setInterval(() => {
        setHoveredIndex((prevIndex) => {
          if (prevIndex === null || prevIndex === data.items.length - 1) {
            return 0;
          }
          return prevIndex + 1;
        });
      }, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused, isLargeScreen, data.items.length]);

  const handleMouseEnter = (index) => {
    setIsPaused(true);
    setHoveredIndex(index);
    clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const renderMedia = (index) => {
    if (index === null) return null;

    const item = data.items[index];
    if (!item.videoSrc) return null;

    const cloudinaryBaseUrl = 'https://res.cloudinary.com/forestry-demo/video/upload/q_80,h_584/e_accelerate:-20/';
    const fullVideoUrl = `${cloudinaryBaseUrl}${item.videoSrc}`;

    return (
      <video key={index} autoPlay muted loop className="w-full h-auto mt-6 lg:mt-0" poster={`https://res.cloudinary.com/forestry-demo/video/upload/so_0/${item.videoSrc}.jpg`}>
        <source src={`${fullVideoUrl}.webm`} type="video/webm" />
        <source src={`${fullVideoUrl}.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  };

  return (
    <section key={'feature-grid-' + index} className={'relative z-0 py-20 lg:py-28'} style={{ overflow: 'visible' }}>
      <Container width="wide">
        <div className="flex flex-col lg:flex-row gap-6 w-full rounded-xl overflow-visible">
          <div className="flex flex-col order-2 lg:order-1 w-full lg:w-2/5 gap-4 auto-rows-auto rounded-xl overflow-visible"> 
            <h1 
              className={`pl-3 font-tuner inline-block text-4xl lg:text-5xl lg:leading-tight bg-gradient-to-br from-blue-600/80 via-blue-800/80 to-blue-1000 bg-clip-text text-transparent text-balance text-left mt-10 pb-3`}>
              Key Features
            </h1>
            {data.items &&
              data.items.map((item, index) => (
                <div 
                  key={Object.values(item).join('')}
                  className="pt-4">
                  <CarouselItem
                    data={item}
                    index={index}
                    id={sanitizeLabel(item.headline)}
                    isHovered={hoveredIndex === index}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    isSmallOrMediumScreen={isSmallOrMediumScreen}
                    renderMedia={renderMedia}
                  />
                </div>
              ))}
          </div>
          <div className="hidden lg:block flex flex-col order-1 lg:order-2 w-full lg:w-3/5 gap-4 auto-rows-auto rounded-xl overflow-visible bg-gray-200 mt-10 lg:mt-0">
            <h2 
              className={`text-center pl-9 font-tuner inline-block text-4xl lg:text-4xl lg:leading-tight bg-gradient-to-br from-red-600/80 via-red-800/80 to-red-1000 bg-clip-text text-transparent text-balance mt-20 lg:mt-10`}>
              Media
            </h2>
            {renderMedia(hoveredIndex)}
          </div>
        </div>
      </Container>
      <GradGlow className="absolute w-full h-auto bottom-0 left-0 -z-1" />
    </section>
  );
}
