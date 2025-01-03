import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { API_CONFIG } from '../../config/apiConfig';
import type { DriveFile } from '../../types/drive';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Props {
  file: DriveFile;
}

export function PDFPreview({ file }: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    // Start with a zoomed out view
    setScale(0.8);
  };

  return (
    <TransformWrapper
      initialScale={0.8}
      minScale={0.3}
      maxScale={2}
      centerOnInit
      limitToBounds
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          <TransformComponent wrapperClass="w-full h-full" contentClass="h-full flex items-center justify-center">
            <Document
              file={`${API_CONFIG.baseUrl}/files/${file.id}/preview`}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex justify-center"
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                scale={scale}
              />
            </Document>
          </TransformComponent>
          
          <div className="absolute bottom-0 inset-x-0 h-32 flex items-center justify-center gap-8">
            {numPages > 1 && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setPageNumber(page => Math.max(1, page - 1))}
                  disabled={pageNumber <= 1}
                  className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full disabled:opacity-50"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-white">
                  {pageNumber} / {numPages}
                </span>
                <button
                  onClick={() => setPageNumber(page => Math.min(numPages, page + 1))}
                  disabled={pageNumber >= numPages}
                  className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full disabled:opacity-50"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-4">
              <button
                onClick={() => zoomOut()}
                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
              >
                <ZoomOut className="w-6 h-6" />
              </button>
              <button
                onClick={() => resetTransform()}
                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
              <button
                onClick={() => zoomIn()}
                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
              >
                <ZoomIn className="w-6 h-6" />
              </button>
            </div>
          </div>
        </>
      )}
    </TransformWrapper>
  );
}