import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { getCachedFile } from '../../services/cacheService';
import type { DriveFile } from '../../types/drive';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Props {
  file: DriveFile;
  onControlsChange: (controls: any) => void;
}

export function PDFPreview({ file, onControlsChange }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    getCachedFile(file.id).then(setSrc);
  }, [file.id]);

  useEffect(() => {
    onControlsChange({
      pagination: {
        currentPage: pageNumber,
        totalPages: numPages,
        onPrevPage: () => setPageNumber(page => Math.max(1, page - 1)),
        onNextPage: () => setPageNumber(page => Math.min(numPages, page + 1))
      }
    });
  }, [pageNumber, numPages, onControlsChange]);

  if (!src) return null;

  return (
    <TransformWrapper
      initialScale={0.8}
      minScale={0.8}
      maxScale={2}
      centerOnInit
      limitToBounds
      onZoomChange={({ state }) => {
        onControlsChange({
          preview: {
            onZoomIn: state.zoomIn,
            onZoomOut: state.zoomOut,
            onReset: state.resetTransform
          }
        });
      }}
    >
      <TransformComponent
        wrapperClass="w-full h-full flex items-center justify-center"
        contentClass="h-full flex items-center justify-center"
      >
        <Document
          file={src}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setScale(0.8);
          }}
          className="flex justify-center items-center"
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            scale={scale}
          />
        </Document>
      </TransformComponent>
    </TransformWrapper>
  );
}