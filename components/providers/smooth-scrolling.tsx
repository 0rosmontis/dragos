'use client';

import type { ReactNode } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';

interface SmoothScrollingProps {
  children: ReactNode;
}

export default function SmoothScrolling({ children }: SmoothScrollingProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2
      }}
    >
      {children}
    </ReactLenis>
  );
}
