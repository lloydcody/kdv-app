export interface StatusUpdate {
  type: 'status';
  message: string;
}

export interface ProgressUpdate {
  type: 'progress';
  fileName: string;
  remaining: number;
  speed: number;
  progress: number;
}

export interface CompleteUpdate {
  type: 'complete';
}

export interface ErrorUpdate {
  type: 'error';
  message: string;
}

export type WorkerUpdate = StatusUpdate | ProgressUpdate | CompleteUpdate | ErrorUpdate;