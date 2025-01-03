import React, { useEffect, useState } from 'react';
import { FileIcon, FolderIcon, DownloadIcon } from 'lucide-react';
import { listFiles, downloadFile } from '../services/api';
import type { DriveFile } from '../types/drive';

export function FileList() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  async function handleDownload(fileId: string, fileName: string) {
    try {
      await downloadFile(fileId, fileName);
    } catch (err) {
      console.error('Download failed:', err);
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <ul className="divide-y divide-gray-200">
        {files.map((file) => (
          <li key={file.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {file.mimeType.includes('folder') ? (
                <FolderIcon className="w-5 h-5 text-blue-500" />
              ) : (
                <FileIcon className="w-5 h-5 text-gray-500" />
              )}
              <span className="text-gray-900">{file.name}</span>
            </div>
            {!file.mimeType.includes('folder') && (
              <button
                onClick={() => handleDownload(file.id, file.name)}
                className="p-2 text-gray-500 hover:text-blue-500"
              >
                <DownloadIcon className="w-5 h-5" />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}