export type MessageStatus = "sent" | "scheduled";

export type Message = {
  id: string;
  body: string;
  contactIds: string[];
  connectionId: string;
  userId: string;
  status: MessageStatus;
  scheduledAt: Date | null;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateMessageInput = {
  body: string;
  contactIds: string[];
  scheduledAt?: Date | null;
};

export type UpdateMessageInput = {
  body: string;
  contactIds: string[];
  scheduledAt?: Date | null;
};
