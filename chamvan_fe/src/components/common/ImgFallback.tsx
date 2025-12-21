'use client';

import React from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export default function ImgFallback({
  fallbackSrc = '/placeholder.jpg',
  ...props
}: Props) {
  return (
    <img
      {...props}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src.endsWith(fallbackSrc)) return;
        img.src = fallbackSrc;
      }}
    />
  );
}
