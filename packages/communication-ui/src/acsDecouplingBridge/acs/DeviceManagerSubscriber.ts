// © Microsoft Corporation. All rights reserved.
import { DeviceManager } from '@azure/communication-calling';
import { ChangeEmitter, UnsubscribeFunction } from './AcsCallingAdapter';
import { CallingStateUpdate } from './ActionsCreator';
import { CallingState } from '../CallingState';
import { queryMicrophones, queryCameras } from './DeviceManagerReducers';

// interface CollectionUpdatedEventPayload<T> {
//   added: T[];
//   removed: T[];
// }

export function subscribeToDeviceManager(
  getState: () => Readonly<CallingState>,
  emitOnChange: ChangeEmitter,
  deviceManager: DeviceManager
): UnsubscribeFunction {
  const audioDevicesUpdatedHandler = (): Promise<void> => emitOnChange(onAudioDevicesUpated(deviceManager));
  deviceManager.on('audioDevicesUpdated', audioDevicesUpdatedHandler);

  const videoDevicesUpdatedHandler = (): Promise<void> => emitOnChange(onVideoDevicesUpated(deviceManager));
  deviceManager.on('audioDevicesUpdated', videoDevicesUpdatedHandler);

  return () => {
    deviceManager.off('audioDevicesUpdated', audioDevicesUpdatedHandler);
    deviceManager.off('videoDevicesUpdated', videoDevicesUpdatedHandler);
  };
}

const onAudioDevicesUpated = (deviceManager: DeviceManager): CallingStateUpdate => {
  // ignore added/removed payload and just query again
  return (draft) => queryMicrophones(deviceManager);
};

const onVideoDevicesUpated = (deviceManager: DeviceManager): CallingStateUpdate => {
  // ignore added/removed payload and just query again
  return (draft) => queryCameras(deviceManager);
};
