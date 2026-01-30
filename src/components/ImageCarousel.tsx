import { useState, useEffect, useCallback } from 'react';

interface ImageCarouselProps {
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  autoPlay?: boolean;
  interval?: number;
}

export default function ImageCarousel({
  images,
  autoPlay = false,
  interval = 5000,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning]);

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, images.length, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, images.length, goToSlide]);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  if (images.length === 0) return null;

  return (
    <div className="carousel" role="region" aria-label="Image carousel">
      <div className="carousel-container">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="carousel-slide">
              <img
                src={image.src}
                alt={image.alt}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              {image.caption && (
                <p className="carousel-caption">{image.caption}</p>
              )}
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              className="carousel-btn carousel-btn-prev"
              onClick={goToPrevious}
              aria-label="Previous slide"
              disabled={isTransitioning}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              className="carousel-btn carousel-btn-next"
              onClick={goToNext}
              aria-label="Next slide"
              disabled={isTransitioning}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <div className="carousel-dots" role="tablist">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-selected={index === currentIndex}
                  role="tab"
                />
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        .carousel {
          position: relative;
          width: 100%;
          margin: var(--space-xl) 0;
        }

        .carousel-container {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          background-color: var(--color-surface);
        }

        .carousel-track {
          display: flex;
          transition: transform 0.4s ease;
        }

        .carousel-slide {
          flex: 0 0 100%;
          min-width: 100%;
        }

        .carousel-slide img {
          width: 100%;
          height: auto;
          display: block;
        }

        .carousel-caption {
          padding: var(--space-md);
          text-align: center;
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          margin: 0;
        }

        .carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.9);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 2;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .carousel-btn:hover {
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .carousel-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .carousel-btn svg {
          width: 20px;
          height: 20px;
        }

        .carousel-btn-prev {
          left: var(--space-md);
        }

        .carousel-btn-next {
          right: var(--space-md);
        }

        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: var(--space-sm);
          padding: var(--space-md);
        }

        .carousel-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background-color: var(--color-border);
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0;
        }

        .carousel-dot:hover {
          background-color: var(--color-text-secondary);
        }

        .carousel-dot.active {
          background-color: var(--color-accent);
          width: 24px;
          border-radius: 4px;
        }

        @media (max-width: 767px) {
          .carousel-btn {
            width: 32px;
            height: 32px;
          }

          .carousel-btn svg {
            width: 16px;
            height: 16px;
          }

          .carousel-btn-prev {
            left: var(--space-sm);
          }

          .carousel-btn-next {
            right: var(--space-sm);
          }
        }
      `}</style>
    </div>
  );
}
