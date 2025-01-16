import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HomeScreen } from './components/HomeScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { IdleScreen } from './components/IdleScreen';
import { PreviewScreen } from './components/PreviewScreen';
import { UpdateToast } from './components/UpdateToast';
import { InactivityIndicator } from './components/InactivityIndicator';
import { useInstanceInfo } from './hooks/useInstanceInfo';
import { useInactivityTimer } from './hooks/useInactivityTimer';
import { listFiles } from './services/api';
import { getKioskFiles, getTagsFromHash } from './utils/fileUtils';
import type { DriveFile } from './types/drive';
import type { WorkerUpdate } from './types/worker';

const INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 3 minutes

type AppState = 'loading' | 'idle' | 'home';

export default function App() {
  const instanceInfo = useInstanceInfo();
  const [appState, setAppState] = useState<AppState>('loading');
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [displayFiles, setDisplayFiles] = useState<DriveFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string>('');

  useInactivityTimer(() => {
    setAppState('idle');
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
    const handleHashChange = () => {
      const tags = getTagsFromHash();
      setDisplayFiles(getKioskFiles(files, tags));
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [files]);

  async function loadFiles() {
    try {
      const fileList = await listFiles();
      setFiles(fileList);
      const tags = getTagsFromHash();
      setDisplayFiles(getKioskFiles(fileList, tags));
    } catch (err) {
      setError('Failed to load files');
      console.error(err);
    }
  }

  const handleLoadingComplete = () => {
    setAppState('idle');
  };

  const handleDismissIdle = () => {
    setAppState('home');
  };

  const handleFileSelect = (file: DriveFile) => {
    setSelectedFile(file);
  };

  const handleClose = () => {
    setSelectedFile(null);
  };

  const handleLogoClick = () => {
    setAppState('idle');
    setSelectedFile(null);
  };

  const handleWorkerMessage = (event: MessageEvent<WorkerUpdate>) => {
    const update = event.data;
    if (update.type === 'status') {
      setUpdateStatus(update.message);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1E3A8A] to-[#0D1B45] flex items-center justify-center">
        <p className="text-red-500 text-xl text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {appState === 'loading' && (
          <LoadingScreen key="loading-screen" onLoadingComplete={handleLoadingComplete} />
        )}
        
        {appState === 'idle' && (
          <IdleScreen key="idle-screen" onDismiss={handleDismissIdle} files={files} />
        )}
        
        {appState === 'home' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
            style={{ zIndex: selectedFile ? 0 : 1 }}
          >
            <HomeScreen
              key="home-screen"
              files={displayFiles}
              onFileSelect={handleFileSelect}
              onLogoClick={handleLogoClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedFile && (
          <div className="relative" style={{ zIndex: 2 }}>
            <PreviewScreen
              key={`preview-${selectedFile.id}`}
              file={selectedFile}
              onClose={handleClose}
            />
          </div>
        )}
      </AnimatePresence>

      <UpdateToast 
        visible={isCheckingUpdates} 
        status={updateStatus}
      />

      <InactivityIndicator timeoutDuration={INACTIVITY_TIMEOUT} />
    </div>
  );
}