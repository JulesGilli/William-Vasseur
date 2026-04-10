import React, { Component } from 'react';
import { motion } from 'framer-motion';
interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}
export function GlitchText({
  text,
  className = '',
  as: Component = 'div'
}: GlitchTextProps) {
  return (
    <Component className={`glitch-wrapper ${className}`} data-text={text}>
      {text}
    </Component>);

}