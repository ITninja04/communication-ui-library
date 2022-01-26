// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import {
  StreamMedia,
  VideoGallery,
  VideoGalleryStream,
  VideoStreamOptions,
  _PictureInPictureInPicture,
  _PictureInPictureInPictureTileProps
} from '@internal/react-components';
import { pictureInPictureInPictureSelector } from '../selectors/pictureInPictureInPictureSelector';
import { useSelector } from '../hooks/useSelector';
import { useHandlers } from '../hooks/useHandlers';
import { usePropsFor } from '../hooks/usePropsFor';

/** @private */
export const PiPiPContainer = (): JSX.Element => {
  // just testing how use props would work
  const pipipProps = useSelector(pictureInPictureInPictureSelector);
  const handlers = useHandlers(SmartPictureInPictureInPicture);
  const videoGalleryProps = usePropsFor(VideoGallery);

  const localParticipant = {
    displayName: 'test display name',
    videoStream: pipipProps.localParticipantVideoStream
  };

  const [dominantParticipantId] = videoGalleryProps.dominantSpeakers ?? [];
  const dominantParticipant = videoGalleryProps.remoteParticipants.find(
    (remoteParticipant) => remoteParticipant.userId === dominantParticipantId
  );

  return (
    <SmartPictureInPictureInPicture
      dominantRemoteParticipant={dominantParticipant}
      localParticipant={localParticipant}
      onClick={() => alert('clicked!')}
      {...handlers}
    />
  );
};

/**
 * @private
 */
export interface SmartPictureInPictureInPictureProps {
  onClick: () => void;
  localParticipant: { displayName: string; videoStream: VideoGalleryStream };
  dominantRemoteParticipant?: {
    userId: string;
    displayName?: string;
    videoStream?: VideoGalleryStream;
  };

  /** Callback to create the local video stream view */
  onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void>;
  /** Callback to dispose of the local video stream view */
  onDisposeLocalStreamView?: () => void;
  /** Callback to create a remote video stream view */
  onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>;
  /** Callback to dispose a remote video stream view */
  onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
}

/**
 * @private
 */
export const SmartPictureInPictureInPicture = (props: SmartPictureInPictureInPictureProps): JSX.Element => {
  const localVideoTile = useCallback(
    () =>
      createLocalVideoTile(
        props.localParticipant.displayName,
        props.localParticipant?.videoStream,
        props.onCreateLocalStreamView
      ),
    [props.localParticipant.displayName, props.localParticipant?.videoStream, props.onCreateLocalStreamView]
  );

  const remoteVideoTile = useCallback(
    () =>
      props.dominantRemoteParticipant &&
      createRemoteVideoTile(
        props.dominantRemoteParticipant.userId,
        props.dominantRemoteParticipant.displayName,
        props.dominantRemoteParticipant.videoStream,
        props.onCreateRemoteStreamView
      ),
    [props.dominantRemoteParticipant, props.onCreateRemoteStreamView]
  );

  return (
    <_PictureInPictureInPicture
      onClick={props.onClick}
      primaryTile={props.dominantRemoteParticipant ? remoteVideoTile()! : localVideoTile()}
      secondaryTile={props.dominantRemoteParticipant ? localVideoTile() : undefined}
    />
  );
};

const localVideoViewOptions = {
  scalingMode: 'Crop',
  isMirrored: true
} as VideoStreamOptions;

// TODO: UPDATE TO USE <LocalVideoTile /> and <RemoteVideoTile />
const createLocalVideoTile = (
  displayName?: string,
  videoStream?: VideoGalleryStream,
  onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void>
): _PictureInPictureInPictureTileProps => {
  if (videoStream && !videoStream.renderElement) {
    onCreateLocalStreamView && onCreateLocalStreamView(localVideoViewOptions);
  }

  return {
    orientation: 'portrait', // TODO: when the calling SDK provides height/width stream information - update this to reflect the stream orientation.
    renderElement: videoStream?.renderElement ? (
      <StreamMedia videoStreamElement={videoStream.renderElement} />
    ) : undefined,
    displayName: displayName //TODO [jaburnsi]: update to initialsName
  };
};

const remoteVideoViewOptions = {
  scalingMode: 'Crop',
  isMirrored: true
} as VideoStreamOptions;

const createRemoteVideoTile = (
  participantId: string,
  displayName?: string,
  videoStream?: VideoGalleryStream,
  onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>
): _PictureInPictureInPictureTileProps => {
  if (videoStream && !videoStream.renderElement) {
    onCreateRemoteStreamView && onCreateRemoteStreamView(participantId, remoteVideoViewOptions);
  }

  return {
    orientation: 'portrait', // TODO: when the calling SDK provides height/width stream information - update this to reflect the stream orientation.
    renderElement: videoStream?.renderElement ? (
      <StreamMedia videoStreamElement={videoStream.renderElement} />
    ) : undefined,
    displayName: displayName //TODO [jaburnsi]: update to initialsName
  };
};
