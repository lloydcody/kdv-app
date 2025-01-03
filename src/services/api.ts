import { API_CONFIG } from '../config/apiConfig';

export async function listFiles(): Promise<DriveFile[]> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/files`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch files' }));
      throw new Error(error.message || 'Failed to fetch files');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
}

export async function downloadFile(fileId: string, fileName: string): Promise<void> {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}/files/${fileId}/download?name=${encodeURIComponent(fileName)}`
    );
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to download file' }));
      throw new Error(error.message || 'Failed to download file');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}