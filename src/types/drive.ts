export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  path: string[];
  parentId: string;
  hasThumbnail: boolean;
  thumbnailUrl?: string;
  type: 'file' | 'folder' | 'embedded';
  children?: DriveFile[];
  embeddedUrl?: string;
}

export interface FileFolder {
  id: string;
  files: DriveFile[];
}