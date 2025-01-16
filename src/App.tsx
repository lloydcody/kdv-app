import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FileGrid } from './components/FileGrid';
import { LoadingScreen } from './components/LoadingScreen';
import { LockScreen } from './components/LockScreen';
import { PreviewScreen } from './components/PreviewScreen';
import { UpdateToast } from './components/UpdateToast';
import { useInstanceInfo } from './hooks/useInstanceInfo';
import { useInactivityTimer } from './hooks/useInactivityTimer';
import { listFiles } from './services/api';
import { getDefaultKioskFiles } from './utils/fileUtils';
import type { DriveFile } from './types/drive';

type AppState = 'loading' | 'locked' | 'home';

export default function App() {
  const instanceInfo = useInstanceInfo();
  const [appState, setAppState] = useState<AppState>('loading');
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [displayFiles, setDisplayFiles] = useState<DriveFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);

  useInactivityTimer(() => {
    setAppState('locked');
    setSelectedFile(null);
  });

  useEffect(() => {
    loadFiles();
    
    const interval = setInterval(async () => {
      setIsCheckingUpdates(true);
      await loadFiles();
      setIsCheckingUpdates(false);
    }, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDisplayFiles(getDefaultKioskFiles(files));
  }, [files]);

  async function loadFiles() {
    try {
      const fileList = await listFiles();
      setFiles(fileList);
    } catch (err) {
      setError('Failed to load files');
      console.error(err);
    }
  }

  const handleLoadingComplete = () => {
    setAppState('locked');
  };

  const handleUnlock = () => {
    setAppState('home');
  };

  const handleFileSelect = (file: DriveFile) => {
    setSelectedFile(file);
  };

  const handleClose = () => {
    setSelectedFile(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {appState === 'loading' && (
          <LoadingScreen key="loading-screen" onLoadingComplete={handleLoadingComplete} />
        )}
        
        {appState === 'locked' && (
          <LockScreen key="lock-screen" onUnlock={handleUnlock} files={files} />
        )}
        
        {appState === 'home' && (
          <div key="home-screen" className="min-h-screen bg-gray-900">
            <div className="relative min-h-screen">
              <div className="p-8">
                <div className="max-w-7xl mx-auto">
                  <FileGrid files={displayFiles} onFileSelect={handleFileSelect} />
                </div>
              </div>
              <AnimatePresence mode="wait">
                {selectedFile && (
                  <PreviewScreen
                    key={`preview-${selectedFile.id}`}
                    file={selectedFile}
                    onClose={handleClose}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </AnimatePresence>

      <UpdateToast visible={isCheckingUpdates} />
    </>
  );
}