import { useState, useEffect, useCallback } from 'react';

interface LightboxProps {
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  initialIndex?: number;
  children?: React.ReactNode;
}

export default function Lightbox({
  images,
  initialIndex = 0,
  children,
}: LightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = '';
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeLightbox, goToPrevious, goToNext]);

  const currentImage = images[currentIndex];

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="lightbox-grid">
        {images.map((image, index) => (
          <button
            key={index}
            className="lightbox-thumbnail"
            onClick={() => openLightbox(index)}
            aria-label={`View ${image.alt}`}
          >
            <img src={image.src} alt={image.alt} loading="lazy" />
          </button>
        ))}
        {children}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {images.length > 1 && (
              <>
                <button
                  className="lightbox-nav lightbox-nav-prev"
                  onClick={goToPrevious}
                  aria-label="Previous image"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  className="lightbox-nav lightbox-nav-next"
                  onClick={goToNext}
                  aria-label="Next image"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </>
            )}

            <figure className="lightbox-figure">
              <img
                src={currentImage.src}
                alt={currentImage.alt}
                className="lightbox-image"
              />
              {currentImage.caption && (
                <figcaption className="lightbox-caption">
                  {currentImage.caption}
                </figcaption>
              )}
            </figure>

            {images.length > 1 && (
              <div className="lightbox-counter">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .lightbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--space-md);
          margin: var(--space-xl) 0;
        }

        .lightbox-thumbnail {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          border: none;
          padding: 0;
          cursor: pointer;
          background-color: var(--color-surface);
          border-radius: 8px;
          transition: transform 0.2s ease;
        }

        .lightbox-thumbnail:hover {
          transform: scale(1.02);
        }

        .lightbox-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .lightbox-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background-color: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-xl);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .lightbox-close {
          position: absolute;
          top: -40px;
          right: 0;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: var(--space-sm);
          opacity: 0.7;
          transition: opacity 0.2s ease;
          z-index: 1001;
        }

        .lightbox-close:hover {
          opacity: 1;
        }

        .lightbox-close svg {
          width: 24px;
          height: 24px;
        }

        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 1001;
        }

        .lightbox-nav:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .lightbox-nav svg {
          width: 24px;
          height: 24px;
        }

        .lightbox-nav-prev {
          left: -80px;
        }

        .lightbox-nav-next {
          right: -80px;
        }

        .lightbox-figure {
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .lightbox-image {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 4px;
        }

        .lightbox-caption {
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
          margin-top: var(--space-md);
          font-size: 0.9375rem;
        }

        .lightbox-counter {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
          margin-top: var(--space-md);
        }

        @media (max-width: 767px) {
          .lightbox-overlay {
            padding: var(--space-md);
          }

          .lightbox-nav {
            width: 40px;
            height: 40px;
          }

          .lightbox-nav-prev {
            left: var(--space-sm);
          }

          .lightbox-nav-next {
            right: var(--space-sm);
          }

          .lightbox-close {
            position: fixed;
            top: var(--space-md);
            right: var(--space-md);
          }

          .lightbox-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-sm);
          }
        }
      `}</style>
    </>
  );
}
