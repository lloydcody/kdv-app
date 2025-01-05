import type { DriveFile } from '../types/drive';

export function isAllowedFileType(mimeType: string): boolean {
  return (
    mimeType.startsWith('image/') ||
    mimeType.startsWith('video/') ||
    mimeType === 'application/pdf'
  );
}

export function findFolderByPath(files: DriveFile[], path: string[]): DriveFile | null {
  let current: DriveFile | undefined;
  
  // First find the root folder
  for (const file of files) {
    if (file.name === path[0] && file.type === 'folder') {
      current = file;
      break;
    }
  }
  
  // Then traverse down the path
  for (let i = 1; i < path.length && current?.children; i++) {
    const next = current.children.find(f => f.name === path[i] && f.type === 'folder');
    if (!next) return null;
    current = next;
  }
  
  return current || null;
}

export function getTagsFromHash(): string[] {
  const hash = window.location.hash;
  if (!hash) return [];
  
  const tagsMatch = hash.match(/#tags=([^&]+)/);
  if (!tagsMatch) return [];
  
  return tagsMatch[1].split(',').map(tag => tag.trim());
}

export function getKioskFiles(files: DriveFile[], tags: string[]): DriveFile[] {
  const defaultFolder = findFolderByPath(files, ['Kiosk Documents', 'Default']);
  const defaultFiles = defaultFolder?.children || [];

  // Get files from tagged folders
  const taggedFiles = tags.reduce((acc: DriveFile[], tag) => {
    const tagFolder = findFolderByPath(files, ['Kiosk Documents', tag]);
    if (tagFolder?.children) {
      acc.push(...tagFolder.children);
    }
    return acc;
  }, []);

  // Combine and deduplicate files based on name
  const allFiles = [...defaultFiles, ...taggedFiles];
  const uniqueFiles = Array.from(new Map(allFiles.map(file => [file.name, file])).values());

  return sortFiles(uniqueFiles);
}

export function getDefaultIdleFiles(files: DriveFile[]): DriveFile[] {
  const idleScreen = findFolderByPath(files, ['Idle Screen', 'Default']);
  const imageFiles = idleScreen?.children?.filter(file => 
    file.type === 'file' && file.mimeType.startsWith('image/')
  ) || [];
  return imageFiles;
}

export function formatDisplayName(fileName: string): string {
  // Remove file extension
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
  // Replace underscores with spaces and remove any ordering prefix (e.g., "01 - ")
  return nameWithoutExt.replace(/^\d+\s*-\s*/, '').replace(/_/g, ' ');
}

export function getFilesToCache(files: DriveFile[], tags: string[]): DriveFile[] {
  const kioskFiles = getKioskFiles(files, tags);
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

export function getFileOrder(fileName: string): number {
  const match = fileName.match(/^(\d+)\s*-\s*/);
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