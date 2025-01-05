import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { PreviewContainer } from './PreviewContainer';
import { usePreviewSize } from '../../hooks/usePreviewSize';
import { usePDFCache } from '../../hooks/usePDFCache';
import type { DriveFile } from '../../types/drive';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Props {
  file: DriveFile;
  onControlsChange: (controls: any) => void;
}

export function PDFPreview({ file, onControlsChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const size = usePreviewSize(containerRef);
  const { pdfUrl, loadPDF } = usePDFCache();

  useEffect(() => {
    loadPDF(file.id);
  }, [file.id, loadPDF]);

  useEffect(() => {
    onControlsChange({
      pagination: {
        currentPage: pageNumber,
        totalPages: numPages,
        onPrevPage: () => {
          if (pageNumber > 1) {
            setDirection('prev');
            setPageNumber(page => page - 1);
          }
        },
        onNextPage: () => {
          if (pageNumber < numPages) {
            setDirection('next');
            setPageNumber(page => page + 1);
          }
        }
      }
    });
  }, [pageNumber, numPages, onControlsChange]);

  if (!pdfUrl) return null;

  return (
    <PreviewContainer ref={containerRef}>
      <div className="relative flex items-center justify-center h-full max-h-full overflow-hidden">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </motion.div>
        )}
        
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setIsLoading(false);
          }}
          loading={null}
          className="max-h-full"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pageNumber}
              initial={{ opacity: 0, x: direction === 'next' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction === 'next' ? -20 : 20 }}
              transition={{ duration: 0.15 }}
              className="max-h-full"
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="bg-transparent max-h-full"
                width={size.width}
                height={size.height}
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Pre-render adjacent pages */}
          <div className="hidden">
            {pageNumber > 1 && (
              <Page
                pageNumber={pageNumber - 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={size.width}
                height={size.height}
              />
            )}
            {pageNumber < numPages && (
              <Page
                pageNumber={pageNumber + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={size.width}
                height={size.height}
              />
            )}
          </div>
        </Document>
      </div>
    </PreviewContainer>
  );
}