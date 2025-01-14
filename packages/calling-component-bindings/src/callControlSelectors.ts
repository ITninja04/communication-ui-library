// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';
import { CallClientState } from '@internal/calling-stateful-client';
import * as reselect from 'reselect';
import {
  CallingBaseSelectorProps,
  getCallExists,
  getDeviceManager,
  getIsMuted,
  getIsScreenSharingOn,
  getLocalVideoStreams
} from './baseSelectors';
import { _isPreviewOn } from './callUtils';

/**
 * Selector type for {@link MicrophoneButton} component.
 *
 * @public
 */
export type MicrophoneButtonSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  disabled: boolean;
  checked: boolean;
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
  microphones: AudioDeviceInfo[];
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
  speakers: AudioDeviceInfo[];
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
  selectedMicrophone?: AudioDeviceInfo;
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
  selectedSpeaker?: AudioDeviceInfo;
};

/**
 * Selector for {@link MicrophoneButton} component.
 *
 * @public
 */
export const microphoneButtonSelector: MicrophoneButtonSelector = reselect.createSelector(
  [getCallExists, getIsMuted, getDeviceManager],
  (callExists, isMuted, deviceManager) => {
    const permission = deviceManager.deviceAccess ? deviceManager.deviceAccess.audio : true;
    return {
      disabled: !callExists || !permission,
      checked: callExists ? !isMuted : false,
      /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
      microphones: deviceManager.microphones,
      /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
      speakers: deviceManager.speakers,
      /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
      selectedMicrophone: deviceManager.selectedMicrophone,
      /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
      selectedSpeaker: deviceManager.selectedSpeaker
    };
  }
);

/**
 * Selector type for {@link CameraButton} component.
 *
 * @public
 */
export type CameraButtonSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  disabled: boolean;
  checked: boolean;
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
  cameras: VideoDeviceInfo[];
  /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
  selectedCamera?: VideoDeviceInfo;
};

/**
 * Selector for {@link CameraButton} component.
 *
 * @public
 */
export const cameraButtonSelector: CameraButtonSelector = reselect.createSelector(
  [getLocalVideoStreams, getDeviceManager],
  (localVideoStreams, deviceManager) => {
    const previewOn = _isPreviewOn(deviceManager);
    const localVideoFromCall = localVideoStreams?.find((stream) => stream.mediaStreamType === 'Video');
    const permission = deviceManager.deviceAccess ? deviceManager.deviceAccess.video : true;

    return {
      disabled: !deviceManager.selectedCamera || !permission,
      checked: localVideoStreams !== undefined && localVideoStreams.length > 0 ? !!localVideoFromCall : previewOn,
      /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
      cameras: deviceManager.cameras,
      /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
      selectedCamera: deviceManager.selectedCamera
    };
  }
);

/**
 * Selector type for {@link ScreenShareButton} component.
 *
 * @public
 */
export type ScreenShareButtonSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  checked?: boolean;
};

/**
 * Selector for {@link ScreenShareButton} component.
 *
 * @public
 */
export const screenShareButtonSelector: ScreenShareButtonSelector = reselect.createSelector(
  [getIsScreenSharingOn],
  (isScreenSharingOn) => {
    return {
      checked: isScreenSharingOn
    };
  }
);

/**
 * Selector type for {@link DevicesButton} component.
 *
 * @public
 */
export type DevicesButtonSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  microphones: AudioDeviceInfo[];
  speakers: AudioDeviceInfo[];
  cameras: VideoDeviceInfo[];
  selectedMicrophone?: AudioDeviceInfo;
  selectedSpeaker?: AudioDeviceInfo;
  selectedCamera?: VideoDeviceInfo;
};

/**
 * Selector for {@link DevicesButton} component.
 *
 * @public
 */
export const devicesButtonSelector: DevicesButtonSelector = reselect.createSelector(
  [getDeviceManager],
  (deviceManager) => {
    return {
      microphones: deviceManager.microphones,
      speakers: deviceManager.speakers,
      cameras: deviceManager.cameras,
      selectedMicrophone: deviceManager.selectedMicrophone,
      selectedSpeaker: deviceManager.selectedSpeaker,
      selectedCamera: deviceManager.selectedCamera
    };
  }
);
