import React, { forwardRef } from 'react';

interface Props {
  children: React.ReactNode;
}

export const PreviewContainer = forwardRef<HTMLDivElement, Props>(({ children }, ref) => {
  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center">
      {children}
    </div>
  );
});