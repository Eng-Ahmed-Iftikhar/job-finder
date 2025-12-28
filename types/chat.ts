import { User, UserProfile } from "./api/auth";

export enum CHAT_TYPE {
  PRIVATE = "PRIVATE",
  GROUP = "GROUP",
}

export type Chat = {
  id: string;
  type: CHAT_TYPE;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  countUnseenMessages: { senderId: string; count: number }[];
  users: ChatUser[];
  group?: ChatGroup | null;
  messages: ChatMessage[];
  blocks: ChatBlock[];
};

export enum CHAT_USER_ROLE {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export type ChatUser = {
  id: string;
  chatId: string;
  userId: string;
  role: CHAT_USER_ROLE;
  joinedAt: Date;
  leftAt?: Date | null;
  deletedAt?: Date | null;
  lastReadMessageId?: string | null;
  lastMessage: ChatMessage | null;
  mutedUntil?: Date | null;
  chat: Chat;
  user: User & {
    profile: {
      firstName: string;
      lastName: string;
      pictureUrl?: string | null;
    };
  };
  messageStatuses: MessageUserStatus[];
  lastReadMessage?: ChatMessage | null;
};

export type ChatGroup = {
  id: string;
  chatId: string;
  name: string;
  description?: string;
  iconUrl?: string;
  createdAt: Date;
  deletedAt?: Date;
  chat: Chat;
};

export enum CHAT_MESSAGE_TYPE {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  FILE = "FILE",
}
export enum CHAT_MESSAGE_STATUS {
  PENDING = "PENDING",
  SENT = "SENT",
  FAILED = "FAILED",
}

export type ChatMessage = {
  id: string;
  chatId: string;
  senderId: string;
  text?: string | null;
  fileUrl?: string | null;
  messageType: CHAT_MESSAGE_TYPE;
  status: CHAT_MESSAGE_STATUS;
  createdAt: Date;
  deletedAt?: Date | null;
  chat?: Chat;
  reactions?: MessageReaction[];
  replies?: MessageReply[];
  userStatuses?: MessageUserStatus[];
  sender?: User;
};

export type ChatMessagesByDate = {
  date: Date;
  messages: ChatMessage[];
};

export type MessageReaction = {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: Date;
  deletedAt?: Date | null;
  message: ChatMessage;
  user: User;
};

export type MessageReply = {
  id: string;
  messageId: string;
  replyToId?: string | null;
  userId: string;
  text?: string | null;
  createdAt: Date;
  deletedAt?: Date | null;
  message: ChatMessage;
  replyTo?: ChatMessage | null;
  user: User;
};

export type MessageUserStatus = {
  id: string;
  messageId: string;
  userId: string;
  receivedAt?: Date | null;
  seenAt?: Date | null;
  message: ChatMessage;
  user: User;
  chatUser?: ChatUser | null;
};

export type ChatBlock = {
  id: string;
  blockedBy: string;
  blockedTo: string;
  chatId?: string | null;
  createdAt: Date;
  deletedAt?: Date | null;
  blocker: User;
  blocked: User;
  chat?: Chat | null;
};

export type ChatMessageFile = {
  uri: string;
  type: string;
  name: string;
};
