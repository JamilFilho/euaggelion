import { useEffect, useRef } from 'react';
import { useStickContext } from '@/lib/context/StickyContext';

interface UseStickyOptions {
  topOffset?: number;
  onStick?: (isSticky: boolean) => void;
  id?: string;
}

export const useSticky = ({ topOffset = 0, onStick, id }: UseStickyOptions = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isStuckyRef = useRef(false);
  const elementHeightRef = useRef(0);
  const elementIdRef = useRef(id || `sticky-${Math.random().toString(36).substr(2, 9)}`);
  
  const { registerStickyElement, unregisterStickyElement, getStickyOffset } = useStickContext();

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const elementId = elementIdRef.current;

    // Registrar altura inicial
    const height = element.offsetHeight;
    elementHeightRef.current = height;
    registerStickyElement(elementId, height);

    const handleScroll = () => {
      const currentHeight = element.offsetHeight;
      if (currentHeight !== elementHeightRef.current) {
        elementHeightRef.current = currentHeight;
        registerStickyElement(elementId, currentHeight);
      }

      const currentOffset = getStickyOffset(elementId, topOffset);
      const scrollTop = window.scrollY;
      
      // Encontra o footer
      const footerElement = document.querySelector('footer');
      const footerTop = footerElement?.getBoundingClientRect().top ?? window.innerHeight + 1;

      // Should be sticky when not overlapping footer
      const shouldBeSticky = (currentOffset + currentHeight) < footerTop;

      if (shouldBeSticky && !isStuckyRef.current) {
        // Aplicar sticky
        element.style.position = 'sticky';
        element.style.top = `${currentOffset}px`;
        isStuckyRef.current = true;
        onStick?.(true);
      } else if (!shouldBeSticky && isStuckyRef.current) {
        // Remover sticky
        element.style.position = 'relative';
        element.style.top = 'auto';
        isStuckyRef.current = false;
        onStick?.(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unregisterStickyElement(elementId);
    };
  }, [topOffset, onStick, registerStickyElement, unregisterStickyElement, getStickyOffset]);

  return { ref };
};
