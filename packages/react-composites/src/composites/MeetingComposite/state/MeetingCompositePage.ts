// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState } from '@azure/communication-calling';
import { CallCompositePage } from '../../CallComposite';

/**
 * Page state the {@link CallAndChatComposite} could be in.
 *
 * @beta
 */
export type CallAndChatCompositePage =
  | 'accessDeniedTeamsMeeting'
  | 'configuration'
  | 'joinMeetingFailedDueToNoNetwork'
  | 'leftMeeting'
  | 'lobby'
  | 'meeting'
  | 'removedFromMeeting';

/**
 * @private
 */
export function callPageToCallAndChatPage(page: CallCompositePage): CallAndChatCompositePage {
  switch (page) {
    case 'call':
      return 'meeting';
    case 'leftCall':
      return 'leftMeeting';
    case 'removedFromCall':
      return 'removedFromMeeting';
    case 'joinCallFailedDueToNoNetwork':
      return 'joinMeetingFailedDueToNoNetwork';
    default:
      return page;
  }
}

/**
 * @private
 */
export function callAndChatPageToCallPage(page: CallAndChatCompositePage): CallCompositePage {
  switch (page) {
    case 'meeting':
      return 'call';
    case 'leftMeeting':
      return 'leftCall';
    case 'removedFromMeeting':
      return 'removedFromCall';
    case 'joinMeetingFailedDueToNoNetwork':
      return 'joinCallFailedDueToNoNetwork';
    default:
      return page;
  }
}

/**
 * @private
 */
export const hasJoinedCall = (page: CallAndChatCompositePage, callStatus: CallState): boolean =>
  page === 'meeting' && callStatus === 'Connected';
