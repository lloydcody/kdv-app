import React from 'react';
import { PreviewContainer } from './PreviewContainer';

interface Props {
  url: string;
}

export function EmbeddedPreview({ url }: Props) {
  return (
    <PreviewContainer>
      <iframe
        src={url}
        className="w-full h-full border-0 rounded-2xl"
        title="Embedded Content"
      />
    </PreviewContainer>
  );
}