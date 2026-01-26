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
  const initialTopRef = useRef(0);
  
  const { registerStickyElement, unregisterStickyElement, getStickyOffset, setElementSticky, getTotalStickyHeight } = useStickContext();

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const elementId = elementIdRef.current;

    // Registrar altura inicial
    const height = element.offsetHeight;
    elementHeightRef.current = height;
    initialTopRef.current = element.offsetTop;
    registerStickyElement(elementId, height);

    const handleScroll = () => {
      const currentHeight = element.offsetHeight;
      if (currentHeight !== elementHeightRef.current) {
        elementHeightRef.current = currentHeight;
        registerStickyElement(elementId, currentHeight);
      }

      const currentOffset = getStickyOffset(elementId, topOffset);
      const scrollTop = window.scrollY;
      
      const shouldBeSticky = scrollTop > initialTopRef.current && !isStuckyRef.current;
      const shouldUnstick = scrollTop <= initialTopRef.current && isStuckyRef.current;

      if (shouldBeSticky) {
        element.classList.add('sticky-active', 'sticky-high-z');
        element.style.top = `${currentOffset}px`;
        element.style.zIndex = '10000';
        
        setElementSticky(elementId, true);
        
        // Compensar espaço perdido no body
        document.body.style.marginTop = `${getTotalStickyHeight()}px`;
        
        isStuckyRef.current = true;
        onStick?.(true);
      } else if (shouldUnstick) {
        element.classList.remove('sticky-active', 'sticky-high-z');
        element.style.top = '';
        element.style.zIndex = '';
        
        setElementSticky(elementId, false);
        
        // Atualizar compensação no body
        document.body.style.marginTop = `${getTotalStickyHeight()}px`;
        
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
