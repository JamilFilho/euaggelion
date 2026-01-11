'use client';

import { useState, useEffect, useRef } from 'react';
import { usePinch, useDrag } from '@use-gesture/react';
import Image from 'next/image';

interface LightboxWrapperProps {
  children: React.ReactNode;
  src: string;
  alt?: string;
}

export default function LightboxWrapper({ children, src, alt }: LightboxWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  // Reset zoom and position when opening
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Pinch to zoom
  usePinch(
    ({ event, offset: [d] }) => {
      event.preventDefault();
      setScale(Math.max(0.5, Math.min(3, d)));
    },
    {
      target: imageRef,
      eventOptions: { passive: false, capture: true },
      scaleBounds: { min: 0.5, max: 3 },
      from: () => [scale, 0],
      enabled: isOpen,
    }
  );

  // Drag to move when zoomed
  useDrag(
    ({ event, offset: [x, y] }) => {
      event.preventDefault();
      if (scale > 1) {
        setPosition({ x, y });
      }
    },
    {
      target: imageRef,
      eventOptions: { passive: false, capture: true },
      from: () => [position.x, position.y],
      enabled: isOpen && scale > 1,
    }
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <div onClick={() => setIsOpen(true)} style={{ cursor: 'pointer' }}>
        {children}
      </div>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: scale > 1 ? 'grab' : 'pointer',
            animation: 'fadeIn 0.3s ease-out',
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            ref={imageRef}
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: 'center center',
              transition: scale === 1 ? 'transform 0.3s ease-out' : 'none',
              cursor: scale > 1 ? 'grab' : 'default',
              maxWidth: '90vw',
              maxHeight: '90vh',
              touchAction: 'none', // Previne zoom do navegador
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt || ''}
              width={1200}
              height={630}
              className="w-full h-auto max-w-full max-h-full object-contain"
              priority={true}
              style={{
                animation: 'zoomIn 0.3s ease-out',
              }}
            />
          </div>
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '20px',
              zIndex: 10000,
            }}
            aria-label="Fechar lightbox"
          >
            ×
          </button>
        </div>
      )}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}