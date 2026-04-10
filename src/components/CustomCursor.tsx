import React, { useEffect, useState, useRef } from 'react';
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const mousePos = useRef({
    x: 0,
    y: 0
  });
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mousePos.current = {
        x: e.clientX,
        y: e.clientY
      };
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
      }
    };
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') ||
      target.closest('button') ||
      target.classList.contains('cursor-hover'))
      {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);
  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        willChange: 'transform'
      }}>
      
      {/* Crosshair Cursor */}
      <div className="relative w-8 h-8 flex items-center justify-center">
        {/* Horizontal Line */}
        <div
          className={`absolute h-[1px] bg-white transition-all duration-150 ${isHovering ? 'w-12 bg-red-500 h-[2px]' : 'w-full'}`} />
        
        {/* Vertical Line */}
        <div
          className={`absolute w-[1px] bg-white transition-all duration-150 ${isHovering ? 'h-12 bg-red-500 w-[2px]' : 'h-full'}`} />
        
      </div>
    </div>);

}