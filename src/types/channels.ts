export type Channel = {
  id: number;
  name: string;
  description: string;
  owner: string;
  createdAt: string;
  isActive: boolean;
  isSub: boolean;
};

export type Type = {
  id?: number;
  name: string;
  price: number;
  period: number;
};

export type Subscription = {
  id: number;
  subscriberId: string;
  channelId: number;
  startDate: Date;
  endDate: Date;
  subscriptionType: string;
  isActive: boolean;
};
