import { useEffect, useRef } from 'react';
import { useStickContext } from '@/lib/context/StickyContext';

interface UseStickyOptions {
  topOffset?: number;
  onStick?: (isSticky: boolean) => void;
  id?: string;
}

export const useSticky = ({ topOffset = 0, onStick, id }: UseStickyOptions = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const isStuckyRef = useRef(false);
  const elementHeightRef = useRef(0);
  const initialTopRef = useRef<number | null>(null);
  const elementIdRef = useRef(id || `sticky-${Math.random().toString(36).substr(2, 9)}`);
  
  const { registerStickyElement, unregisterStickyElement, getStickyOffset } = useStickContext();

  useEffect(() => {
    const element = ref.current;
    const placeholder = placeholderRef.current;

    if (!element || !placeholder) return;

    const elementId = elementIdRef.current;

    const updatePlaceholderHeight = (height: number) => {
      placeholder.style.height = `${height}px`;
    };

    // Registrar altura inicial
    const height = element.offsetHeight;
    elementHeightRef.current = height;
    updatePlaceholderHeight(0);
    registerStickyElement(elementId, height);

    // Capture initial position once when element mounts
    const captureInitialPosition = () => {
      if (initialTopRef.current === null) {
        initialTopRef.current = placeholder.offsetTop;
      }
    };

    const handleScroll = () => {
      const currentHeight = element.offsetHeight;
      if (currentHeight !== elementHeightRef.current) {
        elementHeightRef.current = currentHeight;
        registerStickyElement(elementId, currentHeight);
        if (isStuckyRef.current) {
          updatePlaceholderHeight(currentHeight);
        }
      }

      // Capture position if not already captured
      captureInitialPosition();

      const currentOffset = getStickyOffset(elementId, topOffset);
      const scrollTop = window.scrollY;
      const initialTop = initialTopRef.current || 0;
      
      // Encontra o footer
      const footerElement = document.querySelector('footer');
      const footerTop = footerElement?.getBoundingClientRect().top ?? window.innerHeight + 1;

      // Should be sticky when scrolled past initial position
      const shouldBeSticky = scrollTop > initialTop - currentOffset && (currentOffset + currentHeight) < footerTop;

      if (shouldBeSticky && !isStuckyRef.current) {
        // Aplicar fixed
        const placeholderRect = placeholder.getBoundingClientRect();
        element.style.position = 'fixed';
        element.style.top = `${currentOffset}px`;
        element.style.left = `${placeholderRect.left}px`;
        element.style.right = 'auto';
        element.style.width = `${placeholderRect.width}px`;
        element.style.zIndex = '50';
        updatePlaceholderHeight(currentHeight);
        isStuckyRef.current = true;
        onStick?.(true);
      } else if (!shouldBeSticky && isStuckyRef.current) {
        // Remover fixed
        element.style.position = 'relative';
        element.style.top = 'auto';
        element.style.left = 'auto';
        element.style.right = 'auto';
        element.style.width = 'auto';
        element.style.zIndex = 'auto';
        updatePlaceholderHeight(0);
        isStuckyRef.current = false;
        onStick?.(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Capture initial position on mount
    setTimeout(() => {
      captureInitialPosition();
      handleScroll();
    }, 0);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unregisterStickyElement(elementId);
      updatePlaceholderHeight(0);
    };
  }, [topOffset, onStick, registerStickyElement, unregisterStickyElement, getStickyOffset]);

  return { ref, placeholderRef };
};
