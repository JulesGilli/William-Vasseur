import React from 'react';
export function GridOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 w-full h-full overflow-hidden">
      {/* Vertical Lines */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage:
          'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '100px 100%'
        }} />
      
      {/* Horizontal Lines */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage:
          'linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '100% 100px'
        }} />
      

      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,6px_100%] pointer-events-none opacity-20" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
    </div>);

}