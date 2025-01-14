import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAndChatLocator,
  MeetingCallControlOptions,
  MeetingAdapter,
  MeetingComposite,
  createAzureCommunicationMeetingAdapter
} from '@azure/communication-react';
import { Theme, PartialTheme } from '@fluentui/react';
import React, { useState, useEffect, useMemo } from 'react';

export type MeetingExampleProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  meetingLocator: TeamsMeetingLinkLocator | CallAndChatLocator;
  fluentTheme?: PartialTheme | Theme;
  callInvitationURL?: string;
  meetingCallControlOptions?: boolean | MeetingCallControlOptions;
};

export const MeetingExperience = (props: MeetingExampleProps): JSX.Element => {
  const [meetingAdapter, setMeetingAdapter] = useState<MeetingAdapter>();

  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);

  useEffect(() => {
    if (props && credential && props.meetingLocator && props.displayName && props.userId && props.endpointUrl) {
      const createAdapters = async (): Promise<void> => {
        setMeetingAdapter(
          await createAzureCommunicationMeetingAdapter({
            userId: props.userId,
            displayName: props.displayName,
            credential,
            meetingLocator: props.meetingLocator,
            endpoint: props.endpointUrl
          })
        );
      };
      createAdapters();
    }
  }, [credential, props]);

  if (meetingAdapter) {
    const options = { callControls: props.meetingCallControlOptions };
    return <MeetingComposite meetingAdapter={meetingAdapter} fluentTheme={props.fluentTheme} options={options} />;
  }

  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }

  return <>Initializing...</>;
};
