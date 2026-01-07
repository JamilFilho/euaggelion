import { useEffect, useRef, useState } from 'react';
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
  const [elementHeight, setElementHeight] = useState(0);
  const elementIdRef = useRef(id || `sticky-${Math.random().toString(36).substr(2, 9)}`);
  
  const { registerStickyElement, unregisterStickyElement, getStickyOffset } = useStickContext();

  useEffect(() => {
    const element = ref.current;
    const placeholder = placeholderRef.current;

    if (!element || !placeholder) return;

    const elementId = elementIdRef.current;

    // Registrar a altura do elemento
    const height = element.offsetHeight;
    setElementHeight(height);
    registerStickyElement(elementId, height);

    const handleScroll = () => {
      const currentHeight = element.offsetHeight;
      if (currentHeight !== elementHeight) {
        setElementHeight(currentHeight);
        registerStickyElement(elementId, currentHeight);
      }

      const placeholderRect = placeholder.getBoundingClientRect();
      const currentOffset = getStickyOffset(elementId, topOffset);
      
      // Encontra o footer
      const footerElement = document.querySelector('footer');
      const footerTop = footerElement?.getBoundingClientRect().top ?? window.innerHeight + 1;

      const shouldBeSticky = placeholderRect.top <= currentOffset && (currentOffset + currentHeight) < footerTop;

      if (shouldBeSticky && !isStuckyRef.current) {
        // Aplicar fixed
        element.style.position = 'fixed';
        element.style.top = `${currentOffset}px`;
        element.style.left = '0';
        element.style.right = '0';
        element.style.zIndex = '50';
        isStuckyRef.current = true;
        onStick?.(true);
      } else if (!shouldBeSticky && isStuckyRef.current) {
        // Remover fixed
        element.style.position = 'relative';
        element.style.top = 'auto';
        element.style.left = 'auto';
        element.style.right = 'auto';
        element.style.zIndex = 'auto';
        isStuckyRef.current = false;
        onStick?.(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Executar uma vez no início
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      unregisterStickyElement(elementId);
    };
  }, [topOffset, onStick, registerStickyElement, unregisterStickyElement, getStickyOffset]);

  return { ref, placeholderRef };
};
