// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  createAzureCommunicationMeetingAdapter,
  toFlatCommunicationIdentifier,
  CallAndChatLocator,
  CallAndChatAdapter,
  CallAndChatAdapterState,
  CallAndChatComposite
} from '@azure/communication-react';
import { Spinner } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { createAutoRefreshingCredential } from '../utils/credential';
import MobileDetect from 'mobile-detect';
import { WEB_APP_TITLE } from '../utils/constants';

const detectMobileSession = (): boolean => !!new MobileDetect(window.navigator.userAgent).mobile();

export interface CallAndChatScreenProps {
  token: string;
  userId: CommunicationUserIdentifier;
  displayName: string;
  endpoint: string;
  locator: CallAndChatLocator | TeamsMeetingLinkLocator;
}

export const CallAndChatScreen = (props: CallAndChatScreenProps): JSX.Element => {
  const { token, userId, displayName, endpoint, locator } = props;
  const [adapter, setAdapter] = useState<CallAndChatAdapter>();
  const callIdRef = useRef<string>();
  const adapterRef = useRef<CallAndChatAdapter>();
  const { currentTheme, currentRtl } = useSwitchableFluentTheme();
  const [isMobileSession, setIsMobileSession] = useState<boolean>(detectMobileSession());

  // Whenever the sample is changed from desktop -> mobile using the emulator, make sure we update the formFactor.
  useEffect(() => {
    const updateIsMobile = (): void => setIsMobileSession(detectMobileSession());
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  useEffect(() => {
    (async () => {
      if (!userId || !displayName || !locator || !token || !endpoint) {
        return;
      }

      const adapter = await createAzureCommunicationCallAndChatAdapter({
        userId,
        displayName,
        credential: createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token),
        endpoint,
        callAndChat: locator
      });
      adapter.onStateChange((state: CallAndChatAdapterState) => {
        const pageTitle = convertPageStateToString(state);
        document.title = `${pageTitle} - ${WEB_APP_TITLE}`;

        if (state?.meeting?.id && callIdRef.current !== state?.meeting?.id) {
          callIdRef.current = state?.meeting?.id;
          console.log(`Call Id: ${callIdRef.current}`);
        }
      });
      setAdapter(adapter);
      adapterRef.current = adapter;
    })();

    return () => {
      adapterRef?.current?.dispose();
    };
  }, [displayName, token, userId, locator, endpoint]);

  if (!adapter) {
    return <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />;
  }

  return (
    <CallAndChatComposite
      callAndChatAdapter={adapter}
      fluentTheme={currentTheme.theme}
      rtl={currentRtl}
      joinInvitationURL={window.location.href}
      formFactor={isMobileSession ? 'mobile' : 'desktop'}
    />
  );
};

const convertPageStateToString = (state: CallAndChatAdapterState): string => {
  switch (state.page) {
    case 'accessDeniedTeamsMeeting':
      return 'error';
    case 'leftMeeting':
      return 'end meeting';
    case 'removedFromMeeting':
      return 'end meeting';
    default:
      return `${state.page}`;
  }
};
