export type Contact = {
  id: string;
  name: string;
  phone: string;
  connectionId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateContactInput = {
  name: string;
  phone: string;
};

export type UpdateContactInput = {
  name: string;
  phone: string;
};
