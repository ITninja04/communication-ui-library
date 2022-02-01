// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentifierKind } from '@azure/communication-common';
import { FileUploadManager } from './FileUpload';

/**
 * @beta
 * A callback function for handling file uploads.
 *
 * @param userId - The user ID of the user uploading the file.
 * @param fileUploads - The list of uploaded files. Each file is represented by an {@link FileUpload} object.
 */
export type FileUploadHandler = (userId: CommunicationIdentifierKind, fileUploads: FileUploadManager[]) => void;
