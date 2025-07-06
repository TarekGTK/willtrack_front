export interface Notifications {
  id?: number;
  message: string;
  senduserId: number;
  offerId: number;
  receiveuserId: number;
  isRead: boolean;
  createdAtTime?: Date;
  createdAtDate?: Date;
  createdAt?: Date;
}
