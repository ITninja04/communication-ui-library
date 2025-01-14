// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove-from(stable): FILE_SHARING */
import produce from 'immer';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { FileMetadata, FileSharingMetadata, ObservableFileUpload, FileUploadState } from '../file-sharing';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { ChatContext } from './AzureCommunicationChatAdapter';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { ChatAdapterState } from './ChatAdapter';

/* @conditional-compile-remove-from(stable): FILE_SHARING */
/**
 * A record containing {@link FileUploadState} mapped to unique ids.
 * @beta
 */
export type FileUploadsUiState = Record<string, FileUploadState>;

/* @conditional-compile-remove-from(stable): FILE_SHARING */
/**
 * @beta
 */
export interface FileUploadAdapter {
  registerFileUploads?: (fileUploads: ObservableFileUpload[]) => void;
  clearFileUploads?: () => void;
  cancelFileUpload?: (id: string) => void;
}

/* @conditional-compile-remove-from(stable): FILE_SHARING */
/**
 * @internal
 */
class FileUploadContext {
  private chatContext: ChatContext;

  constructor(chatContext: ChatContext) {
    this.chatContext = chatContext;
  }

  public getFileUploads(): FileUploadsUiState | undefined {
    return this.chatContext.getState().fileUploads;
  }

  public setFileUploads(fileUploads: ObservableFileUpload[]): void {
    const fileUploadsMap = fileUploads.reduce((map: FileUploadsUiState, fileUpload) => {
      map[fileUpload.id] = {
        id: fileUpload.id,
        filename: fileUpload.file.name,
        progress: 0
      };
      return map;
    }, {});

    this.chatContext.setState(
      produce(this.chatContext.getState(), (draft) => {
        draft.fileUploads = fileUploadsMap;
      })
    );
  }

  public updateFileUpload(
    id: string,
    data: Partial<Pick<FileUploadState, 'progress' | 'metadata' | 'errorMessage'>>
  ): void {
    this.chatContext.setState(
      produce(this.chatContext.getState(), (draft: ChatAdapterState) => {
        if (draft.fileUploads?.[id]) {
          draft.fileUploads[id] = {
            ...draft.fileUploads?.[id],
            ...data
          };
        }
      })
    );
  }

  public deleteFileUpload(id: string): void {
    this.chatContext.setState(
      produce(this.chatContext.getState(), (draft: ChatAdapterState) => {
        delete draft?.fileUploads?.[id];
      })
    );
  }
}

/* @conditional-compile-remove-from(stable): FILE_SHARING */
/**
 * @internal
 */
export class AzureCommunicationFileUploadAdapter implements FileUploadAdapter {
  private context: FileUploadContext;
  private fileUploads: ObservableFileUpload[] = [];

  constructor(chatContext: ChatContext) {
    this.context = new FileUploadContext(chatContext);
  }

  private findFileUpload(id: string): ObservableFileUpload | undefined {
    return this.fileUploads.find((fileUpload) => fileUpload.id === id);
  }

  private deleteFileUpload(id: string): void {
    this.fileUploads = this.fileUploads.filter((fileUpload) => fileUpload.id !== id);
  }

  registerFileUploads(fileUploads: ObservableFileUpload[]): void {
    this.fileUploads = this.fileUploads.concat(fileUploads);
    this.context.setFileUploads(this.fileUploads);
    this.fileUploads.forEach(this.subscribeAllEvents);
  }

  clearFileUploads(): void {
    this.context.setFileUploads([]);
    this.fileUploads.forEach(this.unsubscribeAllEvents);
  }

  cancelFileUpload(id: string): void {
    this.context.deleteFileUpload(id);
    const fileUpload = this.findFileUpload(id);
    if (!fileUpload) {
      throw new Error('File upload not found');
    }
    this.unsubscribeAllEvents(fileUpload);
    this.deleteFileUpload(id);
  }

  private fileUploadProgressListener(id: string, progress: number): void {
    this.context.updateFileUpload(id, { progress });
  }

  private fileUploadFailedListener(id: string, errorMessage: string): void {
    this.context.updateFileUpload(id, { errorMessage });
  }

  private fileUploadCompletedListener(id: string, metadata: FileMetadata): void {
    this.context.updateFileUpload(id, { progress: 1, metadata });
  }

  private subscribeAllEvents(fileUpload: ObservableFileUpload): void {
    fileUpload.on('uploadProgressed', this.fileUploadProgressListener);
    fileUpload.on('uploadCompleted', this.fileUploadCompletedListener);
    fileUpload.on('uploadFailed', this.fileUploadFailedListener);
  }

  private unsubscribeAllEvents(fileUpload: ObservableFileUpload): void {
    fileUpload?.off('uploadProgressed', this.fileUploadProgressListener);
    fileUpload?.off('uploadCompleted', this.fileUploadCompletedListener);
    fileUpload?.off('uploadFailed', this.fileUploadFailedListener);
  }
}

/* @conditional-compile-remove-from(stable): FILE_SHARING */
/**
 * @param fileUploadUiState {@link FileUploadsUiState}
 * @private
 */
export const convertFileUploadsUiStateToMessageMetadata = (fileUploads?: FileUploadsUiState): FileSharingMetadata => {
  const fileMetadata: FileMetadata[] = [];
  if (fileUploads) {
    Object.keys(fileUploads).forEach((key) => {
      const file = fileUploads[key];
      if (file.metadata) {
        fileMetadata.push(file.metadata);
      }
    });
  }

  return { fileSharingMetadata: JSON.stringify(fileMetadata) };
};

/**
 * Workaround to make this module compile under the `--isolatedModules` flag.
 * @internal
 */
export {};
