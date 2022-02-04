// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MessageStatus } from '@internal/acs-ui-common';
import { CommunicationParticipant } from './CommunicationParticipant';

/**
 * Indicate whether a chat message should be displayed merged with the message before / after it.
 *
 * Useful to merge many messages from the same sender into a single message bubble.
 *
 * @public
 */
export type MessageAttachedStatus = 'bottom' | 'top' | boolean;

/**
 * Supported types of chat message content.
 *
 * @public
 */
export type MessageContentType = 'text' | 'html' | 'richtext/html' | 'unknown';

/**
 * Discriminated union of all messages.
 *
 * The `messageType` field specializes into union variants.
 *
 * @public
 */
export type Message = ChatMessage | SystemMessage | CustomMessage;

/**
 * Discriminated union of all system messages.
 *
 * The `systemMessageType` field specializes into union variants.
 *
 * @public
 */
export type SystemMessage =
  | ParticipantAddedSystemMessage
  | ParticipantRemovedSystemMessage
  | TopicUpdatedSystemMessage
  | ContentSystemMessage;

/**
 * A chat message read receipt indicates the time a chat message was read by a recipient.
 *
 * @public
 */
export interface ReadReceipt {
  /** Identifies a participant in Azure Communication services. A participant is, for example, a phone number or an Azure communication user. This model must be interpreted as a union: Apart from rawId, at most one further property may be set. */
  senderId: string;
  /** Id of the chat message that has been read. This id is generated by the server. */
  chatMessageId: string;
  /** The time at which the message was read. The timestamp is in RFC3339 format: `yyyy-MM-ddTHH:mm:ssZ`. */
  readOn: Date;
}

/**
 * A chat message.
 *
 * @public
 */
export interface ChatMessage extends MessageCommon {
  messageType: 'chat';

  content?: string;
  editedOn?: Date;
  deletedOn?: Date;
  senderId?: string;
  senderDisplayName?: string;
  status?: MessageStatus;
  attached?: MessageAttachedStatus;
  mine?: boolean;
  clientMessageId?: string;
  contentType: MessageContentType;
  readReceipts?: ReadReceipt[];
  /**
   * Total number of participants in the message thread. This is used to display how many participants out of a total have read a message.
   */
  messageThreadParticipantCount?: number;
  /**
   * A metadata field for the message.
   * {@link @azure/communication-chat#ChatMessage.metadata}
   */
  metadata?: Record<string, string>;
}
/**
 * A system message notifying that a participant was added to the chat thread.
 *
 * @public
 */
export interface ParticipantAddedSystemMessage extends SystemMessageCommon {
  systemMessageType: 'participantAdded';

  participants: CommunicationParticipant[];
}

/**
 * A system message notifying that a participant was removed from the chat thread.
 *
 * @public
 */
export interface ParticipantRemovedSystemMessage extends SystemMessageCommon {
  systemMessageType: 'participantRemoved';

  participants: CommunicationParticipant[];
}

/**
 * A system message notifying that the chat thread topic was updated.
 *
 * @public
 */
export interface TopicUpdatedSystemMessage extends SystemMessageCommon {
  systemMessageType: 'topicUpdated';

  topic: string;
}

/**
 * A system message with arbitary content.
 *
 * @public
 */
export interface ContentSystemMessage extends SystemMessageCommon {
  systemMessageType: 'content';

  content: string;
}

/**
 * A custom message type.
 *
 * Custom messages are not rendered by default, but applications can provide custom renderers for them.
 *
 * @public
 */
export interface CustomMessage extends MessageCommon {
  messageType: 'custom';

  content: string;
}

/**
 * Common properties of all system messages.
 *
 * @public
 */
export interface SystemMessageCommon extends MessageCommon {
  messageType: 'system';
  iconName: string;
}

/**
 * Common properties of all message types.
 *
 * @public
 */
export interface MessageCommon {
  messageId: string;
  // ISO8601 format: `yyyy-MM-ddTHH:mm:ssZ`
  createdOn: Date;
}
