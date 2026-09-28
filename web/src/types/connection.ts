export type Connection = {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateConnectionInput = {
  name: string;
};

export type UpdateConnectionInput = {
  name: string;
};
