import React, { useState, useEffect } from 'react';
import { FileGrid } from './components/FileGrid';
import { InstanceOverlay } from './components/InstanceOverlay';
import { PreviewScreen } from './components/PreviewScreen';
import { useInstanceInfo } from './hooks/useInstanceInfo';
import { listFiles } from './services/api';
import type { DriveFile } from './types/drive';

export default function App() {
  const instanceInfo = useInstanceInfo();
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    try {
      setLoading(true);
      const fileList = await listFiles();
      setFiles(fileList);
    } catch (err) {
      setError('Failed to load files');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleFileSelect = (file: DriveFile) => {
    setSelectedFile(file);
  };

  const handleClose = () => {
    setSelectedFile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading files...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative min-h-screen">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <FileGrid files={files} onFileSelect={handleFileSelect} />
            {instanceInfo && <InstanceOverlay instanceInfo={instanceInfo} />}
          </div>
        </div>
        {selectedFile && (
          <PreviewScreen
            file={selectedFile}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}