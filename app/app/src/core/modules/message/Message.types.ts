export type Message = {
  _id: string;
  senderId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  receiverId: {
    _id: string;
    brandName: string;
  };
  productId: {
    _id: string;
    name: string;
  };
  content: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MessageBody = {
  senderId: string;
  receiverId: string;
  productId: string;
  content: string;
};
