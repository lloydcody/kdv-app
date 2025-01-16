import type { DriveFile } from '../types/drive';

export function isAllowedFileType(mimeType: string): boolean {
  return (
    mimeType.startsWith('image/') ||
    mimeType.startsWith('video/') ||
    mimeType === 'application/pdf'
  );
}

export function findFolderByPath(files: DriveFile[], path: string[]): DriveFile | null {
  let current: DriveFile | undefined = files.find(f => f.name === path[0]);
  
  for (let i = 1; i < path.length && current?.children; i++) {
    current = current.children.find(f => f.name === path[i]);
  }
  
  return current || null;
}

export function getDefaultKioskFiles(files: DriveFile[]): DriveFile[] {
  const kioskDocs = findFolderByPath(files, ['Kiosk Documents', 'Default']);
  return kioskDocs?.children || [];
}

export function getDefaultIdleFiles(files: DriveFile[]): DriveFile[] {
  const idleScreen = findFolderByPath(files, ['Idle Screen', 'Default']);
  const imageFiles = idleScreen?.children?.filter(file => 
    file.type === 'file' && file.mimeType.startsWith('image/')
  ) || [];
  return imageFiles;
}

export function getFilesToCache(files: DriveFile[]): DriveFile[] {
  const kioskFiles = getDefaultKioskFiles(files);
  const idleFiles = getDefaultIdleFiles(files);
  const filesToCache = [...kioskFiles, ...idleFiles];
  
  // Add thumbnail files for files that have them
  const thumbnailFiles = filesToCache
    .filter(file => file.hasThumbnail)
    .map(file => ({
      ...file,
      id: `thumb_${file.id}`,
      name: `thumbnail_${file.name}`
    }));
  
  return [...filesToCache, ...thumbnailFiles];
}

export function formatDisplayName(fileName: string): string {
  // Remove file extension
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
  // Replace underscores with spaces
  return nameWithoutExt.replace(/_/g, ' ');
}

export function getFileOrder(fileName: string): number {
  const match = fileName.match(/^(\d+)\s-\s/);
  return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
}

export function sortFiles(files: DriveFile[]): DriveFile[] {
  return [...files].sort((a, b) => {
    const orderA = getFileOrder(a.name);
    const orderB = getFileOrder(b.name);
    
    if (orderA === orderB) {
      return a.name.localeCompare(b.name);
    }
    return orderA - orderB;
  });
}