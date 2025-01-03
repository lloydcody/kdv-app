import { DRIVE_CONFIG } from '../config/driveConfig';

class DriveService {
  private gapiInitialized = false;

  async initialize(): Promise<void> {
    if (this.gapiInitialized) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        gapi.load('client', async () => {
          try {
            await gapi.client.init(DRIVE_CONFIG);
            this.gapiInitialized = true;
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      };
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });
  }

  async listFiles(folderId: string): Promise<gapi.client.drive.File[]> {
    await this.initialize();
    
    const response = await gapi.client.drive.files.list({
      q: `'${folderId}' in parents`,
      fields: 'files(id, name, mimeType, webContentLink)',
      pageSize: 100
    });

    return response.result.files || [];
  }

  async downloadFile(fileId: string): Promise<Blob> {
    await this.initialize();
    
    const response = await gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media'
    }, { responseType: 'blob' });
    
    return response.body;
  }
}

export const driveService = new DriveService();